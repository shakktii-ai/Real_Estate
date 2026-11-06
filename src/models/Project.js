import mongoose from "mongoose";

const ProjectImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    isCover: { type: Boolean, default: false },
    order: { type: Number, min: 0, default: 0 },
    alt: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

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
     reraNumber:{
      type:String, required:[true,"RERA Number is required"]
     },
      address:{
     area: { type: String, required: true },
      city: { type: String, required: true },

      },
    pricing: {
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
      newPrice: { type: Number},
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
    usp:{
      type:[String],
      default:[]
    },


    // Media & Files
  
    mainImage: { type: String },
    images: { type: [ProjectImageSchema], default: undefined },
    brochureUrl: { type: String },
    priceSheetUrl: { type: String },
   qrCodeUrl: { type: String },
    description: { type: String },
    
    // SEO & Tracking
    slug: { type: String, unique: true }, 
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true } // Automatically creates createdAt and updatedAt
);

ProjectSchema.pre("validate", function () {
  const projectImages = Array.isArray(this.images) ? this.images : [];

  if (!projectImages.length) {
    if (this.mainImage) {
      this.images = [
        {
          url: this.mainImage,
          isCover: true,
          order: 0,
          alt: this.projectName || "",
        },
      ];
    }
    return;
  }

  const explicitlySelectedCover = projectImages.findIndex(
    (image) => image.isCover
  );
  const mainImageCover = projectImages.findIndex(
    (image) => image.url === this.mainImage
  );
  const coverIndex =
    explicitlySelectedCover >= 0
      ? explicitlySelectedCover
      : mainImageCover >= 0
        ? mainImageCover
        : 0;

  projectImages.forEach((image, index) => {
    image.isCover = index === coverIndex;
    image.order = index;
  });
  this.mainImage = projectImages[coverIndex]?.url || "";
});

// This prevents Mongoose from creating the model multiple times during Next.js Hot Reloads
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;