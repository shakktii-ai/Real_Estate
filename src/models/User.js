// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: false,
      trim: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    signupOtp: {
      type: String,
      required: false,
    },
    signupOtpExpiry: {
      type: Date,
      required: false,
    },

    // Signup step data
    budget: {
      type: String,
      required: false,
    },

    buyingTimeline: {
      type: String,
    },

    purpose: {
      type: String,
      enum: ["self_use", "investment", "", null],
      default: "",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // Remaining profile data collected later
    fullName: {
      type: String,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    referralCount: {
      type: Number,
      default: 0,
    },
    rewardPoints: {
      type: Number,
      default: 0,
    }

  },
  { timestamps: true }
);

UserSchema.index(
  { phone: 1 },
  { 
    unique: true, 
    partialFilterExpression: { phone: { $type: "string" } } 
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);