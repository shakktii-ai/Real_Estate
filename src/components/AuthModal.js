"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import { X, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AuthModal({ onClose }) {
    const [purpose, setPurpose] = useState("")
    const [profileData, setProfileData] = useState({
        budget: "",
        buyingTimeline: "",
        purpose: ""
    });
    const [step, setStep] = useState("PHONE");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);


    useEffect(() => {
        const setupRecaptcha = () => {
            if (
                !window.recaptchaVerifier ||
                window.recaptchaVerifier._destroyed
            ) {
                window.recaptchaVerifier = new RecaptchaVerifier(
                    auth,
                    "recaptcha-container",
                    {
                        size: "invisible",
                    }
                );
            }
        };

        setupRecaptcha();

        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);
    const handleSendOtp = async () => {
        if (!phone.trim()) {
            toast.error("Please enter phone number");
            return;
        }

        try {
            setLoading(true);

            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(
                    auth,
                    "recaptcha-container",
                    {
                        size: "invisible",
                    }
                );
            }

            const appVerifier = window.recaptchaVerifier;

            const result = await signInWithPhoneNumber(
                auth,
                `+91${phone}`,
                appVerifier
            );

            setConfirmationResult(result);
            setStep("OTP");
            toast.success("OTP sent successfully");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            toast.error("Please enter OTP");
            return;
        }

        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits");
            return;
        }

        try {
            setLoading(true);

            await confirmationResult.confirm(otp);

            toast.success("Verified");
            setStep("PROFILE");
        } catch (err) {
            toast.error("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };
    const handleProfileSubmit = async () => {
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

        try {
            setLoading(true);
            await fetch("/api/user/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid: auth.currentUser.uid,
                    phone: auth.currentUser.phoneNumber,
                    budget: profileData.budget,
                    buyingTimeline: profileData.buyingTimeline,
                    purpose,
                }),
            });
            const finalData = {
                ...profileData,
                purpose,
                phone,
            };

            console.log(finalData);

            toast.success("Registered!");
            onClose();
        } catch (error) {
            toast.error("Failed to save profile");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md relative">
                <div id="recaptcha-container"></div>

                {step === "PHONE" ? (
                    <>
                        <div className="flex justify-between items-start text-black pb-5">
                            <div>
                                <h2 className="text-2xl font-bold">Login / Register</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Please enter your phone number
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-black transition"
                            >
                                <X size={18} />
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

                        <div className="flex items-center gap-3 w-full py-5">
                            <div className="flex-1 h-px bg-gray-300"></div>

                            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                                OR
                            </span>

                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div>

                        <button className="w-full hover:cursor-pointer bg-white text-black border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition">
                            Continue with Email
                        </button>

                        <p className="text-[12px] text-[#6F6F6F] pt-4 leading-relaxed">
                            By continuing, you agree to our{" "}
                            <Link href="/terms" className="text-[#1447EA] hover:underline">
                                Terms and Conditions
                            </Link>
                        </p>
                    </>
                ) : step === "OTP" ? (
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
                            className="w-full py-2 uppercase rounded-md font-semibold border mt-2 transition flex items-center justify-center gap-2 bg-[#ffffff] hover:bg-[#5f256d] hover:cursor-pointer"
                        >
                            Resend OTP
                        </button>
                    </>
                ) : (<>
                    <div className="pb-5 text-black">
                        <h2 className="text-2xl font-bold">Complete Profile</h2>
                        <p className="text-[12px] text-gray-400 ">
                            Help us personalize your experience
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-black mb-1 text-md">Budget Range</label>
                        <input
                            type="text"
                            value={profileData.budget}
                            onChange={(e) =>
                                setProfileData({ ...profileData, budget: e.target.value })
                            }
                            placeholder="₹30L - ₹70L"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-black"
                        />
                        <label className="text-black text-md block mb-2">
                            Buying Timeline
                        </label>

                        <select
                            value={profileData.buyingTimeline || ""}
                            onChange={(e) =>
                                setProfileData({
                                    ...profileData,
                                    buyingTimeline: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-black bg-white"
                        >
                            <option value="">Select Buying Timeline</option>
                            <option value="Ready to Move">Ready to Move (Ready Possession)</option>
                            <option value="Within 3 Months">Within 3 Months</option>
                            <option value="Within 6 Months">Within 6 Months</option>
                            <option value="Within 1 Year">Within 1 Year</option>
                            <option value="1-2 Years">1–2 Years</option>
                            <option value="2-3 Years">2–3 Years</option>
                            <option value="3+ Years">3+ Years (Under Construction)</option>
                            <option value="Flexible">Flexible / Not Decided</option>
                        </select>

                        <div className="mt-6">
                            <label className="block text-sm text-black mb-3">
                                Purpose
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPurpose("self_use")}
                                    className={`py-3 rounded-xl border text-sm font-semibold transition ${purpose === "self_use"
                                        ? "bg-[#FFCFE9] text-black border-none"
                                        : "bg-white text-gray-800 border-black hover:border-[#742E85]"
                                        }`}
                                >
                                    Self Use
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPurpose("investment")}
                                    className={`py-3 rounded-xl border text-sm font-semibold transition ${purpose === "investment"
                                        ? "bg-[#FFCFE9] text-black border-none"
                                        : "bg-white text-black border-gray-300 hover:border-[#742E85]"
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
                        className="w-full mt-6 py-3 rounded-xl font-semibold text-white bg-[#742E85] hover:bg-[#5f256d] hover:cursor-pointer"
                    >
                        {loading ? "Saving..." : "Conplete Profile"}
                    </button>
                </>
                )}
            </div>
        </div>
    );
}