import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";

// Define helper for Gmail sending to reuse logic
async function sendViaGmail(to: string, subject: string, html: string) {
  // Use environment variables for Gmail
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("Gmail credentials (EMAIL_USER, EMAIL_PASS) are missing");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  return await transporter.sendMail({
    from: `"MediBot" <${user}>`,
    to,
    subject,
    html,
  });
}

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Construct HTML content
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${subject}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background-color: #f8fafc;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #334155;
        line-height: 1.6;
      }
      .email-wrapper {
        width: 100%;
        height: 100%;
      }
      .email-container {
        background-color: #ffffff;
        max-width: 600px;
        width: 100%;
        margin: 0 auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      }
      .header {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        padding: 30px 0;
        text-align: center;
      }
      .logo-container {
        background-color: white;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
      }
      .logo {
        color: #4f46e5;
        font-size: 40px;
        font-weight: bold;
      }
      .brand-name {
        color: white;
        font-size: 24px;
        font-weight: 600;
        margin-top: 15px;
        letter-spacing: 0.5px;
      }
      .content {
        padding: 40px;
      }
      .greeting {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 25px;
        color: #1e293b;
      }
      .message-container {
        background-color: #f1f5f9;
        border-left: 4px solid #4f46e5;
        padding: 20px;
        border-radius: 0 8px 8px 0;
        margin: 25px 0;
      }
      .message-label {
        font-size: 14px;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .message-content {
        font-size: 16px;
        color: #1e293b;
        line-height: 1.7;
      }
      .cta-container {
        text-align: center;
        margin: 30px 0;
      }
      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        color: white;
        text-decoration: none;
        padding: 14px 30px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        transition: all 0.3s ease;
      }
      .footer {
        background-color: #f8fafc;
        padding: 25px 40px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
      }
      .footer-text {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 15px;
      }
      .copyright {
        font-size: 12px;
        color: #94a3b8;
        margin-top: 15px;
      }
    </style>
  </head>
  <body>
    <table class="email-wrapper" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" valign="middle">
          <div class="email-container">
            <div class="header">
              <div class="logo-container">
                <div class="logo">M</div>
              </div>
              <div class="brand-name">MediBot</div>
            </div>
            <div class="content">
              <h1 class="greeting">Hello ${to?.split("@")[0] || "there"},</h1>
              <div class="message-container">
                <div class="message-label">Notification</div>
                <div class="message-content">${message}</div>
              </div>
              <div class="cta-container">
                <a href="https://medibot-ai.com/dashboard" class="cta-button">Go to Dashboard</a>
              </div>
            </div>
            <div class="footer">
              <p class="footer-text">Need help? We're here for you.</p>
              <p class="copyright">© ${new Date().getFullYear()} MediBot. All rights reserved.</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    // Try Gmail as primary if RESEND_API_KEY is missing
    if (!process.env.RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured, using Gmail SMTP...");
      try {
        const result = await sendViaGmail(to, subject, htmlContent);
        return NextResponse.json({
          success: true,
          message: "Email sent successfully via Gmail SMTP",
          data: result,
        });
      } catch (gmailError) {
        console.error("Gmail SMTP error:", gmailError);
        const errorMessage = gmailError instanceof Error ? gmailError.message : String(gmailError);
        return NextResponse.json(
          { success: false, message: `Gmail SMTP error: ${errorMessage}` },
          { status: 500 }
        );
      }
    }

    console.log("Attempting to send email via Resend API...");
    // Only import and use Resend if key exists
    const resendClient = new Resend(process.env.RESEND_API_KEY);

    // Use verified email from environment variables
    const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || "onboarding@resend.dev";

    try {
      const { data, error } = await resendClient.emails.send({
        from: `MediBot <${fromEmail}>`,
        to,
        subject,
        html: htmlContent,
      });

      if (error) {
        console.error("Resend API Error:", error);
        // Try Gmail as fallback
        console.log("Resend failed, trying Gmail SMTP fallback...");
        try {
          const result = await sendViaGmail(to, subject, htmlContent);
          return NextResponse.json({
            success: true,
            message: "Email sent successfully via Gmail SMTP (fallback)",
            data: result,
          });
        } catch (gmailError) {
          const errorMessage = error.message || "Unknown Resend error";
          return NextResponse.json(
            {
              success: false,
              message: `Both email services failed. Resend: ${errorMessage}, Gmail: ${gmailError instanceof Error ? gmailError.message : String(gmailError)}`,
            },
            { status: 500 }
          );
        }
      }

      console.log("Email sent successfully via Resend API");
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        data,
      });
    } catch (resendError) {
      console.error("Resend API exception:", resendError);

      // Try Gmail as fallback
      console.log("Resend threw exception, trying Gmail SMTP fallback...");
      try {
        const result = await sendViaGmail(to, subject, htmlContent);
        return NextResponse.json({
          success: true,
          message: "Email sent successfully via Gmail SMTP (fallback)",
          data: result,
        });
      } catch (gmailError) {
        console.error("Gmail SMTP fallback also failed:", gmailError);
        const resendErrorMsg = resendError instanceof Error ? resendError.message : String(resendError);
        const gmailErrorMsg = gmailError instanceof Error ? gmailError.message : String(gmailError);

        return NextResponse.json(
          {
            success: false,
            message: `Both email services failed. Resend: ${resendErrorMsg}, Gmail: ${gmailErrorMsg}`,
          },
          { status: 500 }
        );
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}