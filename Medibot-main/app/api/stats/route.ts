import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK (only once)
// Initialize Firebase Admin SDK (only once)
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
    } else {
      console.warn("Firebase Admin environment variables missing in /api/stats");
    }
  } catch (error) {
    console.error("Firebase Admin initialization failed in /api/stats:", error);
  }
}

export async function GET() {
  try {
    console.log("📊 Fetching app statistics...");

    const db = admin.firestore();

    // Fetch user count using Admin SDK
    const usersCollection = db.collection("users");
    const usersSnapshot = await usersCollection.get();
    const userCount = usersSnapshot.size;

    console.log(`📈 Found ${userCount} users`);

    // Fetch download count using Admin SDK
    const downloadsCollection = db.collection("downloads");
    const downloadsSnapshot = await downloadsCollection.get();
    const downloadCount = downloadsSnapshot.size;

    console.log(`⬇️ Found ${downloadCount} downloads`);

    return NextResponse.json({
      success: true,
      data: {
        userCount,
        downloadCount
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Error fetching statistics:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        data: {
          userCount: 0,
          downloadCount: 0
        }
      },
      { status: 500 }
    );
  }
}