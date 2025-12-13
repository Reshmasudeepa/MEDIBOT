
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { randomUUID } from "crypto";

// Initialize Razorpay
// We use simple fallback to hardcoded (if user wants) or preferably env vars
// Given the user prompt, I will use env vars but fallback to what they provided if env is missing?
// No, hardcoding in code is cleaner for "Try this now" debugging but bad practice.
// I will use process.env and instruct user to set them.
// But to ensure it works IMMEDIATELY as requested, I might default to their provided values if env is missing.
const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_RbCZ4pR7DKMosu";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "nMiWN4jstzWZBJ7SarCtT9os";

const razorpay = new Razorpay({
    key_id,
    key_secret,
});

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = "INR", receipt } = await req.json();

        if (!amount) {
            return NextResponse.json(
                { success: false, message: "Amount is required" },
                { status: 400 }
            );
        }

        // Amount in Razorpay is in paise (100 paise = 1 INR)
        // We assume 'amount' passed is in INR.
        const amountInPaise = Math.round(amount * 100);

        const options = {
            amount: amountInPaise,
            currency,
            receipt: receipt || `receipt_${randomUUID()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            order,
            key_id, // Return key_id so client can use it
        });
    } catch (error) {
        console.error("Razorpay order creation failed:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Could not create order",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
