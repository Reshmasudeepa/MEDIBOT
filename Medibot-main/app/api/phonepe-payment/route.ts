
import { NextRequest, NextResponse } from "next/server";

// const { StandardCheckoutClient, Env, StandardCheckoutPayRequest } = require("pg-sdk-node");

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { success: false, message: "PhonePe payment integration temporarily disabled on Vercel due to SDK incompatibility." },
    { status: 503 }
  );
}