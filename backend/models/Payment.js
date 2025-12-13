import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  merchant_id: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  memo: { type: String, default: null },
  receiver_address: { type: String, required: true },
  payer_address: { type: String, default: "" },

  // New fields
  type: { type: String, enum: ["QR", "OTP"], required: true },
  otp: { type: String, default: null },
  qr: { type: String, default: null },

  status: { type: String, default: "pending" },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true }
});

export default mongoose.model("Payment", PaymentSchema);
