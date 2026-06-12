"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "react-toastify";

import {
    User,
    Mail,
    Phone,
    DollarSign,
    Clock3,
    Target,
    Sparkles,
    LogOut,
    Pencil,
    Save,
} from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();

    const [pageLoading, setPageLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        id: "",
        uid: "",
        phone: "",
        fullName: "",
        email: "",
        budget: "",
        buyingTimeline: "",
        purpose: "",
    });

    useEffect(() => {
        let mounted = true;

        const loadProfile = async () => {
            if (!user && !authLoading) {
                router.push("/");
                return;
            }

            if (!user) return;

            try {
                const res = await fetch(`/api/user/profile?id=${user._id || ""}&uid=${user.uid || ""}`);
                const data = await res.json();

                if (!mounted) return;

                setProfile({
                    id: data.user?._id || user._id || "",
                    uid: data.user?.uid || user.uid || "",
                    phone: data.user?.phone || user.phone || "",
                    fullName: data.user?.fullName || user.fullName || "",
                    email: data.user?.email || user.email || "",
                    budget: data.user?.budget || "",
                    buyingTimeline: data.user?.buyingTimeline || "",
                    purpose: data.user?.purpose || "",
                });
            } catch (err) {
                console.error("Failed to load profile", err);
                if (mounted) setProfile((prev) => ({ ...prev, id: user?._id || "", uid: user?.uid || "" }));
            } finally {
                if (mounted) setPageLoading(false);
            }
        };

        loadProfile();

        return () => { mounted = false; };
    }, [user, authLoading, router]);

    const handleSave = async () => {
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            });

            if (!res.ok) throw new Error();

            toast.success("Profile updated");
            setIsEditing(false);
        } catch {
            toast.error("Failed to update profile");
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            router.push("/");
        } catch {
            toast.error("Logout failed");
        }
    };

    const getProfileCompletion = () => {
        const fields = [
            profile.fullName,
            profile.email,
            profile.budget,
            profile.buyingTimeline,
            profile.purpose,
        ];

        const filled = fields.filter(
            (field) => field && field.toString().trim() !== ""
        ).length;

        return Math.round((filled / fields.length) * 100);
    };

    const completion = getProfileCompletion();

    if (authLoading || pageLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F5FA] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold flex items-center gap-2 text-black">
                      
                        My Profile
                    </h1>

                    <p className="text-sm text-gray-500 mt-1 ml-1">
                        Manage your personal information and preferences
                    </p>
                </div>

                {/* Profile Completion */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E9DDF3] p-5 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-[20px] font-semibold text-[#2D2D2D]">
                                Profile Completion
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                Complete your profile for better recommendations
                            </p>
                        </div>

                        <span className="text-lg font-bold text-[#FF1493]">
                            {completion}%
                        </span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#8A2BE2] to-[#FF1493] transition-all duration-500"
                            style={{ width: `${completion}%` }}
                        />
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E9DDF3] p-5">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-[20px] font-bold text-[#1F2937]">
                                Personal Information
                            </h2>

                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#A020F0] bg-[#F7EFFF] hover:bg-[#F0E3FF] transition text-sm font-medium"
                                >
                                    <Pencil size={15} />
                                    Edit
                                </button>
                            ) : (
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-[#8A2BE2] to-[#FF1493] hover:opacity-90 transition text-sm font-medium"
                                >
                                    <Save size={15} />
                                    Save
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            {/* Mobile */}
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <Phone size={14} />
                                    Mobile Number
                                </label>

                                <input
                                    type="tel"
                                    maxLength={10}
                                    disabled={!isEditing}
                                    value={profile.phone}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            phone: e.target.value.replace(
                                                /\D/g,
                                                ""
                                            ),
                                        })
                                    }
                                    placeholder="Enter mobile number"
                                    className={`w-full h-12 rounded-xl border border-[#D8B4FE] px-4 text-sm outline-none transition
                                    ${
                                        isEditing
                                            ? "bg-[#FAF7FD] text-black focus:border-[#A020F0]"
                                            : "bg-[#F5F5F5] text-gray-700 cursor-not-allowed"
                                    }`}
                                />
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <User size={14} />
                                    Full Name
                                </label>

                                <input
                                    disabled={!isEditing}
                                    value={profile.fullName}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            fullName: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your full name"
                                    className={`w-full h-12 rounded-xl border border-[#D8B4FE] px-4 text-sm outline-none transition
                                    ${
                                        isEditing
                                            ? "bg-[#FAF7FD] text-black focus:border-[#A020F0]"
                                            : "bg-[#F5F5F5] text-gray-700 cursor-not-allowed"
                                    }`}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <Mail size={14} />
                                    Email Address
                                </label>

                                <input
                                    disabled={!isEditing}
                                    value={profile.email}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your email"
                                    className={`w-full h-12 rounded-xl border border-[#D8B4FE] px-4 text-sm outline-none transition
                                    ${
                                        isEditing
                                            ? "bg-[#FAF7FD] text-black focus:border-[#A020F0]"
                                            : "bg-[#F5F5F5] text-gray-700 cursor-not-allowed"
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E9DDF3] p-5">
                        <h2 className="text-[20px] font-bold text-[#1F2937] mb-5">
                            Preferences
                        </h2>

                        <div className="space-y-2">
                            {/* Budget */}
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <DollarSign size={14} />
                                    Budget Range
                                </label>

                                <select
                                    disabled={!isEditing}
                                    value={profile.budget}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            budget: e.target.value,
                                        })
                                    }
                                    className={`w-full h-12 rounded-xl border border-[#D8B4FE] px-4 text-sm outline-none transition
                                    ${
                                        isEditing
                                            ? "bg-[#FAF7FD] text-black focus:border-[#A020F0]"
                                            : "bg-[#F5F5F5] text-gray-700 cursor-not-allowed"
                                    }`}
                                >
                                    <option value="">Select Budget</option>

                                    <option value="₹50L - ₹70L">
                                        ₹50L - ₹70L
                                    </option>

                                    <option value="₹70L - ₹1Cr">
                                        ₹70L - ₹1Cr
                                    </option>

                                    <option value="₹1Cr - ₹2Cr">
                                        ₹1Cr - ₹2Cr
                                    </option>

                                    <option value="₹2Cr+">₹2Cr+</option>
                                </select>
                            </div>

                            {/* Timeline */}
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <Clock3 size={14} />
                                    Buying Timeline
                                </label>

                                <select
                                    disabled={!isEditing}
                                    value={profile.buyingTimeline}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            buyingTimeline: e.target.value,
                                        })
                                    }
                                    className={`w-full h-12 rounded-xl border border-[#D8B4FE] px-4 text-sm outline-none transition
                                    ${
                                        isEditing
                                            ? "bg-[#FAF7FD] text-black focus:border-[#A020F0]"
                                            : "bg-[#F5F5F5] text-gray-700 cursor-not-allowed"
                                    }`}
                                >
                                    <option value="">
                                        Select Timeline
                                    </option>

                                    <option value="Ready to buy now">
                                        Ready to buy now
                                    </option>

                                    <option value="Within 3 Months">
                                        Within 3 Months
                                    </option>

                                    <option value="Within 6 Months">
                                        Within 6 Months
                                    </option>

                                    <option value="Within 1 Year">
                                        Within 1 Year
                                    </option>
                                </select>
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <Target size={14} />
                                    Purpose
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        disabled={!isEditing}
                                        onClick={() =>
                                            setProfile({
                                                ...profile,
                                                purpose: "self_use",
                                            })
                                        }
                                        className={`h-12 rounded-xl border text-sm font-semibold transition-all
                                        ${
                                            profile.purpose === "self_use"
                                                ? "bg-gradient-to-r from-[#8A2BE2] to-[#FF1493] text-white border-transparent"
                                                : "bg-white border-gray-300 text-[#1F2937]"
                                        }
                                        ${
                                            !isEditing
                                                ? "cursor-not-allowed opacity-90"
                                                : ""
                                        }`}
                                    >
                                        Self Use
                                    </button>

                                    <button
                                        type="button"
                                        disabled={!isEditing}
                                        onClick={() =>
                                            setProfile({
                                                ...profile,
                                                purpose: "investment",
                                            })
                                        }
                                        className={`h-12 rounded-xl border text-sm font-semibold transition-all
                                        ${
                                            profile.purpose === "investment"
                                                ? "bg-gradient-to-r from-[#8A2BE2] to-[#FF1493] text-white border-transparent"
                                                : "bg-white border-gray-300 text-[#1F2937]"
                                        }
                                        ${
                                            !isEditing
                                                ? "cursor-not-allowed opacity-90"
                                                : ""
                                        }`}
                                    >
                                        Investment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                {/* <div className="flex justify-center mt-8">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium bg-gradient-to-r from-[#8A2BE2] to-[#FF1493] hover:opacity-90 transition"
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>
                </div> */}
            </div>
        </div>
    );
}