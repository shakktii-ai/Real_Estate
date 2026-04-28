"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

export default function EMICalculator() {
  const [price, setPrice] = useState(10000000); // 1.00 Cr
  const [downPayment, setDownPayment] = useState(2000000); // 20.00 L
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);
// Add this after your state definitions
useEffect(() => {
  calculateEMI();
}, [price, downPayment, interestRate, tenure]);
  const calculateEMI = () => {
    const P = price - downPayment;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;

    if (P <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(0);
      setIsCalculated(true);
      return;
    }

    const emiValue = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emiValue * n;
    const totalInterestPayable = totalPayable - P;

    setEmi(emiValue);
    setTotalInterest(totalInterestPayable);
    setTotalPayment(totalPayable);
    setIsCalculated(true);
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return (amount / 10000000).toFixed(2) + " Cr";
    } else if (amount >= 100000) {
      return (amount / 100000).toFixed(2) + " L";
    }
    return amount.toLocaleString("en-IN");
  };

  const vastuPoints = [
    {
      id: 1,
      title: "Main Entrance",
      content: [
        "Best directions: East or North",
        "Keep entrance clean, bright, and clutter-free",
        "Avoid broken doors or dark entry",
      ],
      color: "bg-[#742E85]",
    },
    {
      id: 4,
      title: "Bedroom Position",
      content: [
        "Master bedroom -> South-West",
        "Sleep with head towards South or East",
        "Avoid mirrors directly facing the bed",
      ],
      color: "bg-[#E5097F]",
    },
    {
      id: 2,
      title: "Natural Light & Ventilation",
      content: [
        "Ensure maximum sunlight from east",
        "Good airflow = positive energy",
        "Avoid dark, closed spaces",
      ],
      color: "bg-[#E5097F]",
    },
    {
      id: 5,
      title: "Bathroom & Water Flow",
      content: [
        "Bathrooms -> North-West or West",
        "Proper drainage towards North/East",
        "Keep it clean & well-ventilated",
      ],
      color: "bg-[#742E85]",
    },
    {
      id: 3,
      title: "Kitchen Placement",
      content: [
        "Ideal direction: South-East",
        "Cooking facing East is best",
        "Keep kitchen clean & organized",
      ],
      color: "bg-[#742E85]",
    },
    {
      id: 6,
      title: "Plants & Open Space",
      content: [
        "Place plants in North or East",
        "Keep more open space in these directions",
        "Avoid heavy items blocking sunli",
      ],
      color: "bg-[#E5097F]",
    },
  ];



  return (
    <div className="min-h-screen bg-white font-sans text-black">
     <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[40px] font-bold text-[#742E85] mb-2"
          >
            EMI Calculator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            Calculate your monthly EMI and find eligible properties
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Loan Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]"
          >
            <h2 className="text-xl font-bold mb-8 text-gray-800">Loan Details</h2>

            <div className="space-y-10">
              {/* Property Price */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Property Price</span>
                  <span className="text-[20px] font-bold text-gray-900">{formatCurrency(price)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30000000"
                  step="100000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                  style={{
                    background: `linear-gradient(to right, #2563EB 0%, #2563EB ${(price / 30000000) * 100}%, #E5E7EB ${(price / 30000000) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-[14px] text-gray-500">
                  <span>0 L</span>
                  <span>3 Cr</span>
                </div>
              </div>

              {/* Down Payment */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Down Payment</span>
                  <span className="text-[20px] font-bold text-gray-900">{formatCurrency(downPayment)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={price}
                  step="50000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                  style={{
                    background: `linear-gradient(to right, #2563EB 0%, #2563EB ${(downPayment / price) * 100}%, #E5E7EB ${(downPayment / price) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-[14px] text-gray-500">
                  <span>0</span>
                  <span>{((downPayment / price) * 100 || 0).toFixed(0)}%</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Interest Rate (%p.a.)</span>
                  <span className="text-[20px] font-bold text-gray-900">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                  style={{
                    background: `linear-gradient(to right, #2563EB 0%, #2563EB ${(interestRate / 15) * 100}%, #E5E7EB ${(interestRate / 15) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-[14px] text-gray-500">
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Loan Tenure */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Loan Tenure</span>
                  <span className="text-[20px] font-bold text-gray-900">{tenure} Years</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                  style={{
                    background: `linear-gradient(to right, #2563EB 0%, #2563EB ${(tenure / 30) * 100}%, #E5E7EB ${(tenure / 30) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-[14px] text-gray-500">
                  <span>0 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

              <button 
                onClick={calculateEMI}
                className="w-full py-4 bg-[#1D4ED8] text-white font-bold rounded-xl text-lg hover:bg-[#1E40AF] transition-all shadow-lg active:scale-95 translate-y-2"
              >
                Calculate EMI
              </button>
            </div>
          </motion.div>

          {/* Right Column: Breakdown & Vastu */}
          <div className="space-y-10">
            {/* EMI Breakdown Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-10 rounded-2xl border border-gray-100 shadow-[0px_4px_25px_rgba(0,0,0,0.06)] min-h-[300px] flex flex-col justify-center items-center text-center relative"
            >
              <h2 className="text-2xl font-bold mb-6 absolute top-10 left-10 text-gray-800">EMI Breakdown</h2>
              
              {!isCalculated ? (
                <div className="mt-8 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mb-6 border border-gray-200">
                    <Calculator className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-500 text-lg">Enter your details and calculate EMI</p>
                </div>
              ) : (
                <div className="w-full space-y-8 mt-10">
                  <div className="bg-blue-50 p-6 rounded-2xl">
                    <p className="text-gray-600 font-medium mb-1">Monthly EMI</p>
                    <p className="text-[36px] font-bold text-[#1D4ED8]">₹ {Math.round(emi).toLocaleString("en-IN")}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <p className="text-gray-500 text-sm mb-1">Principal Amount</p>
                      <p className="text-lg font-bold">₹ {(price - downPayment).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <p className="text-gray-500 text-sm mb-1">Total Interest</p>
                      <p className="text-lg font-bold">₹ {Math.round(totalInterest).toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-500 text-sm mb-1">Total Amount Payable</p>
                    <p className="text-xl font-bold text-gray-900">₹ {Math.round(totalPayment).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Vastu Section (Direction-Based Planning) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-10 rounded-2xl border border-gray-100 shadow-[0px_4px_25px_rgba(0,0,0,0.06)]"
            >
              <h2 className="text-2xl font-bold mb-1 text-gray-800">Direction-Based Planning</h2>
              <p className="text-gray-500 text-sm mb-10">Every direction has its unique energy and purpose in Vastu Shastra</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {vastuPoints.map((point) => (
                  <div key={point.id} className="space-y-4">
                    <div className="flex items-center w-full">
                      <div 
                        style={{
                          background: "linear-gradient(90deg, #E5097F 0%, #FFFFFF 100%)",
                          minWidth: "195px",
                          width: "fit-content",
                          height: "30px",
                          borderRadius: "0px",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "12px",
                          paddingRight: "24px",
                          whiteSpace: "nowrap"
                        }}
                      >
                        <span className="font-bold text-black text-[16px]">
                          {point.id}. {point.title}
                        </span>
                      </div>
                    </div>
                    <ul className="space-y-2 pl-4">
                      {point.content.map((item, idx) => (
                        <li key={idx} className="flex items-start text-[13px] text-gray-600">
                          <span className="mr-2 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>


      </main>

    
    </div>
  );
}
