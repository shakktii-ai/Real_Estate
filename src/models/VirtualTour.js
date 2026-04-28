import mongoose from "mongoose";

const VirtualTourSchema = new mongoose.Schema({
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
    enum: ['pending', 'confirmed', 'completed',"cancelled", "rescheduled"],
    default: 'pending'
  },
  meetingLink: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.VirtualTour || mongoose.model("VirtualTour", VirtualTourSchema);