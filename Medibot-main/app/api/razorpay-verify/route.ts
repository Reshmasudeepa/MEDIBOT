
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin if needed (reusing logic from stats/schedule-reminder)
// For brevity, assuming admin is initialized in other routes or here safely.
if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

        if (projectId && clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
        }
    } catch (e) {
        console.error("Firebase init failed in razorpay-verify:", e);
    }
}

const key_secret = process.env.RAZORPAY_KEY_SECRET || "nMiWN4jstzWZBJ7SarCtT9os";

export async function POST(req: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            planName,
            amount
        } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment successful, update database
            try {
                if (admin.apps.length) {
                    const db = getFirestore();
                    await db.collection('payments').add({
                        userId,
                        planName,
                        amount,
                        provider: 'razorpay',
                        orderId: razorpay_order_id,
                        paymentId: razorpay_payment_id,
                        status: 'success',
                        createdAt: new Date(),
                    });

                    // Also update user plan if needed (this logic depends on your app structure)
                    // For now just logging payment
                }
            } catch (dbError) {
                console.error("Error saving payment to DB:", dbError);
            }

            return NextResponse.json({
                success: true,
                message: "Payment verified successfully",
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid signature",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
