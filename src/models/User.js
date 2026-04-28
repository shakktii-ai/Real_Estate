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
      required: true,
      unique: true,
    },

    // Signup step data
    budget: {
      type: String,
      required: true,
      default: "",
    },

    buyingTimeline: {
      type: String,
      default: "",
    },

    purpose: {
      type: String,
      enum: ["self_use", "investment"],
      default: "",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // Remaining profile data collected later
    fullName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },
    referralCode: {
      type: String,
      unique: true,
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

export default mongoose.models.User || mongoose.model("User", UserSchema);