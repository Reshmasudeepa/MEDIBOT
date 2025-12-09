import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { token, title, body } = await req.json();

    console.log("Push notification request:", { token: token ? "***" : "missing", title, body });

    if (!token || !title || !body) {
      console.log("Missing required fields:", { token: !!token, title: !!title, body: !!body });
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const message = {
      token,
      notification: { title, body },
      data: { timestamp: Date.now().toString() },
    };

    console.log("Sending FCM message:", message);
    const response = await admin.messaging().send(message);
    console.log("FCM response:", response);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("FCM Push Error:", error);
    const errorMessage = typeof error === "object" && error !== null && "message" in error
      ? (error as { message?: string }).message
      : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
