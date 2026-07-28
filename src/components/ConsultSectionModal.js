"use client";

import { X } from "lucide-react";

export default function ConsultSuccessModal({ onClose }) {
  // Pre-calculated negative delays guarantee immediate falling on modal mount!
  const fallingItems = [
    { left: "3%", delay: "-0.8s", duration: "2.8s", type: "ribbon", rotate: "-15deg" },
    { left: "8%", delay: "-1.9s", duration: "3.2s", type: "ribbon", rotate: "10deg" },
    { left: "14%", delay: "-2.1s", duration: "3.4s", type: "flake", color: "#F59E0B" },
    { left: "20%", delay: "-0.4s", duration: "2.6s", type: "ribbon", rotate: "-25deg" },
    { left: "27%", delay: "-1.2s", duration: "2.5s", type: "ribbon", rotate: "25deg" },
    { left: "33%", delay: "-2.8s", duration: "3.6s", type: "ribbon", rotate: "-10deg" },
    { left: "40%", delay: "-0.3s", duration: "3.8s", type: "flake", color: "#FCD34D" },
    { left: "46%", delay: "-2.7s", duration: "3.1s", type: "ribbon", rotate: "-20deg" },
    { left: "53%", delay: "-1.1s", duration: "2.9s", type: "ribbon", rotate: "30deg" },
    { left: "59%", delay: "-1.6s", duration: "2.7s", type: "flake", color: "#E5097F" },
    { left: "65%", delay: "-2.4s", duration: "3.3s", type: "ribbon", rotate: "-18deg" },
    { left: "72%", delay: "-0.5s", duration: "3.5s", type: "ribbon", rotate: "15deg" },
    { left: "79%", delay: "-2.3s", duration: "3.0s", type: "flake", color: "#F59E0B" },
    { left: "85%", delay: "-1.5s", duration: "2.7s", type: "ribbon", rotate: "-35deg" },
    { left: "91%", delay: "-0.9s", duration: "3.2s", type: "ribbon", rotate: "20deg" },
    { left: "96%", delay: "-2.0s", duration: "2.9s", type: "flake", color: "#761DB6" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ">
      {/* Dynamic Keyframe for Continuous Realistic Falling */}
      <style>{`
        @keyframes realisticFall {
          0% {
            top: -10%;
            transform: translateX(0px) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translateX(14px) rotate(90deg);
          }
          50% {
            transform: translateX(-10px) rotate(180deg);
            opacity: 0.95;
          }
          75% {
            transform: translateX(8px) rotate(270deg);
          }
          100% {
            top: 108%;
            transform: translateX(-12px) rotate(360deg);
            opacity: 0.2;
          }
        }

        .animate-realistic-fall {
          animation: realisticFall linear infinite;
        }
      `}</style>

      <div className="relative w-full max-w-lg rounded-[28px] bg-white px-12 py-4 sm:px-12 sm:py-8 text-center shadow-2xl border border-gray-100 overflow-hidden font-sans">
        
        {/* Continuous Spilling Confetti Container */}
        <div className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden">
          {fallingItems.map((item, index) => (
            <div
              key={index}
              className="absolute animate-realistic-fall"
              style={{
                left: item.left,
                animationDelay: item.delay, // Negative delay makes it active immediately!
                animationDuration: item.duration,
              }}
            >
              {item.type === "ribbon" ? (
                /* Dynamic Gold Ribbon */
                <svg
                  width="20"
                  height="40"
                  viewBox="0 0 24 48"
                  fill="none"
                  style={{ transform: `rotate(${item.rotate})` }}
                >
                  <path
                    d="M12 0 C 20 12, 4 24, 12 36 C 20 44, 16 48, 12 48"
                    stroke="url(#goldGradRealistic)"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="goldGradRealistic" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="50%" stopColor="#FCD34D" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : (
                /* Floating Metallic Flake */
                <div
                  className="w-2.5 h-3 rounded-xs shadow-xs"
                  style={{ backgroundColor: item.color }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Housiey Style Close 'x' Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-500 hover:text-black hover:border-gray-400 transition-colors shadow-2xs cursor-pointer"
        >
          x
        </button>

        {/* Modal Text Content */}
        <div className="relative z-10 py-2">
          <p className="text-xl sm:text-[22px] font-medium text-black tracking-tight leading-snug">
            Our Legal Team Will Get Back To You.
          </p>
        </div>

      </div>
    </div>
  );
}