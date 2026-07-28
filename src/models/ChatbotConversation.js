import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ["bot", "user"], required: true },
    content: { type: String, required: true },
    variant: { type: String, default: "text" },
  },
  { _id: false }
);

const ChatbotConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    uid: {
      type: String,
      required: true,
      index: true,
    },
    messages: {
      type: [ChatMessageSchema],
      default: [],
    },
    currentStepIndex: {
      type: Number,
      default: -1,
    },
    leadData: {
      type: Object,
      default: {},
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    activeMenu: {
      type: String,
      default: "main",
    },
    selectedLocation: {
      type: String,
      default: null,
    },
    selectedPriceRange: {
      type: String,
      default: null,
    },
    projects: {
      type: Array,
      default: [],
    },
    selectedProject: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ChatbotConversation ||
  mongoose.model("ChatbotConversation", ChatbotConversationSchema);
