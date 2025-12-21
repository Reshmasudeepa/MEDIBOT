import { NextRequest, NextResponse } from "next/server";

// const { StandardCheckoutClient, Env } = require("pg-sdk-node");

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { success: false, message: "PhonePe integration temporarily disabled on Vercel due to SDK incompatibility." },
    { status: 503 }
  );
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { success: false, message: "PhonePe integration temporarily disabled on Vercel due to SDK incompatibility." },
    { status: 503 }
  );
}
