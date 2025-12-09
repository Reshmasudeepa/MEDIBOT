import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { action, userId, testTime } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });
    }

    const now = new Date();

    switch (action) {
      case 'create-test-reminder':
        // Create a test reminder for current time + 2 minutes
        const testReminderTime = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes from now
        const hours = testReminderTime.getHours();
        const minutes = testReminderTime.getMinutes();
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        const testReminder = {
          userId,
          medicationId: `test_${Date.now()}`,
          medicationName: "Test Medication",
          dosage: "1 tablet",
          time: timeString,
          hours,
          minutes,
          active: true,
          createdAt: now,
          lastSent: null,
          nextScheduled: testReminderTime,
          isTest: true // Mark as test reminder
        };

        const reminderRef = await addDoc(collection(db, "scheduledReminders"), testReminder);
        
        return NextResponse.json({
          success: true,
          testReminderId: reminderRef.id,
          scheduledFor: testReminderTime.toISOString(),
          timeString,
          message: `Test reminder created for ${timeString} (${Math.round((testReminderTime.getTime() - now.getTime()) / 1000)} seconds from now)`
        });

      case 'simulate-current-time':
        // Temporarily create a reminder for the current time to test immediate triggering
        const currentTime = testTime || `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const [currentHours, currentMinutes] = currentTime.split(':').map(Number);

        const immediateReminder = {
          userId,
          medicationId: `immediate_test_${Date.now()}`,
          medicationName: "Immediate Test Medication",
          dosage: "1 tablet",
          time: currentTime,
          hours: currentHours,
          minutes: currentMinutes,
          active: true,
          createdAt: now,
          lastSent: null,
          nextScheduled: now,
          isTest: true
        };

        const immediateRef = await addDoc(collection(db, "scheduledReminders"), immediateReminder);
        
        return NextResponse.json({
          success: true,
          testReminderId: immediateRef.id,
          time: currentTime,
          message: `Immediate test reminder created for current time (${currentTime})`
        });

      case 'cleanup-test-reminders':
        // Clean up all test reminders
        const testReminders = query(
          collection(db, "scheduledReminders"),
          where("isTest", "==", true)
        );
        const testSnapshot = await getDocs(testReminders);
        
        const deletePromises = testSnapshot.docs.map(async (docSnap) => {
          await deleteDoc(docSnap.ref);
        });
        await Promise.all(deletePromises);

        return NextResponse.json({
          success: true,
          deletedCount: testSnapshot.docs.length,
          message: `Cleaned up ${testSnapshot.docs.length} test reminders`
        });

      case 'list-user-reminders':
        // List all reminders for a user
        const userReminders = query(
          collection(db, "scheduledReminders"),
          where("userId", "==", userId)
        );
        const userSnapshot = await getDocs(userReminders);
        
        const reminders = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
          lastSent: doc.data().lastSent?.toDate?.()?.toISOString(),
          nextScheduled: doc.data().nextScheduled?.toDate?.()?.toISOString()
        }));

        return NextResponse.json({
          success: true,
          count: reminders.length,
          reminders
        });

      default:
        return NextResponse.json({
          success: false,
          error: "Unknown action",
          availableActions: [
            'create-test-reminder',
            'simulate-current-time', 
            'cleanup-test-reminders',
            'list-user-reminders'
          ]
        }, { status: 400 });
    }

  } catch (error) {
    console.error("❌ Test API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // Simple status check
  return NextResponse.json({
    success: true,
    message: "Reminder test API is running",
    timestamp: new Date().toISOString(),
    currentTime: new Date().toLocaleTimeString(),
    instructions: {
      "Test immediate reminder": "POST with { action: 'simulate-current-time', userId: 'your-user-id' }",
      "Test future reminder": "POST with { action: 'create-test-reminder', userId: 'your-user-id' }",
      "List user reminders": "POST with { action: 'list-user-reminders', userId: 'your-user-id' }",
      "Cleanup test data": "POST with { action: 'cleanup-test-reminders', userId: 'your-user-id' }"
    }
  });
}