import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    // Basic Information
    projectName: { 
      type: String, 
      required: [true, "Project name is required"],
      trim: true 
    },
    builderName: { 
      type: String, 
      required: [true, "Builder name is required"] 
    },
   
      address: { type: String, required: true },
   
    pricing: {
      minPrice: { type: Number, required: true }, // Store as Number for filtering
      maxPrice: { type: Number, required: true },
      currency: { type: String, default: "INR" },
      displayPrice: { type: String }, // e.g., "₹1.5 cr - 2.2 cr"
    },
    possessionDate: { type: String }, // e.g., "Dec 2026"
    configuration: { 
      type: [String], 
      required: true // e.g., ["2 BHK", "3 BHK"]
    },

    // Status & Progress
    status: {
      type: String,
      enum: ["Ready", "Under Construction", "Late Possession"],
      default: "Under Construction",
    },
    constructionProgress: { 
      type: Number, 
      min: 0, 
      max: 100, 
      default: 0 
    },

    // Price Drop Feature (Screenshot 80/82)
    priceDrop: {
      isEnabled: { type: Boolean, default: false },
      oldPrice: { type: Number },
      newPrice: { type: Number },
    },

    // Categorization & Highlights
    
    tags: {
      type: [String], // ["RERA Verified", "Featured"]
      default: []
    },
    amenities: {
      type: [String], // ["Clubhouse", "Gym", "Swimming Pool"]
      default: []
    },

    // Media & Files
    images: [{ type: String }], // Array of URLs
    mainImage: { type: String },
    brochureUrl: { type: String },
    priceSheetUrl: { type: String },

    description: { type: String },
    
    // SEO & Tracking
    slug: { type: String, unique: true }, // for URL: /listings/urban-heights
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true } // Automatically creates createdAt and updatedAt
);

// This prevents Mongoose from creating the model multiple times during Next.js Hot Reloads
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;