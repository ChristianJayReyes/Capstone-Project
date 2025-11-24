import nodemailer from "nodemailer";

// Check if email credentials are configured
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️ EMAIL_USER or EMAIL_PASS not configured. Email sending will fail.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Email transporter verification failed:", error);
  } else {
    console.log("✅ Email transporter is ready to send emails");
  }
});

export const sendEmail = async (to, otp) => {
  // Validate inputs
  if (!to || !otp) {
    throw new Error("Email address and OTP are required");
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email service not configured. EMAIL_USER and EMAIL_PASS must be set.");
  }

  try {
    const info = await transporter.sendMail({
      from: `"Rosario Resorts and Hotel" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🔐 Your One-Time Password (OTP) Code",
      text: `Your verification code is: ${otp}`,
      html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0; text-align: center;">
        <div style="max-width: 480px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          
          <div style="background: linear-gradient(135deg, #0077b6, #0096c7); color: #fff; padding: 20px;">
            <h1 style="margin: 0; font-size: 22px;">Rosario Resorts and Hotel</h1>
          </div>

          <div style="padding: 30px 25px;">
            <h2 style="color: #333;">Your Verification Code</h2>
            <p style="font-size: 16px; color: #555;">Use the following One-Time Password (OTP) to verify your account:</p>

            <div style="margin: 25px 0;">
              <span style="display: inline-block; background-color: #0077b6; color: #fff; font-size: 24px; letter-spacing: 4px; padding: 12px 24px; border-radius: 8px; font-weight: bold;">
                ${otp}
              </span>
            </div>

            <p style="font-size: 14px; color: #777;">
              This code will expire in <strong>5 minutes</strong>. Please don't share it with anyone for security reasons.
            </p>
          </div>

          <div style="background: #f1f1f1; padding: 12px; font-size: 12px; color: #888;">
            © 2025 Rosario Resorts and Hotel<br/>
            <span>All rights reserved.</span>
          </div>
        </div>
      </div>
    `,
    });

    console.log(`✅ OTP email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${to}:`, error.message);
    console.error("Error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
    });
    
    // Check if it's a Gmail authentication error
    if (error.code === 'EAUTH' || error.responseCode === 535 || 
        (error.message && error.message.includes('535-5.7.8')) ||
        (error.response && error.response.includes('BadCredentials'))) {
      const authError = new Error("Email service authentication failed. Please contact support.");
      authError.code = 'EAUTH';
      authError.isEmailConfigError = true;
      throw authError;
    }
    
    throw error;
  }
};
