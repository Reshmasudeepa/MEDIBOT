import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
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
      console.warn("Firebase Admin environment variables missing in /api/schedule-reminder");
    }
  } catch (error) {
    console.error("Firebase Admin initialization failed in /api/schedule-reminder:", error);
  }
}

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const { userId, medicationId, reminderTimes, medicationName, dosage } = await req.json();

    if (!userId || !medicationId || !reminderTimes?.length) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Validate time format (HH:MM) and filter invalid entries
    const validTimes = (reminderTimes || []).filter((t: string) => {
      if (typeof t !== 'string') return false;
      const match = t.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
      return !!match;
    });

    if (!validTimes.length) {
      return NextResponse.json({ success: false, error: "No valid reminder times provided" }, { status: 400 });
    }

    // Clear existing reminders for this medication
    const existingReminders = await db.collection("scheduledReminders")
      .where("medicationId", "==", medicationId)
      .get();

    const deletePromises = existingReminders.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    // Schedule new reminders for each time
    const schedulePromises = validTimes.map(async (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);

      // Create reminder document
      const reminderData = {
        userId,
        medicationId,
        medicationName,
        dosage,
        time: time,
        hours,
        minutes,
        active: true,
        createdAt: new Date(),
        lastSent: null,
        nextScheduled: getNextScheduledTime(hours, minutes)
      };

      const reminderId = `${medicationId}_${time.replace(":", "")}`;
      await db.collection("scheduledReminders").doc(reminderId).set(reminderData);
    });

    await Promise.all(schedulePromises);

    return NextResponse.json({ success: true, message: "Reminders scheduled successfully" });
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    console.error("Error scheduling reminder:", error);
    return NextResponse.json({ success: false, error: `Failed to schedule reminder: ${errorMessage}` }, { status: 500 });
  }
}

function getNextScheduledTime(hours: number, minutes: number): Date {
  const now = new Date();
  const scheduled = new Date();
  scheduled.setHours(hours, minutes, 0, 0);

  // If time has passed today, schedule for tomorrow
  if (scheduled <= now) {
    scheduled.setDate(scheduled.getDate() + 1);
  }

  return scheduled;
}

export async function DELETE(req: Request) {
  try {
    const { medicationId } = await req.json();

    if (!medicationId) {
      return NextResponse.json({ success: false, error: "Medication ID required" }, { status: 400 });
    }

    // Delete all reminders for this medication
    const reminders = await db.collection("scheduledReminders")
      .where("medicationId", "==", medicationId)
      .get();

    const deletePromises = reminders.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    return NextResponse.json({ success: true, message: "Reminders cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling reminders:", error);
    return NextResponse.json({ success: false, error: "Failed to cancel reminders" }, { status: 500 });
  }
}
