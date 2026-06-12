"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import About from "@/components/about";

export default function AboutUs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const awards = [65, 71, 60, 61];
  const strengths = [
  {
    label: "RERA Registered & Industry Certified",
    points: [
      "Maharashtra RERA registered for complete transparency.",
      "NAREDCO–REMI certified real estate professionals.",
      "Trusted, compliant, and credible property advisory services."
    ]
  },
  {
    label: "9+ Years of Real Estate Expertise",
    points: [
      "Deep understanding of Pune’s residential property market.",
      "Expert guidance to help you make informed decisions.",
      "Trusted support from property search to final booking."
    ]
  },
  {
    label: "GST-Compliant & Transparent Operations",
    points: [
      "Fully GST-compliant business practices.",
      "Complete transparency in all transactions.",
      "Clear documentation and billing process.",
     
    ]
  },
  {
    label: "100% No Brokerage, No Advisory Fees",
    points: [
      "Pay absolutely zero brokerage charges.",
      "No hidden advisory or consultation fees.",
      "Save significantly on your property purchase.",
     
    ]
  },
  {
    label: "Exclusive Developer Partnerships",
    points: [
      "Access to pre-launch and exclusive project offers.",
      "Special pricing through trusted developer tie-ups.",
      "Opportunity to secure homes at competitive rates."
    ]
  },
  {
    label: "Customer-First Approach",
    points: [
      "Personalized property recommendations.",
      "Honest and transparent buying guidance.",
      "Dedicated support at every stage."
    ]
  },
  {
    label: "End-to-End Property Assistance",
    points: [
      "Expert support from search to possession.",
      "Organized site visits and project walkthroughs.",
      "Home loan and financing assistance."
    ]
  },
  {
    label: "Trusted by Hundreds of Homebuyers",
    points: [
      "Preferred choice of homebuyers across Pune.",
      "Access to genuine and verified property options.",
      "Known for competitive pricing and value deals."
    ]
  }
];
const handleScroll = (index) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.children[index];

      if (card) {
        const containerWidth = container.offsetWidth;
        const cardOffset = card.offsetLeft;
        const cardWidth = card.offsetWidth;

        const scrollTo = cardOffset - containerWidth / 2 + cardWidth / 2;

        container.scrollTo({
          left: scrollTo,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % awards.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, awards.length]);

  useEffect(() => {
    handleScroll(activeIndex);
  }, [activeIndex]);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden font-roboto-condensed text-black">
      <main>
        <section className="relative overflow-hidden min-h-[476px] h-auto lg:h-[476px] flex flex-col justify-center z-0 py-4 lg:py-0">
          <div className="absolute inset-0">
            <Image
              src="/Rectangle_4826.png"
              alt="Hero Background"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(178.85deg, #FFFFFF -21.47%, rgba(255, 255, 255, 0) 373%)",
            }}
          />
          <div className="relative z-10 px-6 lg:px-16 max-w-[720px]">
            <h1 className="text-md lg:text-[25px] font-bold text-primary-purple mb-4">
              About Us
            </h1>
            <p className="text-base lg:text-[18px] leading-relaxed lg:leading-[30px] text-black">
              Piinggaksha is a company focused on simplifying the home buying
              process for its clients.{" "}
              <span className="font-bold">PIINGGAKSHA REALTY</span> is a
              Maharashtra RERA-Registered and NAREDCO–REMI Certified real estate
              consultancy firm based in South Pune, proudly serving clients for
              over 9+ years.
              <br />
              We are a GST-compliant, performance-driven organization focused on
              delivering value, trust, and transparency in every real estate
              transaction.
            </p>
          </div>
        </section>

        <section className="relative z-10 lg:-mt-16 px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="relative h-[550] md:h-[450px] mx-auto w-full max-w-[402px]">
            <Image
              src="/vision.png"
              alt="Our Vision"
              fill
              className="object-cover rounded-2xl opacity-70"
              sizes="402px"
            />
            <div
              className="absolute top-0 left-[43px] right-[43px] h-[293px] z-10"
              style={{
                background:
                  "radial-gradient(97.99% 97.99% at 50% 50%, #FFFFFF 0%, #CCA4D6 100%)",
              }}
            >
              <div className="p-8 h-full flex flex-col justify-start">
                <h2 className="text-[25px] font-medium underline decoration-primary-pink underline-offset-8 mb-4">
                  Our Vision
                </h2>
                <p className="text-[12px] leading-relaxed text-black">
                  To be Pune's most trusted real estate advisory by combining
                  market expertise, transparency, and customer-first ethics,
                  ensuring that every client finds not just a house — but a
                  place they can proudly call home.
                </p>
              </div>
            </div>
          </div>

          

              
          {/* CORE STRENGTHS CARD - SLIDE AND PAUSE ONE-BY-ONE */}
          <div className="relative h-[600] md:h-[450px] mx-auto w-full max-w-[402px]">
            <Image
              src="/strengths.png"
              alt="Our Core Strengths"
              fill
              className="object-cover rounded-2xl opacity-70"
              sizes="402px"
            />
            <div
              className="absolute top-0 left-[24px] right-[24px] h-[350px] md:h-[300px] z-10  overflow-hidden"
              style={{
                background:
                  "radial-gradient(97.99% 97.99% at 50% 50%, #FFFFFF 0%, #CCA4D6 100%)",
              }}
            >
              <div className="pt-6 px-4 h-full flex flex-col justify-between p-2">
                <h2 className="text-[18px] font-medium underline decoration-primary-pink underline-offset-6 mb-2 px-2 shrink-0">
                  Our Core Strengths
                </h2>
                
                {/* Single Card Window Frame Viewport */}
                <div className="w-full overflow-hidden relative flex-grow flex items-center py-1">
                  
                  {/* Step Slider Tracks */}
                  <motion.div
                    className="flex w-full"
                    animate={{ x: `-${(activeIndex % strengths.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 22 }}
                  >
                    {strengths.map((item, idx) => (
                      <div
                        key={idx}
                        className="w-full shrink-0 px-2 select-none"
                      >
                        {/* Interactive Item Container Card */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-purple-200/60 shadow-md flex flex-col justify-start min-h-[220px] mx-auto max-w-[324px]">
                          
                          {/* Inner Card Header Title */}
                          <h4 className="text-[12px] font-bold text-black flex items-center gap-2 mb-2">
                            {/* <span className="w-2 h-2 rounded-full bg-primary-pink shrink-0" /> */}
                            {item.label}
                          </h4>
                          
                          {/* Inner Separator Rule */}
                          <div className="w-full h-[1px] bg-purple-100/70 mb-2.5" />
                          
                          {/* Descriptive Point Items Wrapper */}
                          <div className="text-[12px] text-black pl-2 space-y-2 font-normal leading-normal">
                            {item.points.map((point, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-1.5">
                                <span className="text-primary-pink font-bold select-none mt-0.5">•</span>
                                <p className="flex-1">{point}</p>
                              </div>
                            ))}
                          </div>

                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Progress Indicators (Dots Alignment) */}
                <div className="flex justify-center flex-wrap gap-1.5 mt-3 px-4">
                  {strengths.map((_, i) => (
                    <div 
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        (activeIndex % strengths.length) === i 
                        ? "w-4 bg-primary-pink" 
                        : "w-1.5 bg-purple-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Dynamic Card Sub-Footer Labeling Info text */}
            <div className="absolute bottom-4 left-0 right-0 z-20 text-center text-white">
              <p className="text-[14px] font-bold leading-tight">
                Rera – A031262503639 || A52100026024
                <br />
                GSTIN – 27AEFPT4188M1Z
              </p>
            </div>
          </div>
            
          
          <div className="relative h-[450px] mx-auto w-full max-w-[402px]">
            <Image
              src="/mission.png"
              alt="Our Mission"
              fill
              className="object-cover rounded-2xl opacity-70"
              sizes="402px"
            />
            <div
              className="absolute top-0 left-[43px] right-[43px] h-[293px] z-10"
              style={{
                background:
                  "radial-gradient(97.99% 97.99% at 50% 50%, #FFFFFF 0%, #CCA4D6 100%)",
              }}
            >
              <div className="p-8 h-full flex flex-col justify-start">
                <h2 className="text-[20px] font-medium underline decoration-primary-pink underline-offset-8 mb-4">
                  Our Mission
                </h2>
                <p className="text-[12px] leading-relaxed text-black">
                  To guide and empower our clients at every stage of the
                  home-buying journey — from discovery to possession — ensuring
                  their expectations are not just met, but consistently
                  exceeded.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 lg:px-16 flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-3/5">
            <h2 className="text-md lg:text-[25px] font-bold text-primary-pink mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-lg lg:text-[18px] leading-relaxed text-zinc-800">
              <p>
                Piinggaksha Realty was founded with a simple yet powerful
                belief — buying a home should be exciting, not overwhelming.
                What started as a small initiative in South Pune has today grown
                into a trusted real estate consultancy.
              </p>
              <p>
                Over the years, we observed a common challenge faced by
                homebuyers — confusing processes, hidden costs, and lack of
                genuine guidance. That’s where Piinggaksha stepped in. We set
                out to simplify the entire home-buying journey by offering clear
                advice.
              </p>
              <p>
                From the first property search to the final possession, our goal
                has always been to make the experience smooth, transparent, and
                stress-free. Our 100% No Brokerage Policy reflects our
                commitment to putting customers first.
              </p>
              <p>
                Being a Maharashtra RERA-Registered firm, we operate with full
                compliance, accountability, and trust — values that have helped
                us serve hundreds of happy homebuyers across Pune.
              </p>
            </div>
          </div>
          <div className="lg:w-2/5">
            <div className="relative w-full aspect-[390/563] rounded-[20px] overflow-hidden">
              <Image
                src="/founder.png"
                alt="Founder"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </section>

        <section
          className="bg-footer-bg py-10 lg:py-10 px-4 sm:px-6 lg:px-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-md md:text-[25px] font-bold text-primary-purple mb-4 text-center lg:text-left">
              Awards & Rewards
            </h2>

            <div
              ref={scrollRef}
              className="flex justify-start gap-6 sm:gap-8 lg:gap-10 overflow-x-auto overflow-y-hidden pb-10 pt-6 items-center snap-x snap-mandatory scroll-smooth no-scrollbar"
            >
              {awards.map((id, index) => {
                const isActive = index === activeIndex;

                return (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0.6, scale: 0.95 }}
                    animate={{
                      opacity: isActive ? 1 : 0.5,
                      scale: isActive ? 1.05 : 0.95,
                      filter: isActive ? "grayscale(0%)" : "grayscale(80%)",
                      zIndex: isActive ? 10 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    onClick={() => setActiveIndex(index)}
                    className="relative flex-shrink-0 cursor-pointer snap-center min-w-[220px] sm:w-[260px] lg:w-[340px]"
                  >
                    <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] lg:w-[340px] lg:h-[340px] rounded-[24px] overflow-hidden">
                      <Image
                        src={`/image-${id}.png`}
                        alt={`Award ${id}`}
                        fill
                        className="object-cover "
                        sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 340px"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 sm:gap-6 mt-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === 0 ? awards.length - 1 : prev - 1
                  )
                }
                className="w-8 h-8 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-[#742E85] text-white shadow-lg"
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % awards.length)
                }
                className="w-8 h-8 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-[#742E85] text-white shadow-lg"
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </section>

        <section className="px-6 py-4 lg:px-16">
          <h2 className="text-md lg:text-[25px] font-bold text-primary-purple mb-4">
            Certification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            <div className="relative aspect-[654/505] w-full">
              <Image
                src="/image-59.png"
                alt="Certification 1"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[448/645] w-full">
              <Image
                src="/cert-4.png"
                alt="Certification 2"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
              <div className="relative aspect-[377/533] w-full">
                <Image
                  src="/cert-1.png"
                  alt="Certification 3"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="relative aspect-[376/533] w-full">
                <Image
                  src="/cert-2.png"
                  alt="Certification 4"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="relative aspect-[375/533] w-full">
                <Image
                  src="/cert-3.png"
                  alt="Certification 5"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>
        </section>

        <About showOn="about" />
      </main>
    </div>
  );
}
