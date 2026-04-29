"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import About from "@/components/about";

export default function AboutUs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const awards = [65, 71, 60, 61];

  const handleScroll = (index) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.children[index];
      if (card) {
        const containerWidth = container.offsetWidth;
        const cardOffset = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const scrollTo = cardOffset - (containerWidth / 2) + (cardWidth / 2);
        container.scrollTo({ left: scrollTo, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    handleScroll(activeIndex);
  }, [activeIndex]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-roboto-condensed text-black">
     

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[476px] h-auto lg:h-[476px] flex flex-col justify-center z-0 py-16 lg:py-0">
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
          ></div>
          <div className="relative z-10 px-6 lg:px-16 max-w-[720px]">
            <h1 className="text-4xl lg:text-[40px] font-bold text-primary-purple mb-4">
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

        {/* Vision, Strengths, Mission */}
        <section className="relative z-10 lg:-mt-16 px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Card 1 */}
          <div className="relative h-[757px] mx-auto w-full max-w-[402px]">
            <Image
              src="/vision.png"
              alt="Our Vision"
              fill
              className="object-cover rounded-2xl"
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
                <h2 className="text-[28px] font-medium underline decoration-primary-pink underline-offset-8 mb-4">
                  Our Vision
                </h2>
                <p className="text-[14px] leading-relaxed text-black">
                  To be Pune's most trusted real estate advisory by combining
                  market expertise, transparency, and customer-first ethics,
                  ensuring that every client finds not just a house — but a
                  place they can proudly call home.
                </p>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="relative h-[757px] mx-auto w-full max-w-[402px]">
            <Image
              src="/strengths.png"
              alt="Our Core Strengths"
              fill
              className="object-cover rounded-2xl"
              sizes="402px"
            />
            <div
              className="absolute top-0 left-[43px] right-[43px] h-[604px] z-10"
              style={{
                background:
                  "radial-gradient(97.99% 97.99% at 50% 50%, #FFFFFF 0%, #CCA4D6 100%)",
              }}
            >
              <div className="p-8 h-full flex flex-col">
                <h2 className="text-[28px] font-medium underline decoration-primary-pink underline-offset-8 mb-4">
                  Our Core Strengths
                </h2>
                <ul className="list-disc list-outside pl-4 space-y-2 text-[13px] leading-snug text-black">
                  <li>
                    <span className="font-bold">9+ Years of Expertise</span> in
                    Pune's residential real estate market.
                  </li>
                  <li>
                    <span className="font-bold">Maharashtra RERA Registered</span>{" "}
                    and NAREDCO–REMI Certified.
                  </li>
                  <li>
                    <span className="font-bold">GST-Compliant Company</span> –
                    transparent operations with accountability.
                  </li>
                  <li>
                    <span className="font-bold">No Brokerage</span> – We follow
                    a 100% No Brokerage Policy.
                  </li>
                  <li>
                    <span className="font-bold">Exclusive EOP Partnerships</span>{" "}
                    with AAA+ Rated Developers.
                  </li>
                  <li>
                    <span className="font-bold">Customer-Centric Approach</span>{" "}
                    – Personalized assistance and honest guidance.
                  </li>
                  <li>
                    <span className="font-bold">End-to-End Support</span> – From
                    property selection to documentation.
                  </li>
                  <li>
                    <span className="font-bold">Trusted by Hundreds</span> of
                    Homebuyers across Pune.
                  </li>
                </ul>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 text-center text-white">
              <p className="text-[18px] font-bold leading-tight">
                Rera – A031262503639 || A52100026024
                <br />
                GSTIN – 27AEFPT4188M1Z
              </p>
            </div>
          </div>
          {/* Card 3 */}
          <div className="relative h-[757px] mx-auto w-full max-w-[402px]">
            <Image
              src="/mission.png"
              alt="Our Mission"
              fill
              className="object-cover rounded-2xl"
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
                <h2 className="text-[28px] font-medium underline decoration-primary-pink underline-offset-8 mb-4">
                  Our Mission
                </h2>
                <p className="text-[14px] leading-relaxed text-black">
                  To guide and empower our clients at every stage of the
                  home-buying journey — from discovery to possession — ensuring
                  their expectations are not just met, but consistently
                  exceeded.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="px-6 py-24 lg:px-16 flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-3/5">
            <h2 className="text-4xl lg:text-[40px] font-bold text-primary-pink mb-8">
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

        <section className="bg-footer-bg py-20 px-6 lg:px-16 overflow-hidden">
          <h2 className="text-4xl lg:text-[40px] font-bold text-primary-purple mb-12">
            Awards & Rewards
          </h2>
          <div
            ref={scrollRef}
            className="flex gap-12 overflow-hidden pb-10 items-center justify-start lg:justify-center px-20"
          >
            {awards.map((id, index) => {
              const isTall = id === 71;
              const isActive = index === activeIndex;
              return (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0.6, scale: 0.95, grayscale: 1 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.6, 
                    scale: isActive ? 1.1 : 0.95,
                    filter: isActive ? "grayscale(0%)" : "grayscale(50%)",
                    zIndex: isActive ? 10 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative flex-shrink-0 cursor-pointer"
                  onClick={() => setActiveIndex(index)}
                  style={{
                    width: isTall ? "306px" : "307px",
                    height: isTall ? "450px" : "307px",
                  }}
                >
                  <Image
                    src={`/image-${id}.png`}
                    alt={`Award ${id}`}
                    fill
                    className="object-cover rounded-[17px]"
                    sizes="307px"
                  />
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-center gap-6 mt-[-40px] relative z-20">
            <motion.button
              whileHover={{ scale: activeIndex > 0 ? 1.1 : 1 }}
              whileTap={{ scale: activeIndex > 0 ? 0.9 : 1 }}
              onClick={() => activeIndex > 0 && setActiveIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                activeIndex === 0
                  ? "bg-zinc-100 text-zinc-300 cursor-not-allowed opacity-40"
                  : "bg-primary-purple text-white hover:bg-opacity-90 active:scale-95"
              }`}
            >
              <svg
                className="w-8 h-8 rotate-180"
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
              whileHover={{ scale: activeIndex < awards.length - 1 ? 1.1 : 1 }}
              whileTap={{ scale: activeIndex < awards.length - 1 ? 0.9 : 1 }}
              onClick={() =>
                activeIndex < awards.length - 1 && setActiveIndex(activeIndex + 1)
              }
              disabled={activeIndex === awards.length - 1}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                activeIndex === awards.length - 1
                  ? "bg-zinc-100 text-zinc-300 cursor-not-allowed opacity-40"
                  : "bg-primary-purple text-white hover:bg-opacity-90"
              }`}
            >
              <svg
                className="w-8 h-8"
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
        </section>

        {/* Certification */}
        <section className="px-6 py-20 lg:px-16">
          <h2 className="text-4xl lg:text-[40px] font-bold text-primary-purple mb-12">
            Certification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
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

        <About />
      </main>

    
    </div>
  );
}
