"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    updateProfile,
} from "firebase/auth";
import { X, Loader2, Mail, Phone, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function AuthModal({ onClose }) {
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
    // steps: PHONE | OTP | EMAIL | EMAIL_PASSWORD | PROFILE
    const [step, setStep] = useState("PHONE");
    const [authMode, setAuthMode] = useState("LOGIN"); // LOGIN or SIGNUP
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);

    // Email auth state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isNewEmailUser, setIsNewEmailUser] = useState(false);
    const [emailUserName, setEmailUserName] = useState("");

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

    // ─── Phone Auth ───────────────────────────────────────────────────────────

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
        if (!otp.trim() || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);

            const result = await confirmationResult.confirm(otp);
            const firebaseUser = result.user;

            // Sync basic user info to DB (does NOT set profileCompleted)
            const syncRes = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: firebaseUser.uid,
                    phone: firebaseUser.phoneNumber,
                    email: firebaseUser.email,
                    fullName: firebaseUser.displayName,
                }),
            });

            if (!syncRes.ok) {
                const errData = await syncRes.json().catch(() => ({}));
                console.error("Sync Error Status:", syncRes.status, "Error:", errData.error || errData);
            }

            const response = await fetch(`/api/user/profile?uid=${firebaseUser.uid}`);
            const data = await response.json();

            if (data.exists && data.profileCompleted) {
                toast.success("Welcome back!");
                onClose();
            } else {
                toast.success("Phone verified! Let's set up your profile.");
                setStep("PROFILE");
            }
        } catch (err) {
            console.error("Verification Error:", err);
            toast.error("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ─── Email Auth ───────────────────────────────────────────────────────────

    /** Step 1: user enters email */
    const handleEmailContinue = async () => {
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // We respect the authMode set by the user (LOGIN or SIGNUP)
        // No more automatic overriding which can be confusing or fail due to Firebase security settings
        setStep("EMAIL_PASSWORD");
    };

    /** Step 2: login or register with password */
    const handleEmailAuth = async () => {
        if (!password.trim() || password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (authMode === "SIGNUP") {
            if (!emailUserName.trim()) {
                toast.error("Please enter your name");
                return;
            }
            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
        }

        try {
            setLoading(true);

            if (authMode === "SIGNUP") {
                // Register
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(cred.user, { displayName: emailUserName });

                toast.success("Account created! Let's set up your profile.");
                setStep("PROFILE");
            } else {
                // Login
                const cred = await signInWithEmailAndPassword(auth, email, password);

                // Sync basic info to DB (does NOT set profileCompleted)
                const syncRes = await fetch("/api/user/profile", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        uid: cred.user.uid,
                        email: cred.user.email,
                        fullName: cred.user.displayName,
                    }),
                });

                if (!syncRes.ok) {
                    const errData = await syncRes.json().catch(() => ({}));
                    console.error("Sync Error Status:", syncRes.status, "Error:", errData.error || errData);
                }

                // Check MongoDB profile status
                const response = await fetch(`/api/user/profile?uid=${cred.user.uid}`);
                const data = await response.json();

                if (data.exists && data.profileCompleted) {
                    toast.success(`Welcome back, ${cred.user.displayName || "User"}!`);
                    onClose();
                } else {
                    toast.success("Logged in! Let's complete your profile.");
                    setStep("PROFILE");
                }
            }
        } catch (err) {
            if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                toast.error("Incorrect password. Please try again.");
            } else if (err.code === "auth/too-many-requests") {
                toast.error("Too many attempts. Please try again later.");
            } else {
                toast.error(err.message || "Authentication failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ─── Profile Submit ───────────────────────────────────────────────────────

    const handleProfileSubmit = async () => {
        // Validation for Name
        if (!auth.currentUser?.displayName && !profileData.fullName.trim()) {
            toast.error("Please enter your name");
            return;
        }

        // Validation for Email
        if (!auth.currentUser?.email && (!profileData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email))) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Validation for Phone
        if (!auth.currentUser?.phoneNumber && (!profileData.phone.trim() || profileData.phone.length !== 10)) {
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

        try {
            setLoading(true);
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid: auth.currentUser.uid,
                    phone: auth.currentUser.phoneNumber || profileData.phone || undefined,
                    email: auth.currentUser.email || profileData.email || undefined,
                    name: auth.currentUser.displayName || profileData.fullName || emailUserName || undefined,
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
            onClose();
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
                <div id="recaptcha-container"></div>

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
                                onClick={() => setAuthMode("LOGIN")}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${authMode === "LOGIN" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => setAuthMode("SIGNUP")}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${authMode === "SIGNUP" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                            >
                                Register
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
                            className={`w-full py-3 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 hover:cursor-pointer ${
                                loading
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

                        <button
                            onClick={() => setStep("EMAIL")}
                            className="w-full hover:cursor-pointer bg-white text-black border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                        >
                            <Mail size={18} />
                            Continue with Email
                        </button>

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
                            className={`w-full py-3 rounded-md uppercase font-semibold text-white transition flex items-center justify-center gap-2 hover:cursor-pointer ${
                                loading
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

                {/* ── EMAIL STEP ── */}
                {step === "EMAIL" && (
                    <>
                        <div className="flex justify-between items-start text-black pb-5">
                            <div>
                                <h2 className="text-2xl font-bold">{authMode === "LOGIN" ? "Sign In" : "Create Account"}</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    {authMode === "LOGIN" ? "Welcome back! Enter your email" : "Join us! Enter your email to start"}
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
                                onClick={() => setAuthMode("LOGIN")}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${authMode === "LOGIN" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => setAuthMode("SIGNUP")}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${authMode === "SIGNUP" ? "bg-white text-black shadow-sm" : "text-gray-500"}`}
                            >
                                Register
                            </button>
                        </div>

                        <div className="relative mb-4">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 outline-none text-black placeholder:text-gray-400 focus:border-[#742E85] transition"
                                onKeyDown={(e) => e.key === "Enter" && handleEmailContinue()}
                            />
                        </div>

                        <button
                            onClick={handleEmailContinue}
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#742E85] hover:bg-[#5f256d] cursor-pointer"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Checking...
                                </>
                            ) : (
                                "Continue"
                            )}
                        </button>

                        <button
                            onClick={() => setStep("PHONE")}
                            className="w-full mt-3 py-3 rounded-xl border border-gray-300 text-black font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Phone size={16} />
                            Use Phone Number Instead
                        </button>

                        <p className="text-[12px] text-[#6F6F6F] pt-4 leading-relaxed">
                            By continuing, you agree to our{" "}
                            <Link href="/terms" className="text-[#1447EA] hover:underline">
                                Terms and Conditions
                            </Link>
                        </p>
                    </>
                )}

                {/* ── EMAIL PASSWORD STEP ── */}
                {step === "EMAIL_PASSWORD" && (
                    <>
                        <div className="flex items-center gap-3 pb-5">
                            <button
                                onClick={() => setStep("EMAIL")}
                                className="text-gray-500 hover:text-black transition"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-black">
                                    {authMode === "SIGNUP" ? "Create Account" : "Welcome Back"}
                                </h2>
                                <p className="text-sm text-gray-400 mt-0.5 truncate max-w-[280px]">
                                    {email}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Name field — only for sign up */}
                            {authMode === "SIGNUP" && (
                                <input
                                    type="text"
                                    value={emailUserName}
                                    onChange={(e) => setEmailUserName(e.target.value)}
                                    placeholder="Full Name"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-black placeholder:text-gray-400 focus:border-[#742E85] transition"
                                />
                            )}

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={authMode === "SIGNUP" ? "Create Password" : "Enter Password"}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none text-black placeholder:text-gray-400 focus:border-[#742E85] transition"
                                    onKeyDown={(e) => authMode === "LOGIN" && e.key === "Enter" && handleEmailAuth()}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Confirm Password — only for sign up */}
                            {authMode === "SIGNUP" && (
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none text-black placeholder:text-gray-400 focus:border-[#742E85] transition"
                                        onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Password strength hint */}
                        {authMode === "SIGNUP" && password.length > 0 && (
                            <div className="mt-2 flex gap-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                            password.length >= i * 3
                                                ? password.length >= 12
                                                    ? "bg-green-500"
                                                    : password.length >= 8
                                                    ? "bg-yellow-400"
                                                    : "bg-red-400"
                                                : "bg-gray-200"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleEmailAuth}
                            disabled={loading}
                            className={`w-full mt-5 py-3 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#742E85] hover:bg-[#5f256d] cursor-pointer"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    {authMode === "SIGNUP" ? "Creating Account..." : "Signing In..."}
                                </>
                            ) : authMode === "SIGNUP" ? (
                                "Create Account"
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        {/* Forgot password hint for existing users */}
                        {authMode === "LOGIN" && (
                            <p className="text-center text-sm text-gray-500 mt-3">
                                Don't have an account?{" "}
                                <button
                                    onClick={() => setAuthMode("SIGNUP")}
                                    className="text-[#742E85] font-semibold hover:underline cursor-pointer"
                                >
                                    Register
                                </button>
                            </p>
                        )}

                        {authMode === "SIGNUP" && (
                            <p className="text-center text-sm text-gray-500 mt-3">
                                Already have an account?{" "}
                                <button
                                    onClick={() => setAuthMode("LOGIN")}
                                    className="text-[#742E85] font-semibold hover:underline cursor-pointer"
                                >
                                    Sign In
                                </button>
                            </p>
                        )}
                    </>
                )}

                {/* ── PROFILE STEP ── */}
                {step === "PROFILE" && (
                    <>
                        <div className="pb-5 text-black">
                            <h2 className="text-2xl font-bold">Complete Profile</h2>
                            <p className="text-[12px] text-gray-400 ">
                                Help us personalize your experience
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Name field - if not present in auth */}
                            {!auth.currentUser?.displayName && (
                                <div>
                                    <label className="text-black mb-1 text-sm block">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, fullName: e.target.value })
                                        }
                                        placeholder="Enter your full name"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-black"
                                    />
                                </div>
                            )}

                            {/* Email field - if logged in via phone */}
                            {!auth.currentUser?.email && (
                                <div>
                                    <label className="text-black mb-1 text-sm block">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, email: e.target.value })
                                        }
                                        placeholder="Enter your email"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-black"
                                    />
                                </div>
                            )}

                            {/* Phone field - if logged in via email */}
                            {!auth.currentUser?.phoneNumber && (
                                <div>
                                    <label className="text-black mb-1 text-sm block">Phone Number</label>
                                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                                        <span className="px-4 py-3 bg-gray-50 text-gray-600 border-r border-gray-300 text-sm">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            maxLength={10}
                                            value={profileData.phone}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, phone: e.target.value.replace(/\D/g, "") })
                                            }
                                            placeholder="Enter mobile number"
                                            className="flex-1 px-4 py-3 outline-none text-black"
                                        />
                                    </div>
                                </div>
                            )}

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
                                        className={`py-3 rounded-xl border text-sm font-semibold transition ${
                                            purpose === "self_use"
                                                ? "bg-[#FFCFE9] text-black border-none"
                                                : "bg-white text-gray-800 border-black hover:border-[#742E85]"
                                        }`}
                                    >
                                        Self Use
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPurpose("investment")}
                                        className={`py-3 rounded-xl border text-sm font-semibold transition ${
                                            purpose === "investment"
                                                ? "bg-[#FFCFE9] text-black border-none"
                                                : "bg-white text-black border-gray-300 hover:border-[#742E85]"
                                        }`}
                                    >
                                        Investment
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-black mb-2">
                                    Referral Code (Optional)
                                </label>

                                <input
                                    type="text"
                                    value={profileData.referralCode}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            referralCode: e.target.value.toUpperCase(),
                                        })
                                    }
                                    placeholder="Enter referral code"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-black"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleProfileSubmit}
                            disabled={loading}
                            className="w-full mt-6 py-3 rounded-xl font-semibold text-white bg-[#742E85] hover:bg-[#5f256d] hover:cursor-pointer disabled:bg-gray-400"
                        >
                            {loading ? "Saving..." : "Complete Profile"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}