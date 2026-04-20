import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true },
  googleLink: { type: String },
  showOnHomepage: { type: Boolean, default: false },
  showOnAboutUs: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);