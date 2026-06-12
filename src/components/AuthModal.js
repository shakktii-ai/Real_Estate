"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { X, Loader2, Mail, Phone, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AuthModal({ onClose, onAuthSuccess }) {
    const [purpose, setPurpose] = useState("");
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        phone: "",
        budget: "",
        buyingTimeline: "",
        purpose: "",
        referralCode: "",
    });
    const [step, setStep] = useState("PHONE");
    const [authMode, setAuthMode] = useState("LOGIN"); // LOGIN or SIGNUP
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [pendingUid, setPendingUid] = useState(null);
    const [phoneVerified, setPhoneVerified] = useState(false);

    const finishAuth = async () => {
        if (onAuthSuccess) {
            onAuthSuccess();
        }
        await refreshUser?.();
        router.replace("/dashboard");
    };

    // Auth state from server JWT
    const { user, refreshUser } = useAuth();

    const handleSendOtp = async () => {
        if (!phone.trim() || phone.length !== 10) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/auth/send-whatsapp-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mobile: phone,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to send WhatsApp OTP.");
            }

            // setPendingUid(data.uid || `phone-${phone}`);
            setStep("OTP");
            toast.success("OTP sent successfully via WhatsApp");
        } catch (err) {
            console.error("Send OTP Error:", err);
            toast.error(err.message || "Unable to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim() || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/auth/verify-whatsapp-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mobile: phone,
                    otp,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "OTP verification failed.");
            }

            const userId = data.id;
            setPendingUid(userId);
            setPhoneVerified(true);
            setProfileData((prev) => ({ ...prev, phone }));

            await refreshUser?.();

            const profileRes = await fetch(
                `/api/user/profile?id=${userId}`
            );
            const profileDataResult = await profileRes.json();

            if (profileDataResult.exists && profileDataResult.profileCompleted) {
                toast.success("Welcome back! Redirecting to dashboard...");
                await finishAuth();
                return;
            }

            setStep("PROFILE");
            toast.success("Phone verified! Let's set up your profile.");
        } catch (err) {
            console.error("Verify OTP Error:", err);
            toast.error(err.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ─── Email Auth ───────────────────────────────────────────────────────────

    /** Step 1: user enters email */
    // Email/password auth removed — OTP-only flow

    // ─── Profile Submit ───────────────────────────────────────────────────────

    const handleProfileSubmit = async () => {
        // Validation for Name
        if (!user?.fullName && !profileData.fullName.trim()) {
            toast.error("Please enter your name");
            return;
        }
        // Validation for Email
        if (!user?.email && (!profileData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email))) {
            toast.error("Please enter a valid email address");
            return;
        }
        // Validation for Phone
        if (!user?.phone && (!profileData.phone.trim() || profileData.phone.length !== 10)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        if (!profileData.budget.trim()) {
            toast.error("Please enter your budget");
            return;
        }

        if (!profileData.buyingTimeline) {
            toast.error("Please select your buying timeline");
            return;
        }

        if (!purpose) {
            toast.error("Please select your purpose");
            return;
        }

        if (!user && !phoneVerified) {
            toast.error("Please verify your phone before completing signup.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: user?._id || pendingUid,
                    phone: user?.phone || profileData.phone || undefined,
                    email: user?.email || profileData.email || undefined,
                    name: user?.fullName || profileData.fullName || undefined,
                    budget: profileData.budget,
                    buyingTimeline: profileData.buyingTimeline,
                    purpose,
                    referralCodeUsed: profileData.referralCode || undefined,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to save profile");
            }

            toast.success("Profile saved! Welcome aboard 🎉");
            finishAuth();
        } catch (error) {
            console.error("Profile Submit Error:", error);
            toast.error(error.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md relative">

                {/* ── PHONE STEP ── */}
                {step === "PHONE" && (
                    <>
                        <div className="flex justify-between items-start text-black pb-5">
                            <div>
                                <h2 className="text-2xl font-bold">{authMode === "LOGIN" ? "Sign In" : "Create Account"}</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    {authMode === "LOGIN" ? "Welcome back! Enter your phone" : "Join us! Enter your phone to start"}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-black transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                            <button
                                onClick={() => setAuthMode("SIGNUP")}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${authMode === "SIGNUP" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                            >
                                Register
                            </button>
                            <button
                                onClick={() => setAuthMode("LOGIN")}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${authMode === "LOGIN" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                            >
                                Sign In
                            </button>
                        </div>

                        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden mb-4">
                            <span className="px-4 py-3 bg-gray-50 text-gray-600 border-r border-gray-300">
                                +91
                            </span>
                            <input
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value.replace(/\D/g, ""))
                                }
                                placeholder="Enter mobile number"
                                className="flex-1 px-4 py-3 outline-none text-black placeholder:text-gray-400"
                            />
                        </div>

                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 hover:cursor-pointer ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#742E85] hover:bg-[#5f256d]"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Sending OTP...
                                </>
                            ) : (
                                "Continue"
                            )}
                        </button>

                        {/* <div className="flex items-center gap-3 w-full py-5">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                                OR
                            </span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div> */}


                        <p className="text-[12px] text-[#6F6F6F] pt-4 leading-relaxed">
                            By continuing, you agree to our{" "}
                            <Link href="/terms" className="text-[#1447EA] hover:underline">
                                Terms and Conditions
                            </Link>
                        </p>
                    </>
                )}

                {/* ── OTP STEP ── */}
                {step === "OTP" && (
                    <>
                        <div className="flex justify-between items-start text-black pb-5">
                            <div>
                                <h2 className="text-2xl font-bold">Verify OTP</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    OTP sent to +91 {phone}
                                </p>
                            </div>
                            <button
                                onClick={() => setStep("PHONE")}
                                className="text-sm text-[#742E85] font-medium underline hover:cursor-pointer"
                            >
                                Back
                            </button>
                        </div>

                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="000000"
                            className="w-full border border-gray-300 rounded-md px-2 py-2 mb-4 outline-none text-center tracking-[8px] text-lg font-semibold text-black"
                        />

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className={`w-full py-3 rounded-md uppercase font-semibold text-white transition flex items-center justify-center gap-2 hover:cursor-pointer ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#742E85] hover:bg-[#5f256d]"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Verifying...
                                </>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            className="w-full py-2 uppercase rounded-md font-semibold border mt-2 transition flex items-center justify-center gap-2 bg-[#ffffff] hover:bg-gray-50 hover:cursor-pointer text-black"
                        >
                            Resend OTP
                        </button>
                    </>
                )}



                {/* ── PROFILE STEP ── */}
                {step === "PROFILE" && (
                    <div className="max-h-[80vh] w-full max-w-md mx-auto overflow-y-auto scrollbar-hide ">
                        <div className="pb-6 text-black text-center">
                            <h2 className="text-2xl font-extrabold tracking-tight">Complete Profile</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Help us personalize your experience
                            </p>
                        </div>

                        <div className="space-y-2">
                            {/* Name field */}

                            {!user?.fullName && (
                                <div className="space-y-1">
                                    <label className="text-gray-700 font-medium text-sm block ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        placeholder="John Doe"
                                        className="w-full border border-gray-200 focus:border-[#742E85] focus:ring-1 focus:ring-[#742E85] rounded-xl px-4 py-3 outline-none text-black transition-all bg-gray-50/50"
                                    />
                                </div>
                            )}

                            {/* Email field */}
                            {!user?.email && (
                                <div className="space-y-1">
                                    <label className="text-gray-700 font-medium text-sm block ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        placeholder="name@example.com"
                                        className="w-full border border-gray-200 focus:border-[#742E85] focus:ring-1 focus:ring-[#742E85] rounded-xl px-4 py-3 outline-none text-black transition-all bg-gray-50/50"
                                    />
                                </div>
                            )}

                            {/* Phone field */}
                            {!user?.phone && (
                                <div className="space-y-1">
                                    <label className="text-gray-500 font-medium text-sm block ml-1">Phone Number</label>
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-100/70 cursor-not-allowed transition-all">
                                        <span className="pl-4 pr-2 py-3 text-gray-400 font-medium text-sm select-none">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            maxLength={10}
                                            value={profileData.phone}
                                            readOnly
                                            placeholder="00000 00000"
                                            className="flex-1 px-2 py-3 outline-none text-gray-500 bg-transparent cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-gray-700 font-medium text-sm block ml-1">Budget Range</label>
                                <input
                                    type="text"
                                    value={profileData.budget}
                                    onChange={(e) => setProfileData({ ...profileData, budget: e.target.value })}
                                    placeholder="₹30L - ₹70L"
                                    className="w-full border border-gray-200 focus:border-[#742E85] focus:ring-1 focus:ring-[#742E85] rounded-xl px-4 py-3 outline-none text-black transition-all bg-gray-50/50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-gray-700 font-medium text-sm block ml-1">Buying Timeline</label>
                                <select
                                    value={profileData.buyingTimeline || ""}
                                    onChange={(e) => setProfileData({ ...profileData, buyingTimeline: e.target.value })}
                                    className="w-full border border-gray-200 focus:border-[#742E85] focus:ring-1 focus:ring-[#742E85] rounded-xl px-4 py-3 outline-none text-black bg-gray-50/50 transition-all appearance-none"
                                >
                                    <option value="">Select Timeline</option>
                                    <option value="Ready to Move">Ready to Move</option>
                                    <option value="Within 3 Months">Within 3 Months</option>
                                    <option value="Within 6 Months">Within 6 Months</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <label className="text-gray-700 font-medium text-sm block ml-1 mb-3">Purpose</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPurpose("self_use")}
                                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${purpose === "self_use"
                                            ? "bg-[#FFCFE9] text-black border-transparent shadow-sm"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-[#742E85]"
                                            }`}
                                    >
                                        Self Use
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPurpose("investment")}
                                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${purpose === "investment"
                                            ? "bg-[#FFCFE9] text-black border-transparent shadow-sm"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-[#742E85]"
                                            }`}
                                    >
                                        Investment
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleProfileSubmit}
                            disabled={loading}
                            className="w-full mt-8 py-4 rounded-xl font-bold text-white bg-[#742E85] hover:bg-[#5f256d] shadow-lg shadow-purple-100 transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
                        >
                            {loading ? "Saving..." : "Complete Profile"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}