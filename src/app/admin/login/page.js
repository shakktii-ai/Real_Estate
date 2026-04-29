"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save user session
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        toast.success("Login successful! Welcome back.");
        router.push("/admin");
      } else {
        toast.error(data.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!resetEmail) return toast.error("Please enter your registered email address.");
    setResetLoading(true);
    try {
      const res = await fetch("/api/forgot-password/reset/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setForgotStep(2);
        // Clear fields for the next step
        setResetOtp("");
        setNewPassword("");
        setShowResetPassword(false);
      } else {
        toast.error(data.error || "Failed to send OTP.");
      }
    } catch (e) {
      toast.error("An error occurred.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetOtp || !newPassword) return toast.error("Please fill all fields.");
    setResetLoading(true);
    try {
      const res = await fetch("/api/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: resetOtp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setShowForgotModal(false);
        setForgotStep(1);
        setResetEmail("");
        setResetOtp("");
        setNewPassword("");
      } else {
        toast.error(data.error || "Failed to reset password.");
      }
    } catch (e) {
      toast.error("An error occurred.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EDF3] flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] relative z-10">
        <div className="bg-white rounded-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 mb-6">
              <img
                src="/piinggaksha.png"
                alt="Logo"
                className="h-12 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-2">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#742E85] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className="w-full h-[54px] pl-12 pr-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#742E85] transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => setShowForgotModal(true)} className="text-xs font-bold text-[#E5097F] hover:underline">Forgot Password?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#742E85] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full h-[54px] pl-12 pr-12 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#742E85] transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 px-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-gray-300 text-[#742E85] focus:ring-[#742E85]"
              />
              <label htmlFor="remember" className="text-xs font-medium text-gray-600 cursor-pointer select-none">Remember this device</label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[56px] bg-gradient-to-r from-[#742E85] to-[#E5097F] text-white rounded-2xl font-bold text-[16px] shadow-lg shadow-purple-200 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-10 text-center">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">
              Secure Admin Access Only
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h3>
            <p className="text-sm text-gray-500 mb-8">
              {forgotStep === 1 && "Enter your registered email address to receive an OTP."}
              {forgotStep === 2 && "Enter the OTP sent to your email and your new password."}
            </p>

            {forgotStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full h-[54px] px-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#742E85] focus:ring-4 focus:ring-purple-500/5 transition-all text-sm font-medium text-gray-800"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setShowForgotModal(false); setForgotStep(1); }}
                    className="flex-1 h-[50px] bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendOtp}
                    disabled={resetLoading}
                    className="flex-1 h-[50px] bg-[#E5097F] text-white rounded-2xl font-bold hover:opacity-90 transition-all flex justify-center items-center"
                  >
                    {resetLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Send OTP"}
                  </button>
                </div>
              </div>
            )}

            {forgotStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">OTP</label>
                  <input
                    type="text"
                    placeholder="Enter OTP (123456)"
                    className="w-full h-[54px] px-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#742E85] focus:ring-4 focus:ring-purple-500/5 transition-all text-sm font-medium text-gray-800"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">New Password</label>
                  <div className="relative group">
                    <input
                      type={showResetPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full h-[54px] pl-4 pr-12 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#742E85] focus:ring-4 focus:ring-purple-500/5 transition-all text-sm font-medium text-gray-800"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setForgotStep(1)}
                    className="flex-1 h-[50px] bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={resetLoading}
                    className="flex-1 h-[50px] bg-[#E5097F] text-white rounded-2xl font-bold hover:opacity-90 transition-all flex justify-center items-center"
                  >
                    {resetLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Reset Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
