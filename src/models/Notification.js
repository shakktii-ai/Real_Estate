import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    receiverRole: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },

    type: {
      type: String,
      enum: ["booking", "confirmation", "reschedule"],
    },

    title: String,
    message: String,

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);