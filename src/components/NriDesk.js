"use client";

import { useState } from "react";
import Image from "next/image";

export default function NRIInvestmentSection() {
  // State to track which card index is flipped on mobile tap
  const [flippedIndex, setFlippedIndex] = useState(null);

  const handleCardClick = (index) => {
    // Toggle flip state on tap
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  const features = [
    {
      image: "/nri1.png",
      title: "Remote Property Tours",
      description:
        "Video walkthroughs, 3D tours and live site visits via video call from your living room abroad.",
    },
    {
      image: "/nri2.png",
      title: "FEMA & RBI Compliance",
      description:
        "Complete guidance on FEMA regulations, repatriation of funds, and legal property ownership for NRIs.",
    },
    {
      image: "/nri3.png",
      title: "Power of Attorney Support",
      description:
        "We assist with POA documentation so a trusted person in India can act on your behalf during the transaction.",
    },
    {
      image: "/nri4.png",
      title: "NRI Home Loan Assistance",
      description:
        "Connect with leading banks offering special NRI home loan schemes with competitive interest rates.",
    },
  ];

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-[24px] md:text-[36px] font-bold text-[#742E85]">
            NRI Property Investment in South Pune
          </h2>

          <p className="mt-2 text-black max-w-3xl mx-auto text-base md:text-[18px] font-normal">
            Invest in Pune with confidence. From property selection to
            registration, we manage everything remotely for NRIs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => {
            const isFlipped = flippedIndex === index;

            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className="group flex justify-center [perspective:1200px] cursor-pointer"
              >
                <div
                  className={`relative h-56 w-56 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* Front */}
                  <div className="absolute inset-0 rounded-full bg-[#F6F3F6] shadow-xl shadow-black/30 border border-gray-100 flex flex-col items-center justify-center px-6 [backface-visibility:hidden]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={74}
                      height={74}
                      className="object-contain"
                    />

                    <h3 className="mt-4 text-center font-medium text-black leading-5">
                      {item.title}
                    </h3>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 rounded-full bg-[#FFD8EA] shadow-xl flex items-center justify-center px-6 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-black text-sm leading-6">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}