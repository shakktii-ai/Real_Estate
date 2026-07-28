"use client";

import Image from "next/image";
import { Scale, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import ConsultLogin from "@/components/ConsultLogin";
import ConsultSuccessModal from "@/components/ConsultSectionModal"
export default function ConsultSection() {
  const { user } = useAuth(); // Check user session
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleConsultClick = () => {
    if (user) {
      // User is logged in -> Directly show Success Popup
      setIsSuccessModalOpen(true);
    } else {
      // User is not logged in -> Open Consult Login Modal
      setIsLoginModalOpen(true);
    }
  };

  return (
    <section className="w-full">
      <div className="overflow-hidden bg-[#761DB6]/70 shadow-2xl">
        <div className="grid items-center gap-4 lg:grid-cols-2 px-6 py-8 md:px-12 md:py-12 lg:px-12 lg:py-12">
          
          {/* Left Content */}
          <div className="order-2 lg:order-1 text-white">
            <h2 className="text-[24px] lg:text-[36px] font-semibold leading-tight">
              Make the Right Property Decision
              <br />
              with Expert Guidance
            </h2>

            <p className="mt-5 text-white text-base md:text-[18px] leading-relaxed max-w-2xl">
              Consult with us at no extra charges for an honest review before
              finalizing any project in Pune. No sales pitch—just straight
              talk from local experts who know the market.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={handleConsultClick}
                className="flex items-center gap-2 rounded-xl bg-[#E5097F] px-6 py-2 font-medium text-[18px] text-white shadow-lg transition hover:bg-pink-700 hover:cursor-pointer"
              >
                <Scale size={18} />
                Consult Now
              </button>

              <span className="rounded-full px-4 py-2 text-sm font-medium text-[18px]">
                100% Free
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="overflow-hidden rounded-3xl border-3 border-white shadow-2xl">
              <Image
                src="/consultNow.png"
                alt="Expert Property Consultation"
                width={700}
                height={500}
                className="h-[240px] w-full object-cover lg:w-[520px]"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Render Login Modal for Unauthenticated Users */}
      {isLoginModalOpen && (
        <ConsultLogin
          onClose={() => setIsLoginModalOpen(false)}
          onAuthSuccess={() => {
            setIsLoginModalOpen(false);
            setIsSuccessModalOpen(true); // Open success modal right after successful login/registration
          }}
        />
      )}

      {/* Render Success Modal for Authenticated Users */}
      {isSuccessModalOpen && (
        <ConsultSuccessModal onClose={() => setIsSuccessModalOpen(false)} />
      )}
    </section>
  );
}
