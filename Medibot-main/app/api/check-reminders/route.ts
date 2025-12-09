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

export async function GET() {
  try {
    console.log("🔔 Checking for due medication reminders...");
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight
    
    // Query for active reminders using Admin SDK
    const db = admin.firestore();
    const remindersRef = db.collection("scheduledReminders");
    const activeReminders = remindersRef.where("active", "==", true);
    const snapshot = await activeReminders.get();
    
    console.log(`🔍 Checking ${snapshot.docs.length} active reminders at ${now.toLocaleTimeString()}`);
    
    const dueReminders: any[] = [];
    
    snapshot.forEach((doc) => {
      const reminder = doc.data();
      const reminderTime = reminder.hours * 60 + reminder.minutes;
      
      // Check if reminder is due (within 5-minute window for more reliability)
      const timeDiff = Math.abs(currentTime - reminderTime);
      const isWithinWindow = timeDiff <= 5 || timeDiff >= (24 * 60 - 5); // Handle midnight rollover
      
      // Check if we haven't sent this reminder today
      const lastSent = reminder.lastSent?.toDate ? reminder.lastSent.toDate() : reminder.lastSent;
      const isToday = lastSent && lastSent.toDateString() === now.toDateString();
      
      if (isWithinWindow && !isToday) {
        console.log(`📅 Due reminder found: ${reminder.medicationName} at ${reminder.time} (last sent: ${lastSent ? lastSent.toDateString() : 'never'})`);
        dueReminders.push({ id: doc.id, ...reminder });
      } else if (isWithinWindow && isToday) {
        console.log(`⏭️ Skipping already sent today: ${reminder.medicationName} at ${reminder.time}`);
      }
    });
    
    console.log(`Found ${dueReminders.length} due reminders out of ${snapshot.docs.length} total active reminders`);
    
    if (dueReminders.length === 0) {
      return NextResponse.json({ 
        success: true, 
        processed: 0,
        message: "No due reminders at this time",
        currentTime: now.toLocaleTimeString(),
        totalActiveReminders: snapshot.docs.length
      });
    }
    
    // Send notifications for due reminders
    const notificationPromises = dueReminders.map(async (reminder) => {
      try {
        // Get user's FCM token using Admin SDK
        const userDocRef = db.collection("users").doc(reminder.userId);
        const userDoc = await userDocRef.get();
        const fcmToken = userDoc.data()?.fcmToken;
        
        if (fcmToken) {
          const message = {
            token: fcmToken,
            notification: {
              title: `💊 Time for ${reminder.medicationName}`,
              body: `Take your ${reminder.medicationName} (${reminder.dosage}) now`
            },
            data: {
              type: "medication_reminder",
              medicationId: reminder.medicationId,
              medicationName: reminder.medicationName,
              dosage: reminder.dosage,
              time: reminder.time,
              timestamp: Date.now().toString()
            },
            android: {
              priority: "high" as const,
              notification: {
                channelId: "medication_reminders",
                priority: "high" as const,
                defaultSound: true,
                defaultVibrateTimings: true
              }
            },
            apns: {
              payload: {
                aps: {
                  alert: {
                    title: `💊 Time for ${reminder.medicationName}`,
                    body: `Take your ${reminder.medicationName} (${reminder.dosage}) now`
                  },
                  sound: "default",
                  badge: 1
                }
              }
            }
          };
          
          // Send FCM notification
          const response = await admin.messaging().send(message);
          console.log(`✅ Notification sent for ${reminder.medicationName} to user ${reminder.userId}:`, response);
          
          // Update lastSent timestamp and track successful sends using Admin SDK
          const reminderDocRef = db.collection("scheduledReminders").doc(reminder.id);
          await reminderDocRef.update({
            lastSent: now,
            nextScheduled: getNextScheduledTime(reminder.hours, reminder.minutes),
            totalSent: (reminder.totalSent || 0) + 1
          });
          
          return { 
            success: true, 
            medicationName: reminder.medicationName,
            time: reminder.time,
            userId: reminder.userId
          };
        } else {
          console.log(`❌ No FCM token for user ${reminder.userId}`);
          return { 
            success: false, 
            error: "No FCM token", 
            medicationName: reminder.medicationName,
            time: reminder.time,
            userId: reminder.userId
          };
        }
      } catch (error) {
        console.error(`❌ Error sending notification for ${reminder.medicationName}:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // Log detailed error information for debugging
        if (error instanceof Error && error.message.includes('registration-token-not-registered')) {
          console.log(`🗑️ Invalid FCM token for user ${reminder.userId}, should cleanup`);
        }
        
        return { 
          success: false, 
          error: errorMessage, 
          medicationName: reminder.medicationName,
          time: reminder.time,
          userId: reminder.userId
        };
      }
    });
    
    const results = await Promise.all(notificationPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`📊 Notification results: ${successful} successful, ${failed} failed`);
    
    // Log individual results for debugging
    results.filter(r => r.success).forEach(r => {
      console.log(`✅ Sent: ${r.medicationName} at ${r.time} to user ${r.userId}`);
    });
    
    results.filter(r => !r.success).forEach(r => {
      console.log(`❌ Failed: ${r.medicationName} at ${r.time} to user ${r.userId} - ${r.error}`);
    });
    
    return NextResponse.json({ 
      success: true, 
      processed: dueReminders.length,
      successful,
      failed,
      results,
      timestamp: now.toISOString(),
      currentTime: now.toLocaleTimeString()
    });
    
  } catch (error) {
    console.error("❌ Error in reminder check:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

function getNextScheduledTime(hours: number, minutes: number): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hours, minutes, 0, 0);
  return tomorrow;
}

// Helper function to manually trigger reminder check (for testing)
export async function POST() {
  return GET(); // Reuse the same logic
}
