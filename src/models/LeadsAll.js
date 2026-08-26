import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    firstName: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    project: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    propertyFor: {
      type: String,
      default: "",
    },

    property: {
      type: String,
      default: "",
    },

    propertyType: {
      type: String,
      default: "",
    },

    budget: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
    },

    // Where this lead was generated
    sourceType: {
      type: String,
      enum: [
        "profile",
        "site_visit",
        "virtual_tour",
        "enquiry",
        "callback",
        "contact",
        "other",
      ],
      default: "other",
    },

    leadSource: {
      type: String,
      default: "Website",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Lead ||
  mongoose.model("Lead", LeadSchema);