import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { credential } from "firebase-admin";

const { StandardCheckoutClient, Env } = require("pg-sdk-node");

// Initialize Firebase Admin
let admin_db: any = null;
const projectId_st = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail_st = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey_st = process.env.FIREBASE_PRIVATE_KEY;
if (!getApps().length && projectId_st && clientEmail_st && rawPrivateKey_st) {
  try {
    const privateKey = rawPrivateKey_st.replace(/\\n/g, '\n');
    initializeApp({
      credential: credential.cert({ projectId: projectId_st, clientEmail: clientEmail_st, privateKey }),
    });
    admin_db = getFirestore();
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
  }
} else if (getApps().length) {
  admin_db = getFirestore();
}

// Initialize PhonePe client (trim stray whitespace/newlines)
const clientId = process.env.PHONEPE_CLIENT_ID?.trim();
const clientSecret = process.env.PHONEPE_CLIENT_SECRET?.trim();
const env = process.env.NODE_ENV === "production" ? Env.PRODUCTION : Env.SANDBOX;

let phonepeClient: any = null;

if (clientId && clientSecret) {
  try {
    phonepeClient = StandardCheckoutClient.getInstance(clientId, clientSecret, 1, env);
  } catch (error) {
    console.error("Failed to initialize PhonePe client:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: "TransactionId required" },
        { status: 400 }
      );
    }

    if (!phonepeClient) {
      return NextResponse.json(
        { success: false, message: "PhonePe client not initialized" },
        { status: 500 }
      );
    }

    try {
      // Check payment status with PhonePe SDK
      const statusResponse = await phonepeClient.checkStatus(transactionId);
      
      // Update local database with the status
      if (admin_db && statusResponse) {
        const paymentRef = admin_db.collection('payments').doc(transactionId);
        const paymentDoc = await paymentRef.get();
        
        if (paymentDoc.exists) {
          const isSuccess = statusResponse.state === 'COMPLETED' && statusResponse.responseCode === 'SUCCESS';
          
          await paymentRef.update({
            status: isSuccess ? 'completed' : 'failed',
            phonepeResponse: statusResponse,
            updatedAt: new Date()
          });

          // If payment successful, update user subscription
          if (isSuccess) {
            const paymentData = paymentDoc.data();
            if (paymentData?.userId && paymentData?.planName) {
              const userRef = admin_db.collection('users').doc(paymentData.userId);
              await userRef.update({
                subscription: {
                  plan: paymentData.planName.toLowerCase(),
                  status: 'active',
                  startDate: new Date(),
                  endDate: paymentData.planName.toLowerCase() === 'premium' 
                    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days for monthly
                    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 days for yearly
                  lastPaymentId: transactionId
                },
                updatedAt: new Date()
              });
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: statusResponse,
        transactionId
      });

    } catch (statusError) {
      console.error("Error checking PhonePe status:", statusError);
      return NextResponse.json(
        { success: false, message: "Failed to check payment status", error: statusError },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const merchantTransactionId = searchParams.get('merchantTransactionId');
    
    if (!merchantTransactionId) {
      return NextResponse.json(
        { success: false, message: "Missing merchantTransactionId" },
        { status: 400 }
      );
    }

    if (!phonepeClient) {
      return NextResponse.json(
        { success: false, message: "PhonePe client not initialized" },
        { status: 500 }
      );
    }

    try {
      // Check payment status with PhonePe
      const statusResponse = await phonepeClient.checkStatus(merchantTransactionId);
      
      return NextResponse.json({
        success: true,
        data: statusResponse,
        merchantTransactionId
      });

    } catch (statusError) {
      console.error("Error checking PhonePe status:", statusError);
      return NextResponse.json(
        { success: false, message: "Failed to check payment status", error: statusError },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
