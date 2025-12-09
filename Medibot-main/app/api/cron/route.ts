import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export async function GET(req: Request) {
  try {
    // Verify this is called by a cron service (optional security check)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'medibot-cron-2024';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.log("❌ Unauthorized cron attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const now = new Date();
    console.log(`🚀 Cron job triggered at ${now.toISOString()}`);
    
    // 1. Check and send due medication reminders
    console.log("📱 Checking for due medication reminders...");
    let reminderResults;
    try {
      const reminderResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/check-reminders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      reminderResults = await reminderResponse.json();
      console.log("💊 Reminder check results:", reminderResults);
    } catch (reminderError) {
      console.error("❌ Error checking reminders:", reminderError);
      reminderResults = { success: false, error: String(reminderError) };
    }
    
    // 2. Clean up old reminder records (older than 30 days) - run once daily (at midnight)
    const currentHour = now.getHours();
    let cleanupResults = { cleanedRecords: 0 };
    
    if (currentHour === 0) { // Only run cleanup at midnight
      console.log("🧹 Running daily cleanup of old reminder records...");
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const remindersRef = collection(db, "scheduledReminders");
        const oldReminders = query(
          remindersRef, 
          where("createdAt", "<", thirtyDaysAgo)
        );
        
        const snapshot = await getDocs(oldReminders);
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        cleanupResults.cleanedRecords = snapshot.docs.length;
        console.log(`🧹 Cleaned up ${snapshot.docs.length} old reminder records`);
      } catch (cleanupError) {
        console.error("❌ Error during cleanup:", cleanupError);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      timestamp: now.toISOString(),
      reminderCheck: reminderResults,
      cleanup: cleanupResults,
      message: `Cron job completed at ${now.toLocaleTimeString()}`
    });
    
  } catch (error) {
    console.error("❌ Cron job error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
