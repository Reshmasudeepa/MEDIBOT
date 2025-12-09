

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { credential } from "firebase-admin";

const { StandardCheckoutClient, Env, StandardCheckoutPayRequest } = require("pg-sdk-node");

// Initialize Firebase Admin
let admin_db: any = null;
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
// Only initialize if not already done and all credentials present
if (!getApps().length && projectId && clientEmail && rawPrivateKey) {
  try {
    // Normalize privateKey PEM: trim, strip quotes, convert line endings
    let privateKey = rawPrivateKey.trim();
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1).trim();
    }
    // Convert literal \n to actual newlines, handle Windows CRLF
    privateKey = privateKey.replace(/\\n/g, '\n').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    initializeApp({
      credential: credential.cert({ projectId, clientEmail, privateKey }),
    });
    admin_db = getFirestore();
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
  }
} else if (getApps().length) {
  admin_db = getFirestore();
}

// Initialize the PhonePe Standard Checkout Client (trim any stray whitespace)
const clientId = process.env.PHONEPE_CLIENT_ID?.trim();
const clientSecret = process.env.PHONEPE_CLIENT_SECRET?.trim();
// Determine PhonePe SDK environment: use PHONEPE_ENV if set, else NODE_ENV
const envSetting = process.env.PHONEPE_ENV?.toUpperCase();
const env = envSetting === "PRODUCTION"
  ? Env.PRODUCTION
  : envSetting === "SANDBOX"
    ? Env.SANDBOX
    : process.env.NODE_ENV === "production"
      ? Env.PRODUCTION
      : Env.SANDBOX;

let phonepeClient: any = null;

// Initialize PhonePe client
if (clientId && clientSecret) {
  try {
    phonepeClient = StandardCheckoutClient.getInstance(clientId, clientSecret, 1, env);
  } catch (error) {
    console.error("Failed to initialize PhonePe client:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[PhonePe] Incoming request body:", body);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://medibot-ai.com";
    const { amount, userId, planName } = body;

    // Validate required fields
    if (!phonepeClient) {
      return NextResponse.json(
        {
          success: false,
          message: "PhonePe client not initialized. Check environment variables.",
        },
        { status: 500 }
      );
    }

    if (!userId || !amount || !planName) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: userId, amount, or planName",
          debug: { userId, amount, planName },
        },
        { status: 400 }
      );
    }

    const merchantTransactionId = `MEDIBOT-${planName.toUpperCase()}-${randomUUID()}`;
    const amountInPaise = amount * 100;

    // The URL the user will be redirected to after payment completion/failure
    const redirectUrl = `${baseUrl}/api/phonepe-callback?merchantTransactionId=${merchantTransactionId}&planName=${planName}&userId=${userId}`;

    try {
      // Use the SDK to create a new payment request
      const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantTransactionId)
        .amount(amountInPaise)
        .redirectUrl(redirectUrl)
        .build();

      const response = await phonepeClient.pay(request);

      if (!response || !response.redirectUrl) {
        console.error("PhonePe SDK Error:", response);
        throw new Error("Failed to get redirect URL from PhonePe.");
      }

      // Log the transaction attempt in Firestore
      try {
        if (admin_db) {
          await admin_db.collection('payments').doc(merchantTransactionId).set({
            userId: userId,
            planName: planName,
            amount: amount,
            amountInPaise: amountInPaise,
            merchantTransactionId: merchantTransactionId,
            status: 'pending_payment_gateway',
            createdAt: new Date(),
            paymentHistory: [{
              at: new Date().toISOString(),
              action: "attemptedOnline",
              note: `Initiated transaction ${merchantTransactionId} for ${planName} plan`
            }]
          });
        }
      } catch (dbError) {
        console.error("Error logging to Firestore:", dbError);
        // Continue with payment even if logging fails
      }

      console.log(`Successfully initiated payment for user ${userId}, plan ${planName}`);
      
      return NextResponse.json({
        success: true,
        data: {
          redirectUrl: response.redirectUrl,
          merchantTransactionId: merchantTransactionId
        },
        message: "Payment initiated successfully"
      });

    } catch (error) {
      console.error("Error initiating PhonePe payment:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Could not initiate payment with PhonePe.",
          debug: error instanceof Error ? error.message : error
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[PhonePe] payment error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        debug: error?.message || error,
      },
      { status: 500 }
    );
  }
}