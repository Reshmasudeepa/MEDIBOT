import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	// Debug endpoint: returns basic PhonePe config values
	const config = {
		clientId: process.env.PHONEPE_CLIENT_ID?.trim() || null,
		env: process.env.PHONEPE_ENV || process.env.NODE_ENV,
	};
	return NextResponse.json({ success: true, config });
}
