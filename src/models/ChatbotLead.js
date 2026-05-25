import mongoose from 'mongoose';

const ChatbotLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    preferredLocation: {
      type: String,
      trim: true,
    },
    message: String,
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export default mongoose.models.ChatbotLead ||
  mongoose.model('ChatbotLead', ChatbotLeadSchema);
