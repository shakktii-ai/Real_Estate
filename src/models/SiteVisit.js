import mongoose from "mongoose";

const SiteVisitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  date: { type: String, required: true }, // Store as string or Date
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SiteVisit || mongoose.model("SiteVisit", SiteVisitSchema);