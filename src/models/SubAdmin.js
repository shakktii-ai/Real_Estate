import mongoose from "mongoose";

const SubAdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        status: {
            type: String,
            default: "Active",
        },
        resetOtp: {
            type: String,
            default: null,
        },
        resetOtpExpiry: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Delete the cached model if it exists to ensure schema updates are applied in Next.js dev mode
if (mongoose.models.SubAdmin) {
    delete mongoose.models.SubAdmin;
}

const SubAdmin = mongoose.model("SubAdmin", SubAdminSchema);

export default SubAdmin;
