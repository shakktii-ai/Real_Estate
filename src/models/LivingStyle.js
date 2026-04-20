import mongoose from "mongoose";

const LivingStyleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  categoryTag: { type: String, required: true }, // e.g., "Affordable"
  cardColor: { type: String, default: "blue" }, // Used for CSS mapping
  description:{type:String},
  pricingRange: { type: String, required: true },
  features: [{ type: String }], // Array of 4 strings from your modal
  image: { type: String, required: true },
  projectMapping: [{ type: String }], // Array of mapped project IDs
}, { timestamps: true });

export default mongoose.models.LivingStyle || mongoose.model("LivingStyle", LivingStyleSchema);