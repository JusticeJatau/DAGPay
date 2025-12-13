// utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Send verification email
export const sendVerificationEmail = async (email, token, name, accountType) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const subject = accountType === "individual" 
      ? "Verify Your DAGPay Individual Account" 
      : "Verify Your DAGPay Organization Account";
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your DAGPay Account</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #030D43 0%, #1678FF 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .content {
            padding: 40px;
          }
          .greeting {
            font-size: 24px;
            font-weight: bold;
            color: #030D43;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
          }
          .verification-box {
            background-color: #f8f9fa;
            border-left: 4px solid #1678FF;
            padding: 20px;
            margin: 30px 0;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(to right, #1678FF, #1a6eff);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
          }
          .button:hover {
            background: linear-gradient(to right, #1a6eff, #1e7bff);
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #777;
            font-size: 14px;
            border-top: 1px solid #eee;
            background-color: #f9f9f9;
          }
          .code {
            font-family: monospace;
            background-color: #f1f1f1;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            font-size: 14px;
            word-break: break-all;
          }
          .note {
            background-color: #fff8e1;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DAGPay</div>
            <div>Secure Your Data, Secure Yourself</div>
          </div>
          
          <div class="content">
            <div class="greeting">Welcome to DAGPay, ${name}!</div>
            
            <div class="message">
              Thank you for creating a ${accountType} account with DAGPay. 
              To complete your registration and start using our services, 
              please verify your email address by clicking the button below:
            </div>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">
                Verify Email Address
              </a>
            </div>
            
            <div class="verification-box">
              <p><strong>Verification Link:</strong></p>
              <p class="code">${verificationUrl}</p>
              <p>If the button above doesn't work, copy and paste this link into your browser.</p>
            </div>
            
            <div class="note">
              <strong>Important:</strong> This verification link will expire in 24 hours. 
              If you don't verify within this time, you'll need to request a new verification email.
            </div>
            
            <div class="message">
              <p>If you didn't create this account, please ignore this email or contact our support team.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} DAGPay. All rights reserved.</p>
            <p>This is an automated email, please do not reply to this address.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to DAGPay, ${name}!

      Thank you for creating a ${accountType} account with DAGPay.
      To complete your registration, please verify your email address.

      Verification Link: ${verificationUrl}

      This link will expire in 24 hours.

      If you didn't create this account, please ignore this email.

      © ${new Date().getFullYear()} DAGPay. All rights reserved.
    `;

    const mailOptions = {
      from: `"DAGPay" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: subject,
      html: html,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token, name) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* Similar styles as above */
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DAGPay</div>
            <div>Password Reset Request</div>
          </div>
          
          <div class="content">
            <div class="greeting">Hello ${name},</div>
            
            <div class="message">
              We received a request to reset your DAGPay account password. 
              Click the button below to create a new password:
            </div>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">
                Reset Password
              </a>
            </div>
            
            <div class="note">
              <strong>Security Note:</strong> This link will expire in 1 hour.
              If you didn't request a password reset, please ignore this email 
              and ensure your account is secure.
            </div>
            
            <div class="message">
              <p>For security reasons, never share this link with anyone.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} DAGPay. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"DAGPay Security" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Reset Your DAGPay Password",
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, name, accountType) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* Similar styles as above */
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DAGPay</div>
            <div>Welcome to DAGPay!</div>
          </div>
          
          <div class="content">
            <div class="greeting">Congratulations, ${name}!</div>
            
            <div class="message">
              Your ${accountType} account has been successfully verified and activated. 
              You can now access all features of DAGPay.
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
                Go to Dashboard
              </a>
            </div>
            
            <div class="message">
              <p>Thank you for choosing DAGPay for your payment solutions.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} DAGPay. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"DAGPay Team" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Welcome to DAGPay - Your Account is Now Active!",
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw error for welcome email - it's not critical
    return { success: false };
  }
};

export default transporter;