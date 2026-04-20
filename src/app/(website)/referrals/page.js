"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Copy, Share2 } from "lucide-react";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "PG3ZDHCW";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const text = `Hi! Use my referral code ${referralCode} to get exclusive rewards at Piinggaksha Realty! Check it out: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const commonCardStyle = {
    boxShadow: "0px 0px 21.5px rgba(0, 0, 0, 0.14)",
    borderRadius: "10px",
  };

  return (
    <div className="min-h-screen bg-white font-roboto-condensed text-black overflow-x-hidden">
    

      <main className="max-w-[1270px] mx-auto px-4 md:px-0 py-12">
        {/* Header */}
        <div className="text-left mb-10 pl-4 md:pl-0">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[32px] font-bold text-gray-900 mb-2"
          >
            Refer & Earn
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-[18px]"
          >
            Invite friends and earn rewards when they book a site visit
          </motion.p>
        </div>

        {/* Hero Section: Referral Code Card (Rectangle 4742) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            ...commonCardStyle,
            background: "linear-gradient(96.73deg, #742E85 -6.2%, #E5097F 100%)",
          }}
          className="w-full min-h-[326px] py-10 flex flex-col justify-center items-center text-center text-white mb-[40px] md:mb-[76px] relative px-6"
        >
          <p className="text-white/90 text-[16px] md:text-[18px] mb-4">Your Referral Code</p>
          <h2 className="text-[40px] md:text-[56px] font-bold tracking-wider mb-8 md:mb-10">{referralCode}</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-10 py-4 rounded-xl font-bold transition-all border border-white/30 min-w-[200px] justify-center"
            >
              <Copy size={20} />
              {copied ? "Copied!" : "Copy Code"}
            </button>
            <button 
              onClick={shareViaWhatsApp}
              className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-10 py-4 rounded-xl font-bold transition-all border border-white/30 min-w-[200px] justify-center"
            >
              <Share2 size={20} />
              Share via WhatsApp
            </button>
          </div>
        </motion.div>

        {/* How it works Section (Rectangle 4745) */}
        <section className="mb-[40px] md:mb-[76px]">
          <div 
            style={{
              ...commonCardStyle,
            }}
            className="bg-white w-full min-h-[342px] py-10 flex flex-col justify-center items-center text-center p-6 md:p-10"
          >
            <h3 className="text-2xl font-bold mb-12">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#742E85] font-bold text-xl mb-6">1</div>
                <h4 className="font-bold mb-3 text-lg">Share Your Code</h4>
                <p className="text-gray-500 text-[15px] max-w-[220px]">Share your referral code with friends & family</p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#742E85] font-bold text-xl mb-6">2</div>
                <h4 className="font-bold mb-3 text-lg">Friend Signs Up</h4>
                <p className="text-gray-500 text-[15px] max-w-[220px]">Your friend registers using your code</p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#742E85] font-bold text-xl mb-6">3</div>
                <h4 className="font-bold mb-3 text-lg">Earn Rewards</h4>
                <p className="text-gray-500 text-[15px] max-w-[220px]">Get rewards when they book a site visit</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reward Structure Section (Rectangle 4746) */}
        <section className="mb-[40px] md:mb-[76px]">
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
        </section>

        {/* Referral Stats Section (Rectangle 4750) */}
        <section className="mb-[40px] md:mb-[76px]">
          <div 
            style={{
              ...commonCardStyle,
            }}
            className="bg-white w-full min-h-[303px] py-10 flex flex-col justify-center p-6 md:p-12"
          >
            <h3 className="text-2xl font-bold mb-10 pl-2">Your Referral Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-[#EFF6FF] p-6 md:p-8 rounded-2xl text-center border border-blue-100 flex flex-col justify-center h-[120px] md:h-[140px]">
                <p className="text-[32px] md:text-[40px] font-bold text-blue-600 mb-1">0</p>
                <p className="text-blue-900 font-medium text-xs md:text-sm">Total Referrals</p>
              </div>
              <div className="bg-[#F0FDF4] p-6 md:p-8 rounded-2xl text-center border border-green-100 flex flex-col justify-center h-[120px] md:h-[140px]">
                <p className="text-[32px] md:text-[40px] font-bold text-green-600 mb-1">0</p>
                <p className="text-green-900 font-medium text-xs md:text-sm">Successful Bookings</p>
              </div>
              <div className="bg-[#FDF2F8] p-6 md:p-8 rounded-2xl text-center border border-pink-100 flex flex-col justify-center h-[120px] md:h-[140px]">
                <p className="text-[32px] md:text-[40px] font-bold text-pink-600 mb-1">₹ 0</p>
                <p className="text-pink-900 font-medium text-xs md:text-sm">Total Earnings</p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms & Conditions Section */}
        <section className="mb-24 px-6 md:px-0">
          <h3 className="text-[24px] md:text-[32px] font-medium text-black mb-6 md:mb-8 leading-tight">Terms & Conditions</h3>
          <ul 
            className="space-y-4 list-disc marker:text-[#E5097F] max-w-full md:max-w-[725px]"
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
                className="text-[20px] md:text-[32px] leading-tight font-normal text-[#6F6F6F]"
              >
                {text}
              </li>
            ))}
          </ul>
        </section>
      </main>

     
    </div>
  );
}
