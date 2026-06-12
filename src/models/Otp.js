import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    mobile: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Optional TTL index could be added at the DB level. Keep expiresAt for checks.

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
