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
    propertyType: {
      type: String,
      trim: true,
    },
    basicDetails: {
      type: String,
      trim: true,
    },
    message: String,
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'converted'],
      default: 'new',
    },
      source: {
        type: String,
        default: "Chatbot"
    },
  configuration: {
      type: String,
      trim: true,
    },
    possession: {
      type: String,
      trim: true,
    },
    purchasePurpose: {
      type: String,
      trim: true,
    },
    visitedProject: {
      type: String,
      trim: true,
    },
    projectName: {
      type: String,
      trim: true,
    },
    siteVisit: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.ChatbotLead ||
  mongoose.model('ChatbotLead', ChatbotLeadSchema);
