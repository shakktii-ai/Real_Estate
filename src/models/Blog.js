import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide the blog content"],
    },
    // excerpt: {
    //   type: String,
    //   maxlength: [200, "Excerpt cannot be more than 200 characters"],
    //   description: "A short summary for the blog card preview",
    // },
    image: {
      type: String, // Cloudinary URL
      required: [true, "Please upload a cover image"],
    },
    category: {
      type: String,
    },
   
    isPublished: {
      type: Boolean,
      default: false,
    },
   
  },
  { timestamps: true }
);



export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);