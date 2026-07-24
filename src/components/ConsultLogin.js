"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function UnlockPricesModal({ onClose, onAuthSuccess }) {
  // Step management
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Step 1: Send OTP to WhatsApp
  const handleSendOtp = async () => {
    if (!phone.trim() || phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/send-whatsapp-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send WhatsApp OTP.");
      }

      setIsOtpSent(true);
      toast.success("OTP sent to your WhatsApp number!");
    } catch (err) {
      console.error("Send OTP Error:", err);
      toast.error(err.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/verify-whatsapp-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "OTP verification failed.");
      }

      setIsPhoneVerified(true);
      toast.success("Phone number verified successfully!");
    } catch (err) {
      console.error("Verify OTP Error:", err);
      toast.error(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Simple Consult Submission (No Profile API, just close modal & show success)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpSent) {
      toast.error("Please send OTP first");
      return;
    }

    if (!isPhoneVerified) {
      await handleVerifyOtp();
      return;
    }

    if (!fullName.trim()) {
      toast.error("Please enter your Full Name");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Direct success flow without database profile creation
    toast.success("Our Legal Team Get Back To You.");

    if (onAuthSuccess) {
      onAuthSuccess();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-gray-100 font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title Section */}
        <div className="text-center mb-4">
          <h2 className="text-[16px]  font-medium text-black tracking-tight">
            Login To Unlock Bottom Prices - Don't Overpay
          </h2>
          <p className="text-[14px] text-gray-400 mt-1 font-normal">
            Exclusive Deals & Free Site Visit
          </p>
        </div>

        {/* Highlight Tag */}
        <div className="bg-[#E5097F]/12 text-[#E5097F] text-center text-xs font-light py-2.5 rounded-2xl mb-5">
          Trusted By 1 Lac+ Home Buyers
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Phone Number Input */}
          <div>
            <label className="block text-xs text-gray-600 font-medium mb-1 ml-1">
              Phone Number
            </label>
            <div className="relative flex items-center border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-purple-600 transition-colors">
              <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium border-r border-gray-200 pr-2 mr-2 select-none">
                <span className="text-sm">🇮🇳</span> 
                <span className="text-gray-400">▾</span>
              </span>
              
              <input
                type="tel"
                maxLength={10}
                placeholder="000000 0000"
                value={phone}
                disabled={isPhoneVerified}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full text-sm outline-none text-black bg-transparent disabled:opacity-60"
              />

              {!isOtpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || phone.length !== 10}
                  className="text-xs font-semibold text-purple-800 hover:text-purple-900 transition-colors disabled:opacity-40"
                >
                  Send OTP
                </button>
              )}

              {isOtpSent && !isPhoneVerified && (
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="text-xs text-gray-500 font-semibold hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* OTP Input - Visible after OTP is sent */}
          {isOtpSent && (
            <div>
              <label className="block text-xs text-gray-600 font-medium mb-1 ml-1">
                Enter OTP
              </label>
              <div className="relative flex items-center border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-purple-600 transition-colors">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  disabled={isPhoneVerified}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-sm outline-none text-black bg-transparent disabled:opacity-60"
                />
                
                {!isPhoneVerified ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-xs text-black font-semibold hover:underline whitespace-nowrap ml-2"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600 font-semibold whitespace-nowrap">
                    Verified ✓
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Full Name Field */}
          <div>
            <label className="block text-xs text-gray-600 font-medium mb-1 ml-1">
              Enter Full Name
            </label>
            <input
              type="text"
              placeholder="Enter Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none text-black focus:border-purple-600 transition-colors placeholder:text-gray-300"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs text-gray-600 font-medium mb-1 ml-1">
              Enter e-mail
            </label>
            <input
              type="email"
              placeholder="xyz.gamil.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none text-black focus:border-purple-600 transition-colors placeholder:text-gray-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#702C82] hover:bg-[#5a2269] text-white py-3 rounded-xl font-medium text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}