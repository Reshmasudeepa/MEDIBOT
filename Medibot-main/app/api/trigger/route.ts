import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'check-reminders';
    
    console.log(`🚀 Trigger API called for action: ${action}`);
    
    // Get the base URL for internal API calls
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    let result;
    
    switch (action) {
      case 'check-reminders':
        // Trigger reminder check
        const reminderResponse = await fetch(`${baseUrl}/api/check-reminders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        result = await reminderResponse.json();
        break;
        
      case 'cron':
        // Trigger full cron job
        const cronResponse = await fetch(`${baseUrl}/api/cron`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CRON_SECRET || 'medibot-cron-2024'}`
          },
        });
        result = await cronResponse.json();
        break;
        
      default:
        return NextResponse.json({ 
          success: false, 
          error: `Unknown action: ${action}`,
          availableActions: ['check-reminders', 'cron']
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      action,
      timestamp: new Date().toISOString(),
      result
    });
    
  } catch (error) {
    console.error("❌ Trigger API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also support POST for webhook compatibility
export async function POST(req: Request) {
  return GET(req);
}