import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            default: "John Doe",
        },
        email: {
            type: String,
            default: "admin@example.com",
        },
        password: {
            type: String,
            default: "Admin@123",
        },
        role: {
            type: String,
            default: "Admin",
        },
        profileImage: {
            type: String,
            default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        connectedAccounts: [
            {
                name: String,
                email: String,
                phone: String,
                password: String,
                role: String,
                image: String,
                status: { type: String, default: "Active" }
            }
        ],
        resetOtp: {
            type: String,
            default: null,
        },
        resetOtpExpiry: {
            type: Date,
            default: null,
        },
        notifications: {
            whatsappApi: { type: Boolean, default: false },
            bookings: { type: Boolean, default: false },
            inquiries: { type: Boolean, default: false },
            mail: {
                newRegister: { type: Boolean, default: true },
                messageMail: { type: Boolean, default: true },
            },
            push: {
                mobileDesktop: { type: Boolean, default: true },
                desktopOnly: { type: Boolean, default: false },
                pushNotification: { type: Boolean, default: true },
            }
        }
    },
    { timestamps: true }
);

// Delete the cached model if it exists to ensure schema updates are applied in Next.js dev mode
if (mongoose.models.Admin) {
    delete mongoose.models.Admin;
}

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
