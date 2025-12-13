import express from "express";
import Payment from "../models/Payment.js";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post("/create", async (req, res) => {
  try {
    const { merchant_id, wallet_address, amount, currency, type, memo } = req.body;

    if (!["QR", "OTP"].includes(type)) {
      return res.status(400).json({ error: "Invalid type. Must be QR or OTP." });
    }

    const id = uuidv4();           // unique
    const created_at = new Date();
    const expires_at = new Date(created_at.getTime() + 15 * 60 * 1000); 
    // expires 15 mins later

    let otp = null
    let qrData = null

    if(type === "QR"){          //if method is QR
        // QR contains ONLY the uuid
        qrData = await QRCode.toDataURL(id);
    }

    if(type === "OTP"){           //if method is OTP
        otp = generateOTP();
    }

    const payment = await Payment.create({
      id,
      merchant_id,
      amount,
      currency,
      memo,
      receiver_address: wallet_address,
      otp,
      qr: qrData,
      type,
      status: "pending",
      created_at,
      expires_at
    });

    return res.json({
      uuid: id,
      ...(qrData && { qr: qrData }),
      ...(otp && { otp }),
      type
        // message: req.body
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/all", async (req, res) => { 
  try {
    const payments = await Payment.find({});
    return res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;
    const payment = await Payment.findOne({ id: uuid });

    if (!payment) return res.status(404).json({ error: "Payment not found" });

    return res.json(payment);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
