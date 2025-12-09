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

export async function POST(request: Request) {
  try {
    const { userId = "anonymous" } = await request.json();
    
    console.log("⬇️ Recording download...");
    
    const db = admin.firestore();
    
    // Record the download using Admin SDK
    const downloadData = {
      timestamp: new Date().toISOString(),
      userId,
      userAgent: request.headers.get('user-agent') || 'unknown',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };
    
    const docRef = await db.collection("downloads").add(downloadData);
    
    console.log(`✅ Download recorded successfully: ${docRef.id}`);
    
    return NextResponse.json({
      success: true,
      downloadId: docRef.id,
      timestamp: downloadData.timestamp
    });
    
  } catch (error) {
    console.error("❌ Error recording download:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      }, 
      { status: 500 }
    );
  }
}