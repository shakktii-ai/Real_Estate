import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    projectName: {
      type: String,
      required: [true, "Project name is required"],
    },
    budget: {
      type: String,
      required: [true, "Budget is required"],
    },
    configuration: {
      type: String,
      required: [true, "Configuration is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Unread", "Read"],
      default: "Unread",
    },
  },
  { timestamps: true }
);

const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export default Contact;
