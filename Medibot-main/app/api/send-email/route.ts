import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

// Fallback Gmail SMTP configuration
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Function to send email via Gmail SMTP as fallback
const sendViaGmail = async (to: string, subject: string, htmlContent: string) => {
  console.log("Attempting to send email via Gmail SMTP fallback...");
  
  const transporter = createGmailTransporter();
  
  const mailOptions = {
    from: `MediBot <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  const result = await transporter.sendMail(mailOptions);
  console.log("Gmail SMTP result:", result);
  return result;
};

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();
    
    console.log("Email API received:");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Message:", message);
    
    // Validate input
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      console.error("Invalid email address:", to);
      return NextResponse.json(
        { success: false, message: "Invalid email address provided" },
        { status: 400 }
      );
    }
    
    if (!subject || !message) {
      console.error("Missing subject or message");
      return NextResponse.json(
        { success: false, message: "Subject and message are required" },
        { status: 400 }
      );
    }
    
    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { success: false, message: "Email service not configured" },
        { status: 500 }
      );
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${subject}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      /* Base styles */
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
      
      /* Container styles */
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
      
      /* Header styles */
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
      
      /* Content styles */
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
      
      .cta-button:hover {
        box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
        transform: translateY(-2px);
      }
      
      /* Footer styles */
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
      
      .footer-links {
        margin-bottom: 15px;
      }
      
      .footer-link {
        color: #4f46e5;
        text-decoration: none;
        font-size: 14px;
        margin: 0 12px;
        transition: color 0.2s ease;
      }
      
      .footer-link:hover {
        color: #7c3aed;
        text-decoration: underline;
      }
      
      .copyright {
        font-size: 12px;
        color: #94a3b8;
        margin-top: 15px;
      }
      
      /* Responsive adjustments */
      @media (max-width: 650px) {
        .content {
          padding: 30px 25px;
        }
        
        .header {
          padding: 25px 0;
        }
        
        .logo-container {
          width: 70px;
          height: 70px;
        }
        
        .logo {
          font-size: 32px;
        }
        
        .cta-button {
          padding: 12px 25px;
          font-size: 15px;
        }
      }
    </style>
  </head>
  <body>
    <table class="email-wrapper" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" valign="middle">
          <div class="email-container">
            <!-- Header with branding -->
            <div class="header">
              <div class="logo-container">
                <div class="logo">M</div>
              </div>
              <div class="brand-name">MediBot</div>
            </div>
            
            <!-- Content area -->
            <div class="content">
              <h1 class="greeting">Hello ${to?.split("@")[0] || "there"},</h1>
              
              <p>You have a reminder from MediBot:</p>
              
              <div class="message-container">
                <div class="message-label">Your Reminder</div>
                <div class="message-content">${message}</div>
              </div>
              
              <p>If you have any questions or need to adjust this reminder, please visit your MediBot dashboard.</p>
              
              <div class="cta-container">
                <a href="https://medibot-ai.com/dashboard" class="cta-button">Go to Dashboard</a>
              </div>
              
              <p>If you didn't request this reminder, you can safely ignore this email or contact our support team.</p>
              
              <p>Best regards,<br /><strong>The MediBot Team</strong></p>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p class="footer-text">Need help? We're here for you.</p>
              
              <div class="footer-links">
                <a href="https://medibot-ai.com/help" class="footer-link">Help Center</a>
                <a href="https://medibot-ai.com/contact" class="footer-link">Contact Us</a>
                <a href="https://medibot-ai.com/privacy" class="footer-link">Privacy Policy</a>
              </div>
              
              <p class="copyright">© ${new Date().getFullYear()} MediBot. All rights reserved.<br />
              You are receiving this email because you have an account with MediBot.</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    // Check if RESEND_API_KEY is configured
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
    
    // Use verified email from environment variables
    const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || "onboarding@resend.dev";
    console.log("Using from email:", fromEmail);
    
    try {
      const { data, error } = await resend.emails.send({
        from: `MediBot <${fromEmail}>`,
        to,
        subject,
        html: htmlContent,
      });

      console.log("Resend API Response:");
      console.log("Data:", JSON.stringify(data, null, 2));
      console.log("Error:", JSON.stringify(error, null, 2));

      if (error) {
        console.error("Resend API Error Details:", {
          message: error.message,
          name: error.name,
          type: typeof error,
          fullError: error
        });
        
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
          console.error("Gmail SMTP fallback also failed:", gmailError);
          
          // Handle specific Resend errors
          let errorMessage = "Unknown email service error";
          if (error.message) {
            errorMessage = error.message;
          } else if (error.name) {
            errorMessage = error.name;
          } else if (typeof error === 'string') {
            errorMessage = error;
          }
          
          return NextResponse.json(
            { 
              success: false, 
              message: `Both email services failed. Resend: ${errorMessage}, Gmail: ${gmailError instanceof Error ? gmailError.message : String(gmailError)}`,
              errorType: error.name || 'ResendError'
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