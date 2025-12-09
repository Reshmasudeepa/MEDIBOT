# Environment Variables Setup for Precise Medication Reminders

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Firebase Admin SDK (for server-side push notifications)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"

# App URL (for cron job callbacks)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Cron Security (optional but recommended)
CRON_SECRET=your-secret-key-for-cron-security
```

## How to Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Extract the values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## Deployment Setup

### Vercel Deployment
1. Add environment variables in Vercel dashboard
2. The `vercel.json` file automatically sets up cron jobs
3. Cron will run every minute to check for due reminders

### Manual Testing
```bash
# Test reminder scheduling
curl -X POST http://localhost:3000/api/schedule-reminder \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","medicationId":"test-med","reminderTimes":["14:30"],"medicationName":"Test Medicine","dosage":"1 tablet"}'

# Test reminder checking
curl http://localhost:3000/api/check-reminders

# Test cron endpoint
curl -H "Authorization: Bearer your-cron-secret" \
  http://localhost:3000/api/cron
```

## Features

✅ **Server-side scheduling** - No browser dependency
✅ **Precise timing** - Checks every minute for due reminders  
✅ **Mobile push notifications** - Works even when app is closed
✅ **Automatic rescheduling** - Repeats daily automatically
✅ **Error handling** - Robust error logging and recovery
✅ **Cross-platform** - Works on Android, iOS, and desktop
