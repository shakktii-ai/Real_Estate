"use client";

import React, { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/lib/context/AuthContext";
import { motion } from "framer-motion";
import { Copy, Share2 } from "lucide-react";
import { SlUserFollow } from "react-icons/sl";
import Link from "next/link";
export default function ReferralsPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState({
    referralCount: 0,
    rewardPoints: 0,
  });
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/user/profile?id=${user._id || ""}&uid=${user.uid || ""}`);
        const data = await res.json();
        if (!mounted) return;
        setReferralCode(data.user?.referralCode || "");
        setStats({
          referralCount: data.user?.referralCount || 0,
          rewardPoints: data.user?.rewardPoints || 0,
        });
      } catch (error) {
        console.error("Failed to fetch referral data", error);
      }
    };

    load();
    return () => { mounted = false; };
  }, [user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const text = `Hi! Use my referral code ${referralCode} to get exclusive rewards at Piinggaksha Realty! Check it out: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };


  return (
    <div className="min-h-screen text-black overflow-x-hidden">


      <main className=" mx-auto">
        {/* Header */}
        <div className=" text-left my-4 px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[25px] md:text-[25px] font-bold text-gray-900 mb-1"
          >
            Refer & Earn
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-black text-[14px] md:text-[15px]"
          >
            Invite friends and earn rewards when they book a site visit.
          </motion.p>
        </div>
        {/* How it works Section (Rectangle 4745) */}
        <div className="bg-[radial-gradient(circle,_#FFFFFF_0%,_#D9C5DD_100%)]">
          <section >
            <div

              className=" w-full min-h-[342px] py-10 flex flex-col justify-center items-center text-center p-6 md:p-10"
            >
              <h3 className="text-2xl text-[#742E85] font-bold mb-12">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center mb-6 overflow-hidden p-2 shadow-sm">
                    <img
                      src="/1.png"
                      alt="Logo"
                      className="w-50% h-50% object-cover m-1 "
                    />
                  </div>
                  <h4 className="font-medium text-[#742E85] mb-3 text-lg">Share Your Code</h4>
                  <p className="text-[#6F6F6F] text-[15px] max-w-[220px]">Share your referral code with friends & family</p>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center mb-6 overflow-hidden p-2 shadow-sm">
                    <img
                      src="/2.png"
                      alt="Logo"
                      className="w-50% h-50% object-cover m-1 "
                    />
                  </div>
                  <h4 className="font-medium text-[#742E85] mb-3 text-lg">Friend Signs Up</h4>
                  <p className="text-[#6F6F6F] text-[15px] max-w-[220px]">Your friend registers using your code</p>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center mb-6 overflow-hidden p-2 shadow-sm">
                    <img
                      src="/3.png"
                      alt="Logo"
                      className="w-50% h-50% object-cover m-1 "
                    />
                  </div>
                  <h4 className="font-medium text-[#742E85] mb-3 text-lg">Earn Rewards</h4>
                  <p className="text-[#6F6F6F] text-[15px] max-w-[220px]">Get rewards when they book a site visit</p>
                </div>
              </div>
            </div>
          </section>
          {/* Hero Section: Referral Code Card (Rectangle 4742) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}

            className="w-full min-h-[300px] py-10 flex flex-col justify-center items-center text-center text-white relative px-6"
          >
            <div className="bg-white rounded-2xl p-4 md:p-10 text-black">
              {user ? (
                <>
                  <div>
                    {/* Label for context */}
                    <p className=" text-[18px] mb-1">
                      Your Referral Code
                    </p>
                    <p className="text-sm text-gray-500">Share this code with your friends and start earning rewards! </p>
                    {/* Display code using prominent header styling */}
                    <h2 className="text-xl md:text-3xl font-semibold tracking-wider bg-black/10 mt-8 mb-8 py-3 px-6 rounded-lg">
                      {referralCode}
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-3 bg-white/30 hover:bg-white/30 px-10 py-4 rounded-xl font-semibold transition-all border border-black/30 min-w-full md:min-w-[200px]  justify-center"
                    >
                      <Copy size={20} />
                      {copied ? "Copied!" : "Copy Code"}
                    </button>
                    <button
                      onClick={shareViaWhatsApp}
                      className="flex items-center gap-3 bg-white/30 hover:bg-white/30 px-10 py-4 rounded-xl font-semibold transition-all border border-black/30 min-w-full md:min-w-[200px] justify-center"
                    >
                      <Share2 size={20} />
                      Share via WhatsApp
                    </button>
                  </div>
                </>
              ) : (
                /* Standard interactive Signup Button linking to your auth page */
                <div>
                  <p className=" text-[18px] mb-1">
                    Your Referral Code
                  </p>
                  <p className="text-sm text-gray-500">Signup now to unlock your unique referral code and start earning! </p>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="my-6 bg-gradient-to-r from-[#E5097F] to-[#742E85] px-4 py-4 text-white text-[14px] md:text-[18px] rounded-xl font-medium w-full flex items-center justify-center gap-3 hover:cursor-pointer"
                  >
                    <SlUserFollow size={20} />
                    <span>SignUp to Get Referral Code</span>
                  </button>
                </div>
              )}


            </div>
          </motion.div>
        </div>


        {/* Reward Structure Section (Rectangle 4746) */}
        {/* <section className="mb-[40px] md:mb-[76px]">
          <div
            style={{
              ...commonCardStyle,
            }}
            className="bg-white w-full min-h-[624px] py-10 flex flex-col justify-center p-6 md:p-12"
          >
            <h3 className="text-2xl font-bold mb-10 pl-2">Reward Structure</h3>
            <div className="space-y-4 md:space-y-6">
              {[
                { label: "Friend Signs Up", sub: "Using your referral code", amount: "₹500" },
                { label: "Friend Books Site Visit", sub: "First property visit", amount: "₹2,000" },
                { label: "Friend Makes Purchase", sub: "Property booking confirmed", amount: "₹25,000" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 md:p-8 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors gap-4">
                  <div>
                    <h4 className="font-bold text-lg md:text-xl mb-1">{item.label}</h4>
                    <p className="text-gray-500 text-xs md:text-sm">{item.sub}</p>
                  </div>
                  <span className="text-[20px] md:text-[28px] font-bold text-[#009966]">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Referral Stats Section (Rectangle 4750) */}
        {/* <section className="mb-[40px] md:mb-[76px]">
          <div
            style={{
              ...commonCardStyle,
            }}
            className="bg-white w-full min-h-[303px] py-10 flex flex-col justify-center p-6 md:p-12"
          >
            <h3 className="text-2xl font-bold mb-10 pl-2">Your Referral Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-[#EFF6FF] p-6 md:p-8 rounded-2xl text-center border border-blue-100 flex flex-col justify-center h-[120px] md:h-[140px]">
                <p className="text-[32px] md:text-[40px] font-bold text-blue-600 mb-1">
                  {stats.referralCount}
                </p>
                <p className="text-blue-900 font-medium text-xs md:text-sm">Total Referrals</p>
              </div>
              <div className="bg-[#F0FDF4] p-6 md:p-8 rounded-2xl text-center border border-green-100 flex flex-col justify-center h-[120px] md:h-[140px]">
                <p className="text-[32px] md:text-[40px] font-bold text-green-600 mb-1">0</p>
                <p className="text-green-900 font-medium text-xs md:text-sm">Successful Bookings</p>
              </div>
              <div className="bg-[#FDF2F8] p-6 md:p-8 rounded-2xl text-center border border-pink-100 flex flex-col justify-center h-[120px] md:h-[140px]">
                <p className="text-[32px] md:text-[40px] font-bold text-pink-600 mb-1">{stats.rewardPoints}</p>
                <p className="text-pink-900 font-medium text-xs md:text-sm">Total Earnings</p>
              </div>
            </div>
          </div>
        </section> */}

        {/* Terms & Conditions Section */}
        {/* <section className="mb-24 px-6 md:px-0 ">
          <h3 className="text-[24px] md:text-[24px]  font-medium text-black mb-6 md:mb-8 leading-tight">Terms & Conditions</h3>
          <ul
            className="space-y-4 list-disc marker:text-[#E5097F] max-w-full  md:max-w-[725px]"
            style={{
              fontFamily: "'Roboto Condensed', sans-serif",
            }}
          >
            {[
              "Referral rewards are subject to successful verification",
              "Rewards will be credited within 7 working days",
              "Self-referrals are not allowed",
              "Piinggaksha reserves the right to modify the program"
            ].map((text, idx) => (
              <li
                key={idx}
                className="text-[20px] md:text-[20px] leading-tight font-normal text-[#6F6F6F]"
              >
                {text}
              </li>
            ))}
          </ul>
        </section> */}
      </main>

      {showModal && <AuthModal onClose={() => setShowModal(false)} onAuthSuccess={() => setShowModal(false)} />}
    </div>
  );
}
