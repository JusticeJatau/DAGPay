import express from "express";
import { sendVerificationEmail } from "../utils/emailService.js";

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    const result = await sendVerificationEmail(
      "jataujustice200@gmail.com",
      "test-token-123",
      "Test User",
      "individual"
    );
    
    res.json({
      success: true,
      message: "Test email sent successfully",
      details: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;