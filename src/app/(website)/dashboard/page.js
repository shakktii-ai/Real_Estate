"use client";
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import LivingStyleCard from '@/components/admin/LivingStyleCard';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
import WhyChooseUs from '@/components/WhyChoose';
import About from '@/components/about';
import Review from '@/components/Review';
import WhyPiingkasha from '@/components/WhyPiingkasha';
import Counter from '@/components/Counter';
import JoinUs from '@/components/JoinUs';
import ReferNow from '@/components/ReferNow';
import NriDesk from '@/components/NriDesk';
import CallUsNow from '@/components/CallNowPopup';
import LiveAgentPopup from '@/components/LiveAgentPopup';
import NewLaunchCard from '@/components/NewLaunchCard';
import NewLaunchPopup from '@/components/NewLaunchPopup';
import ConsultNow from '@/components/ConsultSection';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import TourSelectionModal from '@/components/TourSelectionModal';
import BookSiteVisitModal from '@/components/BookSiteVisitModal';
import BookVirtualTourModal from '@/components/BookVirtualTourModal';
import { useSearchParams } from 'next/navigation';
import {
  CalendarDays,
  TrendingDown,
  Gift,
  User,
  ChevronRight, ArrowRight, ChevronDown, Star, Phone
} from "lucide-react";

// Step-scroll row: uses the same carousel mechanism as the Google Reviews section
const WHY_SLIDES = [
  {
    bg: "/Galaxy-04_1.png",
    badge: "No Brokerage Policy",
    icon: "/img1.png",
    points: [
      "Stop Answering Multiple Calls, Compare Top South Pune Projects in One Place.",
      "Buy your dream home without paying brokerage.",
      "Get expert guidance, project comparison",
    ],
  },
  {
    bg: "/Galaxy-04.png",
    badge: "Transparent Bottom-Line Pricing",
    icon: "/img4.png",
    points: [
      "Exclusive Pre-Launch Pricing & Early Access Benefits",
      "Direct Developer Pricing with Zero Brokerage Charges.",
      "Transparent Best-Value Pricing with No Negotiation Required",
    ],
  },
  {
    bg: "/Galaxy-04_3.png",
    badge: "Virtual & On-Site Project Tours Explore",
    icon: "/img3.png",
    points: [
      "Explore Properties Through Immersive Virtual Presentations & 3D Walkthroughs",
      "Experience Personalised On-Site Visits with Expert Property Guidance",
      "Make Informed Decisions with Interactive Virtual Tours and Site Inspections",
    ],
  },
  {
    bg: "/Galaxy-04_4.png",
    badge: "100% Trusted Platform with End-to-End Support",
    icon: "/img2.png",
    points: [
      "Looking for a Home in South Pune? Explore Verified Properties Across NIBM, Undri, Mohammadwadi, Handewadi & Beyond—Without the Hassle of Multiple Sales Calls.",
    ],
  },
];

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function PropertyFilterBar({ projects, onFilteredProjects, onViewMore }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCity, setSelectedCity] = useState("Pune");
  const [selectedCategory, setSelectedCategory] = useState("");
  const budgetParam = searchParams.get("budget");
  const [budget, setBudget] = useState(budgetParam ? Number(budgetParam) : ["Plot"].includes(categoryParam) ? 440 : 99);
  const [selectedStatus, setSelectedStatus] = useState("");
  const router = useRouter();
  const trustItems = [
    "Brokerage",
    "Service Fees",
    "Hidden Charges",
  ];

  const [currentTrust, setCurrentTrust] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrust((prev) => (prev + 1) % trustItems.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);
  const handleCategorySelect = (value) => {
    setSelectedCategory(value);
    if (["Plot"].includes(value) && budget < 250) {
      setBudget(440);
    }
  };
  const applyFilters = () => {
    const filtered = projects.filter((project) => {
      const matchesBudget = (project.pricing?.maxPrice || 0) / 100000 <= budget;
      const matchesCity =
        selectedCity === "Pune"
          ? project.address?.city === "Pune"
          : (
            project.address?.city?.toLowerCase().includes(selectedCity.toLowerCase()) ||
            project.address?.area?.toLowerCase().includes(selectedCity.toLowerCase())
          );
      const matchesCategory = !selectedCategory || project.tags?.includes(selectedCategory);
      const matchesStatus = !selectedStatus || project.status === selectedStatus;
      return matchesBudget && matchesCity && matchesCategory && matchesStatus;
    });
    onFilteredProjects(filtered);

    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedCity) params.set('location', selectedCity);
      if (selectedStatus) params.set('status', selectedStatus);
      if (budget) params.set('budget', String(budget));
      params.set('fromHome', '1');
      const q = params.toString();
      router.push(`/properties${q ? `?${q}` : ''}`);
    } catch (err) {
      console.error('Failed to navigate to properties', err);
    }
  };

  const cities = [...new Set(projects.map(p => p.address?.city).filter(Boolean))];

  const selectClass =
    "appearance-none w-full text-sm text-gray-800 font-semibold bg-transparent outline-none pr-6 cursor-pointer rounded-none border-0 focus:ring-0";
  const newLaunchProjects = projects
    .filter((project) => project.tags?.includes("New Launch"))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <div className="w-full max-w-6xl mx-auto">

      {/* Trust Bar */}
      <div className="flex flex-row md:flex-cols flex-wrap gap-2 py-4">
        {/* No Brokerage */}
        <div className="flex items-center gap-2 w-full md:w-[160px] h-[70px] rounded-2xl border border-[#664997] bg-[#6D4491]/85 px-2 shadow-md shadow-gray-600">
          <div className="w-[45px] h-[58px] rounded-xl border border-[#664997] bg-[#000000]/40 backdrop-blur-md flex items-center justify-center">
            <img
              src="/hands 1.png"
              alt="No Brokerage"
              className="w-[32px] h-[30px]"
            />
          </div>

          <h3
            className="text-[#F5F5F5]  text-[16px] font-medium leading-6">
            No <br className='hidden md:block' /> Brokerage
          </h3>
        </div>

        {/* No Fees */}
        <div className="flex items-center gap-2 w-full md:w-[160px] h-[70px] rounded-2xl border border-[#E5097F] bg-[#E5097F]/56 px-2 shadow-md shadow-gray-600">
          <div className="w-[45px] h-[58px] rounded-xl border border-[#E5097F] bg-[#000000]/40 backdrop-blur-md flex items-center justify-center">
            <img
              src="/fees.png"
              alt="No Brokerage"
              className="w-[32px] h-[30px]"
            />
          </div>

          <h3
            className="text-[#F5F5F5]  text-[16px] font-medium leading-6">
            No <br className='hidden md:block' /> Fees
          </h3>
        </div>

        {/* No Hidden Charges */}
        <div className="flex items-center gap-2 w-full md:w-[160px] h-[70px] rounded-2xl border border-[#DB61FA] bg-[#DB61FA]/72 px-2 shadow-md shadow-gray-600">
          <div className="w-[45px] h-[58px] rounded-xl border border-[#DB61FA] bg-[#000000]/40 backdrop-blur-md flex items-center justify-center ">
            <img
              src="/hiddencharges.png"
              alt="No Brokerage"
              className="w-[32px] h-[30px]"
            />
          </div>

          <h3
            className="text-[#F5F5F5]  text-[16px] font-medium leading-6">
            No Hidden <br className='hidden md:block' />Charges
          </h3>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
        {/* ── 1. Filter Bar Component ── */}
        <div className="bg-white text-[14px] rounded-xl shadow-lg px-5 py-3 flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-0 w-full max-w-4xl border border-gray-100">
          {/* Location */}
          <div className="flex flex-col flex-1 min-w-[120px] md:border-r border-gray-200 md:pr-4">
            <span className=" font-semibold text-[#742E85] uppercase tracking-widest mb-1">Location</span>
            <div className="relative flex items-center">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={`${selectClass} w-full bg-transparent font-medium text-gray-800 pr-5 focus:outline-none cursor-pointer`}
                style={{ WebkitAppearance: "none", MozAppearance: "none" }}
              >
                <option value="Pune">Pune</option>
                <option value="Hadapsar">Pune - Hadapsar</option>
                <option value="Kondhwa">Pune - Kondhwa</option>
                <option value="Pisoli">Pune - Pisoli</option>
                <option value="Undri">Pune - Undri</option>
                <option value="Mohammed Wadi">Pune - Mohammed Wadi</option>
                <option value="Salisbury Park">Pune - Salisbury Park</option>
                <option value="Gultekdi">Pune - Gultekdi</option>
                <option value="Wadachi Wadi">Pune - Wadachi Wadi</option>
                <option value="NIBM Road">Pune - NIBM Road</option>
                {cities.filter(c => c !== "Pune").map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Property */}
          <div className="flex flex-col flex-1 min-w-[170px] md:border-r border-gray-200 md:px-4">
            <span className=" font-semibold text-[#742E85] uppercase tracking-widest mb-1">Property</span>
            <div className="relative flex items-center">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className={`${selectClass} w-full bg-transparent font-medium text-gray-800 pr-5 focus:outline-none cursor-pointer`}
                style={{ WebkitAppearance: "none", MozAppearance: "none" }}
              >
                <option value="">All</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Plot">Plots</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Budget */}
          <div className="flex flex-col flex-1 min-w-[140px] md:border-r border-gray-200 md:px-4">
            <span className=" font-semibold text-[#742E85] uppercase tracking-widest mb-1">Budget</span>
            <input
              type="range" min="65" max="1000" step="1" value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#742E85] mt-1"
            />
            <span className="text-xs text-gray-600 mt-0.5 font-medium">
              ₹65L - ₹{budget >= 1000 ? "10Cr" : `${budget}L`}
            </span>
          </div>

          {/* Status */}
          <div className="flex flex-col flex-1 min-w-[120px] md:border-r border-gray-200 md:px-4">
            <span className="font-semibold text-[#742E85] uppercase tracking-widest mb-1">Status</span>
            <div className="relative flex items-center">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`${selectClass} w-full bg-transparent font-medium text-gray-800 pr-5 focus:outline-none cursor-pointer`}
                style={{ WebkitAppearance: "none", MozAppearance: "none" }}
              >
                <option value="">All</option>
                <option value="Ready">Ready</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Late Possession">Late Possession</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Apply */}
          <div className="md:pl-3 w-full md:w-auto">
            <button
              onClick={applyFilters}
              className="bg-black text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-gray-900 transition whitespace-nowrap"
            >
              Apply
            </button>
          </div>
        </div>
        {/* ── 2. Right Widgets Stack (Ping AI & Call Now) ── */}
        {/* <div className="flex flex-col gap-6 min-w-[220px] "> */}
        {/* Ping AI Badge */}
        {/* <button
                        type="button"
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                window.dispatchEvent(new Event('open-chatbot'));
                            }
                        }}
                        className="w-full rounded-[18px] bg-gradient-to-r from-[#742E85] to-[#E5097F] border border-white shadow-md shadow-white p-2.5 px-4 flex items-center gap-3 text-left transition-transform hover:scale-[1.01] hover:cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center flex-shrink-0 bg-black/54">
                            <Image
                                src="/chatbot.png"
                                alt="Ping AI"
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="text-white text-[15px] font-semibold leading-tight tracking-tight mb-1">
                                Ping AI
                            </h2>
                            <p className="text-white  text-[11px] lg:text-[10px] font-medium leading-tight">
                                Find the Right HomeFaster
                            </p>
                        </div>
                    </button> */}

        {/* Call Now Button */}
        {/* <a
                        href="tel:+919284429197"
                        className="bg-[#E5097F] ml-12 hover:bg-[#c8006e] text-white text-[12px] lg:text-[10px] font-medium px-4 py-2 rounded-full shadow-md shadow-black/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                        <Phone size={13} className=" text-white" />
                        <span>Call Now: 9284429197</span>
                    </a>
                </div> */}
      </div>

      {newLaunchProjects.length > 0 && (
        <div className="mt-6">
          <div className="flex  gap-2 mb-3 bg-white/50 w-md rounded-xl pl-4">
            <Image
              src="/rocket.png"
              alt="New Launch"
              width={24}
              height={24}
              className="object-contain"
            />

            <h3 className="text-black font-semibold text-[18px] lg:text-[20px] " style={{ WebkitTextStroke: "0.5px #ffffff" }}>
              New Launches – Be the First to Know
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 ">
            {newLaunchProjects.slice(0, 3).map((project) => (
              <NewLaunchCard
                key={project._id}
                project={project}
              />
            ))}
            {newLaunchProjects.length > 3 && (

              <button
                onClick={onViewMore}
                className="text-black underline decoration-black  font-semibold text-[20px] hover:cursor-pointer"
                style={{
                  WebkitTextStroke: "0.2px #ffffff",
                }}
              >

                View More

              </button>

            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Hero Why Choose Us Slider ────────────────────────────────────────────────
function HeroWhyChooseUs({ projects, onFilteredProjects, onViewMore }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % WHY_SLIDES.length);
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = WHY_SLIDES[current];

  return (
    <>
      <div className='w-full  bg-[#742E85]/41 font-medium text-[12px] lg:text-[18px] flex justify-center items-center text-black p-2'>
        <Phone size={15} className='text-black mr-2 ' />   Talk to Our Property Expert  : <a href="tel:+919284429197" className='mr-2'> 9284429197</a>  |  <a href="tel:+919529249230" className='ml-2'>9529249230</a>
      </div>
      <section className="relative w-full overflow-hidden" style={{ minHeight: "92vh" }}>

        {/* ── Background layers with dissolve ── */}
        {WHY_SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: i === current ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              zIndex: 0,
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${s.bg}')` }}
            />
            <img
              src={s.bg}
              alt=""
              className="absolute inset-0 w-full h-full object-contain md:object-center"
              aria-hidden="true"
            />
            {/* Sharp cut-line overlay */}
            <div className="absolute inset-0">
              {/* Mobile */}
              <div
                className="absolute inset-0 md:hidden bg-gradient-to-b from-[#ffffff] to-[#ffffff]/10"

              />

              {/* Desktop */}
              <div
                className="absolute inset-0 hidden md:block bg-gradient-to-b from-[#ffffff] to-[#ffffff]/25"
              />
            </div>
          </div>
        ))}

        {/* ── Content ── */}
        <div
          className="relative flex flex-col justify-between px-6 md:px-14 lg:px-20 pt-6 pb-4"
          style={{ zIndex: 10, minHeight: "82vh" }}
        >
          <div className="flex-1 flex flex-col justify-center max-w-6xl">

            <p
              className="mb-5 font-semibold text-[24px] lg:text-[28px]"
              style={{
                background: "linear-gradient(to right,  #000000, #E682FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "clamp(16px, 1.8vw, 20px)",
                lineHeight: "28px",
                letterSpacing: "0rem",
                width: "fit-content",
                // filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.35))",
                WebkitTextStroke: "0.2px #ffffff"
              }}
            >
              The Address That Defines Success,
              <br className="hidden sm:inline" />{" "}
              Your Gateway to Premium Living in Pune South

            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full shadow-md shadow-black/25 w-10 h-10 md:w-[50px] md:h-[50px]"
                    style={{
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #E579FF 100%)",
                      boxShadow: "0 4px 18px rgba(227,114,255,0.35)",
                    }}
                  >
                    <img
                      src={slide.icon}
                      alt=""
                      className="w-6 h-6 md:w-9 md:h-9 object-contain"
                    />
                  </div>

                  <h2
                    className="font-semibold leading-tight text-[18px] sm:text-[22px] md:text-[28px] text-[#54315D] w-full"
                    style={{ WebkitTextStroke: "0.2px #ffffff" }}
                  >
                    {slide.badge}
                  </h2>
                </div>

                <ul className="space-y-2.5 sm:space-y-3 w-full md:max-w-[800px] text-[15px] sm:text-[16px] md:text-[18px] pl-[52px] md:pl-[66px]">
                  {slide.points.map((pt, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 sm:gap-3 leading-5 md:leading-[22px] text-[#54325D] font-medium"
                      // style={{
                      //   color: "#ffffff",
                      //   fontFamily: "Poppins, sans-serif",
                      //   //   fontSize: "clamp(14px, 1.4vw, 18px)",
                      //   fontWeight: 400,
                      // }}
                    >
                      <span
                        className="flex-shrink-0 rounded-full bg-[#54325D] w-1.5 h-1.5 mt-2"
                        // style={{ width: 5, height: 5, background: "#ffffff", marginTop: 8 }}
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-5 mt-0">
            <PropertyFilterBar projects={projects} onFilteredProjects={onFilteredProjects} onViewMore={onViewMore} />
          </div>
        </div>
      </section>
    </>
  );
}
function StepScrollRow({ projects, direction, onTourClick, showTopControls = false, showBottomControls = false }) {
  const PAUSE_MS = 4000;
  const TRANSITION_MS = 700;
  const STEP_COUNT = 1;

  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [cardStep, setCardStep] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const carouselRef = useRef(null);

  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    updateItems();
    window.addEventListener('resize', updateItems);
    return () => window.removeEventListener('resize', updateItems);
  }, []);

  useEffect(() => {
    if (!carouselRef.current) return;
    const firstCard = carouselRef.current.querySelector(':scope > div');
    if (!firstCard) return;
    if (window.innerWidth < 640) {
      setCardStep(carouselRef.current.parentElement.offsetWidth);
    } else {
      const gap = 12;
      setCardStep(
        Math.round(firstCard.getBoundingClientRect().width + gap)
      );
    }
  }, [projects.length, itemsPerView]);

  const autoDelta = STEP_COUNT;

  useEffect(() => {
    if (projects.length === 0 || isHovering || !cardStep) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setIndex((prev) => prev + autoDelta);
    }, PAUSE_MS);
    return () => clearInterval(interval);
  }, [projects.length, isHovering, autoDelta, cardStep]);

  useEffect(() => {
    if (projects.length === 0 || !cardStep) return;

    if (index >= projects.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, TRANSITION_MS);
      return () => clearTimeout(timeout);
    }

    if (index < 0) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(Math.max(0, projects.length - STEP_COUNT));
      }, TRANSITION_MS);
      return () => clearTimeout(timeout);
    }
  }, [index, projects.length, cardStep]);

  const handleNext = () => {
    setIsTransitioning(true);
    setIndex((prev) => prev + STEP_COUNT);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setIndex((prev) => {
      const next = prev - STEP_COUNT;
      return next < 0 ? Math.max(0, projects.length - STEP_COUNT) : next;
    });
  };

  const displayProjects = [...projects, ...projects];

  return (
    <div
      className="relative overflow-hidden py-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {showTopControls && (
        <div className="flex justify-end px-3 mb-3 space-x-2">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-full bg-white/95 border border-[#742E85] p-3 shadow-lg text-[#742E85] transition duration-200 hover:bg-white hover:scale-105"
            aria-label="Previous property"
          >
            <ChevronRight className="h-6 w-6 rotate-180" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full bg-white/95 border border-[#742E85] p-3 shadow-lg text-[#742E85] transition duration-200 hover:bg-white hover:scale-105"
            aria-label="Next property"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      <div className="overflow-hidden md:px-3">
        <div
          ref={carouselRef}
          className={`${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''} flex md:gap-3`}
          style={{
            transform: `translateX(-${index * cardStep}px)`,
          }}
        >
          {displayProjects.map((project, i) => (
            <div
              key={`${project._id ?? i}-${i}`}
              className="flex-shrink-0 w-full sm:w-[280px] md:w-[320px]"
            >
              <PropertyCard project={project} onTourClick={onTourClick} />
            </div>
          ))}
        </div>
      </div>

      {showBottomControls && (
        <div className="flex justify-end px-3 mt-3 space-x-2">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-full bg-white/95 border border-[#742E85] p-3 shadow-lg text-[#742E85] transition duration-200 hover:bg-white hover:scale-105"
            aria-label="Previous property"
          >
            <ChevronRight className="h-6 w-6 rotate-180" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full bg-white/95 border border-[#742E85] p-3 shadow-lg text-[#742E85] transition duration-200 hover:bg-white hover:scale-105"
            aria-label="Next property"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
// ─── Explore Filtered Properties ──────────────────────────────────────────────
function ExploreProperties({ projects, onTourClick }) {
  if (!projects || projects.length === 0) return (
    <p className="text-center text-gray-500 py-8 text-sm">No properties match your filters.</p>
  );
  return (
    <div className="mt-6 px-4 max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-extrabold text-[#742E85] mb-4 text-center">Explore Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project) => (
          <PropertyCard key={project._id} project={project} onTourClick={onTourClick} />
        ))}
      </div>
    </div>
  );
}
export default function WebsitePage() {
  const [cards, setCards] = useState([]);
  const [projects, setProjects] = useState([]);
  const { user, loading } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [priceDropCount, setPriceDropCount] = useState(0);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [hasFiltered, setHasFiltered] = useState(false);
  const router = useRouter();
  const [activeTourProject, setActiveTourProject] = useState(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false); // New state to separate selection display from project state
  const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
  const [showVirtualTourModal, setShowVirtualTourModal] = useState(false);
  const [livingIndex, setLivingIndex] = useState(0);
  const [isLivingHovered, setIsLivingHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
    const newLaunchProjects = projects
        .filter(p => p.tags?.includes("New Launch"))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleToggleWishlist = (propertyId, isNowWishlisted) => {
    if (isNowWishlisted) {
      // Add to wishlist array
      setWishlist((prev) => [...prev, propertyId]);
    } else {
      // Remove from wishlist array
      setWishlist((prev) => prev.filter((id) => id !== propertyId));
    }
  };
  useEffect(() => {
    if (!user) return;

    const fetchPriceDrops = async () => {
      try {
        const res = await fetch(`/api/notifications?userId=${user.uid}&role=user`);
        const data = await res.json();

        const count = data.filter(
          (n) => n.type === "priceDrop"
        ).length;

        setPriceDropCount(count);
      } catch (err) {
        console.error("Price drop fetch error:", err);
      }
    };

    fetchPriceDrops();
  }, [user]);
  useEffect(() => {
    if (!user) return;

    // Inside your PropertiesContent component
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`/api/wishlist/get?userId=${user.uid}`);
        const data = await res.json();


        setWishlist(data.map(item => item.propertyId._id));

      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      }
    };

    fetchWishlist();
  }, [user]);
  const [bookingData, setBookingData] = useState({
    siteVisit: [],
    virtualTour: [],
  });
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`/api/sitevisit?userId=${user.uid}`),
          fetch(`/api/virtualTour?userId=${user.uid}`),
        ]);

        const siteVisitData = await res1.json();
        const virtualTourData = await res2.json();

        setBookingData({
          siteVisit: siteVisitData,
          virtualTour: virtualTourData,
        });
      } catch (error) {
        console.error("Booking fetch error:", error);
      }
    };

    fetchBookings();
  }, [user]);
  const siteVisitCount = bookingData.siteVisit.length + bookingData.virtualTour.length;
  useEffect(() => {
    fetch('/api/living-styles')
      .then(res => res.json())
      .then(data => {
        setCards(data);

      });
  }, []);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (isLivingHovered || cards.length <= 1) return;
    const interval = setInterval(() => {
      setLivingIndex((prev) => (prev + 1) % cards.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [cards.length, isLivingHovered]);







  const handleTourClick = (project) => {
    setActiveTourProject(project);
    setShowSelectionModal(true);
  };

  const handleFilteredProjects = (filtered) => {
    setFilteredProjects(filtered);
    setHasFiltered(true);
  };




  if (loading) return null;
  return (
    <div className='bg-white'>

      <HeroWhyChooseUs projects={projects} onFilteredProjects={handleFilteredProjects} onViewMore={() => setShowPopup(true)}/>

      {/* ② Explore Filtered Results (shown after Apply) */}
      {hasFiltered && (
        <section className="py-8">
          <ExploreProperties projects={filteredProjects} onTourClick={handleTourClick} />
        </section>
      )}

      <section className='mt-[2px] mx-4'>
        {user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            <Link
              href="/myvisit"
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <CalendarDays className="text-blue-600" size={28} />
                </div>

                <div>
                  <p className="text-black text-sm">Site Visits</p>
                  <h3 className="text-xl font-semibold text-black">
                    {siteVisitCount} Scheduled
                  </h3>
                </div>
              </div>

              <ChevronRight className="text-black" size={30} />
            </Link>

            {/* <Link
              href="/priceDrop"
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                  <TrendingDown className="text-red-500" size={28} />
                </div>

                <div>
                  <p className="text-black text-sm">Price Drops</p>
                  <h3 className="text-xl font-semibold text-black">
                    {priceDropCount > 0 ? `${priceDropCount} Alerts` : "No Alerts"}
                  </h3>
                </div>
              </div>

              <ChevronRight className="text-black" size={30} />
            </Link> */}

            <Link
              href="/referrals"
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Gift className="text-green-600" size={28} />
                </div>

                <div>
                  <p className="text-black text-sm">Referrals</p>
                  <h3 className="text-xl font-semibold text-black">
                    Earn Rewards
                  </h3>
                </div>
              </div>

              <ChevronRight className="text-black" size={30} />
            </Link>

            <Link
              href="/profile"
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="text-purple-600" size={28} />
                </div>

                <div>
                  <p className="text-black text-sm">Profile</p>
                  <h3 className="text-xl font-semibold text-black">
                    Manage
                  </h3>
                </div>
              </div>

              <ChevronRight className="text-black" size={30} />
            </Link>
          </div>
        )}
      </section>
      <div className='mt-8'>
        <div className="px-4">
          <h2 className="text-xl md:text-[35px] font-bold text-[#742E85] mb-1.5 text-center">Featured Projects</h2>
          <p className="text-center text-black text-xs md:text-[15px] max-w-3xl mx-auto mb-2 leading-relaxed">Zero Spamming, Just Expert Insights</p>
        </div>

        {/* Row 1 — step-scroll left: top-right buttons */}
        {projects.length > 0 && (
          <StepScrollRow
            projects={projects}
            direction="left"
            onTourClick={handleTourClick}
            showTopControls
          />
        )}

        {/* Row 2 — step-scroll right: bottom-right buttons */}
        {projects.length > 0 && (
          <StepScrollRow
            projects={[...projects].reverse()}
            direction="right"
            onTourClick={handleTourClick}
            showBottomControls
          />
        )}

        <div className="flex justify-center m-2">
          <Link href="/properties" className="inline-flex items-center justify-center bg-[#ffffff] text-black px-6 py-3 rounded-lg text-sm font-semibold border border-[#969393]">Load More Projects</Link>
        </div>



        {/* Choose Your Living Style Section */}
        <section className="py-8 md:py-10  my-8 px-4 bg-[#F6F3F6]" >

          <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-md md:text-xl font-bold text-[#742E85] drop-shadow-md mb-1.5">Choose Your Living Style</h2>
              <p className="text-black text-xs md:text-sm max-w-xl mx-auto font-medium opacity-80">Find a home that matches your lifestyle, comfort, and aspirations.</p>
            </div>
            <div className="w-full">
              {/*Mobile Slider */}
              <div
                className="sm:hidden overflow-hidden relative"
                onMouseEnter={() => setIsLivingHovered(true)}
                onMouseLeave={() => setIsLivingHovered(false)}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${livingIndex * 100}%)`,
                  }}
                >
                  {cards.map((card) => (
                    <div key={card._id} className="min-w-full flex justify-center">
                      <LivingStyleCard card={card} />
                    </div>
                  ))}
                </div>
              </div>

              {/*Desktop Grid */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full justify-items-center">
                {cards.map((card) => (
                  <div key={card._id}>
                    <LivingStyleCard card={card} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* <WhyChooseUs /> */}
      <ConsultNow />
      <NriDesk />
      <About showOn="homepage" />
      <h2 className="text-[24px] md:text-[36px] font-bold text-[#742E85] mb-5 text-center">
        Google Reviews
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center   gap-6 md:gap-26 mb-2">
        {/* Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-3xl font-bold text-gray-900">4.8</span>

            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-[#FBBC05] text-[#FBBC05]"
              />
            ))}
          </div>

          <p className="text-sm text-black">on Google</p>
        </div>

        {/* Button */}
        <a
          href="https://g.page/r/CYYb97YJda6_EBM/review"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          Review Us on Google
        </a>
      </div>

      <Review />

      {/* Builder Partners Marquee Section */}
      <section className="bg-white overflow-hidden my-12">
        <div className="max-w-7xl mx-auto px-4 mb-2 text-center">
          <h2 className="text-[24px] md:text-[36px] font-bold text-[#742E85] mb-8 flex items-center justify-center">Our Builder Partners</h2>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 z-10 h-full w-20 " />
          <div className="absolute right-0 top-0 z-10 h-full w-20 " />
          <div className="flex w-max animate-marquee gap-4">
            {["/yooone.png", "/lodha.png", "/tribeca.png", "/kumarProperties.png", "/goelganga.png", "/majestic.png", "/shapoorji.png", "/kraheja.png", "/godrej.png", "/koltepatil.png", "/kohinoor.png", "/solitaire.png", "/nyati.png"]
              .concat(["/yooone.png", "/lodha.png", "/tribeca.png", "/kumarProperties.png", "/goelganga.png", "/majestic.png", "/shapoorji.png", "/kraheja.png", "/godrej.png", "/koltepatil.png", "/kohinoor.png", "/solitaire.png", "/nyati.png"])
              .map((logo, index) => (
                <div key={index} className="flex items-center justify-center min-w-[100px]">
                  <img src={logo} alt="Builder Partner" className="h-9 md:h-6 w-auto object-contain transition duration-300" />
                </div>
              ))}
          </div>
        </div>
      </section>
      <ReferNow />
      <WhyPiingkasha />
      <Counter />
      <JoinUs />
      {/* <CallUsNow /> */}
      <LiveAgentPopup
        delay={20000}
        phoneNumbers={[
          {
            number: "9284429197",
            color: "green",
          },
          {
            number: "9529249230",
            color: "yellow",
          },
        ]}
        onCallbackSubmit={async (data) => {
          await fetch("/api/callback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        }}
      />
      <NewLaunchPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        projects={newLaunchProjects}
      />

      {/* CTA Layer Block */}
      {/* <section className='bg-[#F6F3F6] py-12 px-6 text-center'>
        <h2 className="text-sm md:text-xl font-bold text-black mb-2 flex items-center justify-center">Ready to Find Your Dream Home?</h2>
        <p className='text-sm md:text-md text-gray-700 mb-2 flex items-center justify-center'>Explore verified projects in South Pune, including NIBM, NIBM Annex, and Mahadevwadi, with transparent pricing and expert guidance.</p>
        <div className="flex items-center justify-center">
          <Link href="/properties" className="bg-[#742E85] text-white px-5 py-3 rounded-md text-sm md:text-base font-semibold inline-flex items-center gap-2 hover:bg-[#5e256b] transition-all duration-300">
            Explore Projects Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section> */}
      {/* ================= GLOBAL MODAL ENGINE LAYER ================= */}

      {/* 1. Type Selection Screen Panel */}
      <TourSelectionModal
        isOpen={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onSelectSiteVisit={() => {
          setShowSelectionModal(false); // Close type selector
          setShowSiteVisitModal(true);  // Mount visit form (activeTourProject is preserved)
        }}
        onSelectVirtualTour={() => {
          setShowSelectionModal(false); // Close type selector
          setShowVirtualTourModal(true); // Mount tour form (activeTourProject is preserved)
        }}
      />

      {/* 2. Site Visit Form Screen Panel */}
      {showSiteVisitModal && activeTourProject && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 ">
          <div className="w-full max-w-[420px] mx-4">
            <BookSiteVisitModal
              propertyId={activeTourProject._id}
              propertyName={activeTourProject.projectName}
              onClose={() => {
                setShowSiteVisitModal(false);
                setActiveTourProject(null); // Now safe to wipe out the data context reference!
              }}
              embedded={true}
            />
          </div>
        </div>
      )}

      {/* 3. Virtual Tour Form Screen Panel */}
      {showVirtualTourModal && activeTourProject && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/50 backdrop-blur-sm   p-4">
          <div className="w-full max-w-[420px] mx-4 ">
            <BookVirtualTourModal
              propertyId={activeTourProject._id}
              propertyName={activeTourProject.projectName}
              onClose={() => {
                setShowVirtualTourModal(false);
                setActiveTourProject(null); // Now safe to wipe out the data context reference!
              }}
              embedded={true}
            />
          </div>
        </div>
      )}

    </div>
  );
}