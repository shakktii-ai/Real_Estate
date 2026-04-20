"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        uid: "",
        phone: "",
        fullName: "",
        email: "",
        budget: "",
        buyingTimeline: "",
        purpose: "",
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) return;

            try {
                const res = await fetch(
                    `/api/user/profile/${firebaseUser.uid}`
                );

                const data = await res.json();

                setProfile({
                    uid: data.uid,
                    phone: data.phone || "",
                    fullName: data.fullName || "",
                    email: data.email || "",
                    budget: data.budget || "",
                    buyingTimeline: data.buyingTimeline || "",
                    purpose: data.purpose || "",
                });
            } catch (err) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);
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
        } catch {
            toast.error("Failed to update profile");
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
    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 text-black">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-black">
                            Profile Completion
                        </h3>
                        <p className="text-sm text-gray-500">
                            Complete your profile to get better recommendations and faster service
                        </p>
                    </div>

                    <span className="text-[#1447EA] font-bold text-lg">
                        {completion}%
                    </span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#1447EA] rounded-full transition-all duration-500"
                        style={{ width: `${completion}%` }}
                    />
                </div>

                
            </div>
            <div className="bg-white rounded-2xl  border border-gray-200 shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Personal Information</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-500">Mobile Number</label>
                        <input
                            value={profile.phone}
                            disabled
                            className="w-full border rounded-xl px-4 py-3 bg-[#F5F5F5] mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">Full Name</label>
                        <input
                            value={profile.fullName}
                            onChange={(e) =>
                                setProfile({ ...profile, fullName: e.target.value })
                            }
                            className="w-full border rounded-xl px-4 py-3 mt-1 bg-[#F5F5F5]"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">Email Address</label>
                        <input
                            value={profile.email}
                            onChange={(e) =>
                                setProfile({ ...profile, email: e.target.value })
                            }
                            className="w-full border rounded-xl px-4 py-3 mt-1 bg-[#F5F5F5]"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Preferences</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-500">Budget Range</label>
                        <input
                            value={profile.budget}
                            onChange={(e) =>
                                setProfile({ ...profile, budget: e.target.value })
                            }
                            className="w-full border rounded-xl px-4 py-3 mt-1 bg-[#F5F5F5]"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">Buying Timeline</label>
                        <select
                            value={profile.buyingTimeline}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    buyingTimeline: e.target.value,
                                })
                            }
                            className="w-full border rounded-xl px-4 py-3 mt-1"
                        >
                            <option value="">Select</option>
                            <option value="Ready to Move">Ready to Move</option>
                            <option value="Within 3 Months">Within 3 Months</option>
                            <option value="Within 6 Months">Within 6 Months</option>
                            <option value="Within 1 Year">Within 1 Year</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-500 mb-3 block">Purpose</label>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setProfile({ ...profile, purpose: "self_use" })
                                }
                                className={`py-3 rounded-xl border ${profile.purpose === "self_use"
                                        ? "bg-[#FFCFE9] border-[#742E85]"
                                        : ""
                                    }`}
                            >
                                Self Use
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setProfile({ ...profile, purpose: "investment" })
                                }
                                className={`py-3 rounded-xl border ${profile.purpose === "investment"
                                        ? "bg-[#FFCFE9] border-[#742E85]"
                                        : ""
                                    }`}
                            >
                                Investment
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="mt-6 bg-[#742E85] text-white px-6 py-3 rounded-xl"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}