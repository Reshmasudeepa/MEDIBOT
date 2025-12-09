# MediBot Reminder System Setup

## Overview
The MediBot reminder system now supports reliable daily medication reminders through a combination of server-side scheduling and external cron job triggers.

## Architecture

### 1. Storage (`/api/schedule-reminder`)
- Stores medication reminders in Firestore `scheduledReminders` collection
- Each reminder has: userId, medicationId, medicationName, dosage, time, hours, minutes, active status
- Tracks lastSent timestamp to prevent duplicate daily sends

### 2. Checking (`/api/check-reminders`)
- Scans all active reminders for due notifications (5-minute window)
- Sends FCM push notifications to user devices
- Updates lastSent timestamp and schedules next occurrence
- Improved logging and error handling

### 3. Triggering (`/api/trigger`)
- Simple webhook endpoint for external cron services
- Supports `?action=check-reminders` or `?action=cron`
- Can be called by services like UptimeRobot, Cronitor, or GitHub Actions

### 4. Maintenance (`/api/cron`)
- Calls check-reminders API every time it runs
- Cleanup old records at midnight
- Comprehensive logging and status reporting

## Setup Instructions

### Option 1: External Cron Service (Recommended)

1. **UptimeRobot** (Free):
   - Create HTTP monitor
   - URL: `https://yourdomain.com/api/trigger?action=check-reminders`
   - Interval: Every 5 minutes
   - This will check for reminders throughout the day

2. **GitHub Actions** (Free):
   ```yaml
   name: Medication Reminders
   on:
     schedule:
       - cron: '*/5 * * * *'  # Every 5 minutes
   jobs:
     trigger-reminders:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger Reminder Check
           run: |
             curl -X GET "https://yourdomain.com/api/trigger?action=check-reminders"
   ```

3. **Cronitor** (Free tier available):
   - Create HTTP monitor
   - URL: `https://yourdomain.com/api/trigger?action=check-reminders`
   - Schedule: `*/5 * * * *` (every 5 minutes)

### Option 2: Vercel Cron Jobs (Pro Plan Required)

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Option 3: Self-Hosted Cron

Add to crontab:
```bash
# Check reminders every 5 minutes
*/5 * * * * curl -X GET "https://yourdomain.com/api/trigger?action=check-reminders"

# Daily maintenance at midnight
0 0 * * * curl -X GET "https://yourdomain.com/api/trigger?action=cron"
```

## Testing

### Manual Testing
```bash
# Test reminder check
curl "https://yourdomain.com/api/trigger?action=check-reminders"

# Test full cron job
curl "https://yourdomain.com/api/trigger?action=cron"

# Direct reminder check
curl "https://yourdomain.com/api/check-reminders"
```

### Check Logs
Monitor the console logs for:
- `🔔 Checking for due medication reminders...`
- `📅 Due reminder found: [medication] at [time]`
- `✅ Notification sent for [medication]`
- `📊 Notification results: X successful, Y failed`

## Key Improvements

1. **Wider Time Window**: 5-minute window instead of 1-minute for better reliability
2. **Better Logging**: Detailed logs for debugging and monitoring
3. **Duplicate Prevention**: Tracks lastSent date to prevent multiple sends per day
4. **Error Handling**: Graceful handling of FCM token issues and network errors
5. **Flexible Triggering**: Multiple ways to trigger reminder checks
6. **Status Tracking**: Tracks total sends and next scheduled time

## Environment Variables

Required in `.env.local`:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
CRON_SECRET=medibot-cron-2024
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Monitoring

Monitor the reminder system by:
1. Checking API response logs
2. Verifying FCM notification delivery
3. Monitoring user feedback on missed reminders
4. Using external uptime monitoring services

The system now provides reliable daily medication reminders that work even when the user's app is closed or their device is offline.