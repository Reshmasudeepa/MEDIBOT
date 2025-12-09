import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  const { email, message, rating } = await req.json()

  if (!message || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Send feedback to admin
    await transporter.sendMail({
      from: `"MediBot Feedback" <${process.env.EMAIL_USER}>`,
      to: "sujayss149@gmail.com",
      subject: "⭐ New Feedback from MediBot User",
      html: `
        <div style="font-family: sans-serif; background: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <div style="text-align:center; margin-bottom:16px;">
              <img src='https://medibot-ai.vercel.app/logo.png' alt='MediBot Logo' style='height:48px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.1);' />
            </div>
            <h2 style="color: #1e3a8a;">🩺 MediBot Feedback</h2>
            <p><strong>From:</strong> ${email || "Anonymous"}</p>
            <p><strong>Rating:</strong> ${"⭐".repeat(rating || 0)}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="margin: 0; padding: 10px 20px; border-left: 3px solid #3b82f6; background: #f9fafb;">
              ${message}
            </blockquote>
          </div>
        </div>
      `,
    })

    // Send thank you email to user
    if (email) {
      await transporter.sendMail({
        from: `"MediBot" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Thank you for your feedback!",
        html: `
          <div style="font-family: sans-serif; background: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
              <div style="text-align:center; margin-bottom:16px;">
                <img src='https://medibot-ai.vercel.app/logo.png' alt='MediBot Logo' style='height:48px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.1);' />
              </div>
              <h2 style="color: #1e3a8a;">Thank You for Your Feedback!</h2>
              <p>Dear User,</p>
              <p>We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve MediBot and provide a better experience for everyone.</p>
              <p style="margin-top:16px;">If you have any further questions or suggestions, feel free to reply to this email.</p>
              <p style="margin-top:24px; color:#3b82f6; font-weight:bold;">— The MediBot Team</p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 })
  }
}
