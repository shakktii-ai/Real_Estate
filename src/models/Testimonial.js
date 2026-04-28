import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true },
  videoUrl: { type: String }, // Stores the Cloudinary URL
  showOnHomepage: { type: Boolean, default: false },
  showOnAboutUs: { type: Boolean, default: false },
}, { timestamps: true });

const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

export default Testimonial;