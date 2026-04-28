import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Firebase UID or Auth ID
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
}, { timestamps: true });

// Ensure unique entry so a user can't wishlist the same property twice
WishlistSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export default mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);