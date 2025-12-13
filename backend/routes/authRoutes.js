// routes/auth.js
import express from "express";
import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { v4 as uuidv4 } from "uuid";
import { 
  sendVerificationEmail, 
  sendWelcomeEmail,
  sendPasswordResetEmail 
} from "../utils/emailService.js";
import { protect, requireAccountType } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { 
      account_type, 
      email, 
      phone, 
      password, 
      full_name, 
      organization_name, 
      cac_number, 
      contact_person, 
      organization_email 
    } = req.body;

    // Basic validation
    if (!email || !phone || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Email, phone, and password are required" 
      });
    }

    // Validate account type
    if (!["individual", "organization"].includes(account_type)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid account type. Must be 'individual' or 'organization'" 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        error: "User already exists with this email" 
      });
    }

    // Validate based on account type
    if (account_type === "individual") {
      if (!full_name) {
        return res.status(400).json({ 
          success: false,
          error: "Full name is required for individual accounts" 
        });
      }
    } else {
      if (!organization_name || !cac_number || !contact_person) {
        return res.status(400).json({ 
          success: false,
          error: "Organization name, CAC number, and contact person are required for organization accounts" 
        });
      }
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long"
      });
    }

    // Generate UUID for user ID
    const id = `USER_${uuidv4().toUpperCase().replace(/-/g, '')}`;

    // Create user object
    const userData = {
      id: id,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      account_type,
      status: "pending"
    };

    // Add type-specific fields
    if (account_type === "individual") {
      userData.full_name = full_name.trim();
    } else {
      userData.organization_name = organization_name.trim();
      userData.cac_number = cac_number.trim();
      userData.contact_person = contact_person.trim();
      userData.organization_email = (organization_email || email).toLowerCase().trim();
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    userData.verification_token = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    userData.verification_expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = await User.create(userData);

    // Generate JWT token
    const token = generateToken(user.id, user.account_type);

    // Prepare response (remove sensitive data)
    const userResponse = {
      id: user.id,
      email: user.email,
      account_type: user.account_type,
      phone: user.phone,
      is_verified: user.is_verified,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    // Add type-specific fields to response
    if (account_type === "individual") {
      userResponse.full_name = user.full_name;
    } else {
      userResponse.organization_name = user.organization_name;
      userResponse.contact_person = user.contact_person;
      userResponse.cac_number = user.cac_number;
      userResponse.organization_email = user.organization_email;
    }

    // Send verification email
    let emailSent = false;
    let emailError = null;
    
    try {
      await sendVerificationEmail(
        user.email,
        verificationToken,
        account_type === "individual" ? user.full_name : user.organization_name,
        account_type
      );
      emailSent = true;
    } catch (error) {
      console.error("Failed to send verification email:", error);
      emailError = error.message;
    }

    // Prepare response
    const response = {
      success: true,
      message: emailSent 
        ? "Account created successfully. Please check your email to verify your account."
        : "Account created but verification email failed to send. Please contact support.",
      token,
      user: userResponse,
      email_sent: emailSent
    };

    // Only include token in development mode
    if (process.env.NODE_ENV === "development") {
      response.verification_token = verificationToken;
      response.verification_url = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    }

    // Include email error if any (for debugging)
    if (emailError && process.env.NODE_ENV === "development") {
      response.email_error = emailError;
    }

    return res.status(201).json(response);

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `A user with this ${field} already exists`
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: "Server error during registration" 
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Email and password are required" 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid email or password" 
      });
    }

    // Check password
    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid email or password" 
      });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(403).json({ 
        success: false,
        error: "Please verify your email before logging in",
        requires_verification: true,
        user_id: user.id,
        email: user.email
      });
    }

    // Check if account is active
    if (user.status !== "active") {
      return res.status(403).json({ 
        success: false,
        error: `Account is ${user.status}. Please contact support.`,
        status: user.status
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.account_type);

    // Prepare response
    const userResponse = {
      id: user.id,
      email: user.email,
      account_type: user.account_type,
      phone: user.phone,
      is_verified: user.is_verified,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    // Add type-specific fields
    if (user.account_type === "individual") {
      userResponse.full_name = user.full_name;
    } else {
      userResponse.organization_name = user.organization_name;
      userResponse.contact_person = user.contact_person;
      userResponse.cac_number = user.cac_number;
      userResponse.organization_email = user.organization_email;
    }

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Server error during login" 
    });
  }
});

router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token || token.length < 10) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid verification token" 
      });
    }

    // Hash the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verification_token: hashedToken,
      verification_expires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid or expired verification token" 
      });
    }

    // Update user
    user.is_verified = true;
    user.status = "active";
    user.verification_token = null;
    user.verification_expires = null;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(
        user.email,
        user.account_type === "individual" ? user.full_name : user.organization_name,
        user.account_type
      );
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Continue even if welcome email fails
    }

    // Generate JWT token
    const authToken = generateToken(user.id, user.account_type);

    // Prepare user response
    const userResponse = {
      id: user.id,
      email: user.email,
      account_type: user.account_type,
      is_verified: user.is_verified,
      status: user.status
    };

    return res.json({
      success: true,
      message: "Email verified successfully! Your account is now active.",
      token: authToken,
      user: userResponse
    });

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Server error during verification" 
    });
  }
});

router.post("/send-verification-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: "Email is required" 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    if (user.is_verified) {
      return res.status(400).json({ 
        success: false,
        error: "Email is already verified" 
      });
    }

    // Check if we should wait before resending (5 minutes cooldown)
    const lastSent = user.verification_expires - (23 * 60 * 60 * 1000); // 1 hour after creation
    if (Date.now() - lastSent < 5 * 60 * 1000) {
      return res.status(429).json({
        success: false,
        error: "Please wait 5 minutes before requesting another verification email"
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verification_token = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.verification_expires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Send verification email
    let emailSent = false;
    let emailError = null;
    
    try {
      await sendVerificationEmail(
        user.email,
        verificationToken,
        user.account_type === "individual" ? user.full_name : user.organization_name,
        user.account_type
      );
      emailSent = true;
    } catch (error) {
      console.error("Failed to send verification email:", error);
      emailError = error.message;
    }

    const response = {
      success: true,
      message: emailSent 
        ? "Verification email sent successfully. Please check your inbox."
        : "Failed to send verification email. Please try again later.",
      email_sent: emailSent
    };

    // Only include token in development mode
    if (process.env.NODE_ENV === "development" && emailSent) {
      response.verification_token = verificationToken;
      response.verification_url = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    }

    // Include email error if any (for debugging)
    if (emailError && process.env.NODE_ENV === "development") {
      response.email_error = emailError;
    }

    return res.json(response);

  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Server error while resending verification email" 
    });
  }
});

// Password Reset Endpoints
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: "Email is required" 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.reset_password_token = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.reset_password_expires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send password reset email
    let emailSent = false;
    let emailError = null;
    
    try {
      await sendPasswordResetEmail(
        user.email,
        resetToken,
        user.account_type === "individual" ? user.full_name : user.organization_name
      );
      emailSent = true;
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      emailError = error.message;
    }

    const response = {
      success: true,
      message: emailSent
        ? "Password reset email sent successfully. Please check your inbox."
        : "Failed to send password reset email. Please try again later.",
      email_sent: emailSent
    };

    // Only include token in development mode
    if (process.env.NODE_ENV === "development" && emailSent) {
      response.reset_token = resetToken;
      response.reset_url = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    }

    // Include email error if any (for debugging)
    if (emailError && process.env.NODE_ENV === "development") {
      response.email_error = emailError;
    }

    return res.json(response);

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Server error while processing password reset request" 
    });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Token and new password are required" 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long"
      });
    }

    // Hash the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      reset_password_token: hashedToken,
      reset_password_expires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid or expired reset token" 
      });
    }

    // Update password
    user.password = password;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful. You can now login with your new password."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Server error while resetting password" 
    });
  }
});

// Additional endpoints
router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: "Email is required" 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    return res.json({
      success: true,
      available: !user,
      email: email
    });

  } catch (error) {
    console.error("Check email error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Server error" 
    });
  }
});

router.get("/me", protect, (req, res) => {
  // req.user is guaranteed here
  const user = req.user.toObject();

  // Remove sensitive fields
  delete user.password;
  delete user.verification_token;
  delete user.verification_expires;
  delete user.reset_password_token;
  delete user.reset_password_expires;

  return res.json({
    success: true,
    user
  });
});

router.get("/all", async (req, res) => { 
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  return res.json({
    success: true,
    message: "Auth service is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

router.post(
  "/organization-only",
  protect,
  requireAccountType("organization"),
  (req, res) => {
    res.json({ success: true, message: "Access granted" });
  }
);

export default router;