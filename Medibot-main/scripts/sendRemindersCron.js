// Node.js cron job for backend medication reminders
// Save as scripts/sendRemindersCron.js

const admin = require('firebase-admin');
const fetch = require('node-fetch');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

async function sendPush(token, title, body) {
  try {
    const response = await fetch('http://medibot-ai.com/api/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, title, body }),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Push notification failed');
    console.log('Push sent:', title, body);
  } catch (err) {
    console.error('Push error:', err);
  }
}

async function checkAndSendReminders() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const usersSnap = await db.collection('users').get();
  for (const userDoc of usersSnap.docs) {
    const user = userDoc.data();
    if (!user.fcmToken) continue;
    const medsSnap = await db.collection('medications').where('userId', '==', userDoc.id).get();
    for (const medDoc of medsSnap.docs) {
      const med = medDoc.data();
      if (!med.reminderTimes || !Array.isArray(med.reminderTimes)) continue;
      for (const time of med.reminderTimes) {
        const [h, m] = time.split(':').map(Number);
        if (h === hour && m === minute) {
          const title = `Medication Reminder: ${med.name}`;
          const body = `It's time to take your ${med.name} (${med.dosage}) at ${time}.`;
          await sendPush(user.fcmToken, title, body);
        }
      }
    }
  }
}

// Run every minute
checkAndSendReminders().then(() => process.exit());
