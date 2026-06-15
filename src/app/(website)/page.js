// "use client";
// import { useMemo, useState, useEffect, useRef } from 'react';
// import LivingStyleCard from '@/components/admin/LivingStyleCard';
// import PropertyCard from '@/components/PropertyCard';
// import Link from 'next/link';
// import { toast } from 'react-toastify';
// import { motion } from "framer-motion";
// import WhyChooseUs from '@/components/WhyChoose';
// import About from '@/components/about';
// import Review from '@/components/Review';
// import WhyPiingkasha from '@/components/WhyPiingkasha';
// import Counter from '@/components/Counter';
// import { useAuth } from '@/lib/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import TourSelectionModal from '@/components/TourSelectionModal';
// import BookSiteVisitModal from '@/components/BookSiteVisitModal';
// import BookVirtualTourModal from '@/components/BookVirtualTourModal';
// import AuthModal from '@/components/AuthModal';
// import {
//     CalendarDays,
//     TrendingDown,
//     Gift,
//     User,
//     ChevronRight, ArrowBigRight, ArrowRight
// } from "lucide-react";
// import PropertySlider from '@/components/PropertySlidder';

// function FeaturedProjectCarousel({ projects, direction, onTourClick, showTopControls = false, showBottomControls = false }) {
//     const [index, setIndex] = useState(0);
//     const [cardStep, setCardStep] = useState(0);
//     const [isHovering, setIsHovering] = useState(false);
//     const [isTransitioning, setIsTransitioning] = useState(true);
//     const carouselRef = useRef(null);

//     useEffect(() => {
//         const measureStep = () => {
//             if (!carouselRef.current) return;
//             const firstCard = carouselRef.current.querySelector(':scope > div');
//             if (!firstCard) return;

//             const cardRect = firstCard.getBoundingClientRect();
//             const style = window.getComputedStyle(firstCard);
//             const gap = 1; // gap-4
//             setCardStep(Math.round(cardRect.width + gap));
//         };

//         measureStep();
//         window.addEventListener('resize', measureStep);
//         return () => window.removeEventListener('resize', measureStep);
//     }, [projects.length]);

//     useEffect(() => {
//         if (projects.length === 0 || isHovering || !cardStep) return;

//         const interval = setInterval(() => {
//             setIsTransitioning(true);
//             setIndex((prev) => prev + 1);
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [projects.length, isHovering, cardStep]);

//     useEffect(() => {
//         if (projects.length === 0 || !cardStep) return;

//         if (index >= projects.length) {
//             const timeout = setTimeout(() => {
//                 setIsTransitioning(false);
//                 setIndex(0);
//             }, 700);
//             return () => clearTimeout(timeout);
//         }

//         if (index < 0) {
//             const timeout = setTimeout(() => {
//                 setIsTransitioning(false);
//                 setIndex(Math.max(0, projects.length - 1));
//             }, 700);
//             return () => clearTimeout(timeout);
//         }
//     }, [index, projects.length, cardStep]);

//     const carouselProjects = direction === 'right' ? [...projects].reverse() : projects;
//     const displayProjects = [...carouselProjects, ...carouselProjects];

//     const handleNext = () => {
//         setIsTransitioning(true);
//         setIndex((prev) => prev + 1);
//     };

//     const handlePrev = () => {
//         setIsTransitioning(true);
//         setIndex((prev) => prev - 1);
//     };

//     return (
//         <div
//             className="relative overflow-hidden py-4"
//             onMouseEnter={() => setIsHovering(true)}
//             onMouseLeave={() => setIsHovering(false)}
//         >
//             {showTopControls && (
//                 <div className="flex justify-end px-3 mb-3 space-x-2">
//                     <button
//                         type="button"
//                         onClick={handlePrev}
//                         className="rounded-full bg-white/95 border border-[#742E85] p-3 shadow-lg text-[#742E85] transition duration-200 hover:bg-white hover:scale-105"
//                         aria-label="Previous property"
//                     >
//                         <ChevronRight className="h-6 w-6 rotate-180" />
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleNext}
//                         className="rounded-full bg-white/95 border border-[#742E85] p-3 shadow-lg text-[#742E85] transition duration-200 hover:bg-white hover:scale-105"
//                         aria-label="Next property"
//                     >
//                         <ChevronRight className="h-6 w-6" />
//                     </button>
//                 </div>
//             )}


//             <div className="overflow-hidden px-3">
//                 <div
//                     ref={carouselRef}
//                     className={`${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''} flex gap-3`}
//                     style={{
//                         transform: `translateX(-${index * cardStep}px)`,
//                     }}
//                 >
//                     {displayProjects.map((project, i) => (
//                         <div key={`${project._id ?? i}-${i}`} className="flex-shrink-0 w-[280px] md:w-[320px]">
//                             <PropertyCard project={project} onTourClick={onTourClick} />
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {showBottomControls && (
//                 <div className="flex justify-end px-3 mt-3 space-x-2">
//                     <button
//                         type="button"
//                         onClick={handlePrev}
//                         className="rounded-full bg-white/95 border border-[#742E85] p-3 shadow-lg text-[#742E85] transition duration-200 hover:bg-white hover:scale-105"
//                         aria-label="Previous property"
//                     >
//                         <ChevronRight className="h-6 w-6 rotate-180" />
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleNext}
//                         className="rounded-full bg-white/95 border border-[#742E85] p-3 shadow-lg text-[#742E85] transition duration-200 hover:bg-white hover:scale-105"
//                         aria-label="Next property"
//                     >
//                         <ChevronRight className="h-6 w-6" />
//                     </button>
//                 </div>
//             )}

//         </div>
//     );
// }

// export default function WebsitePage() {
//     const [cards, setCards] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const { user, loading } = useAuth();

//     const router = useRouter();
//     const [activeTourProject, setActiveTourProject] = useState(null);
//     const [showSelectionModal, setShowSelectionModal] = useState(false);
//     const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
//     const [showVirtualTourModal, setShowVirtualTourModal] = useState(false);
//     const [showAuthModal, setShowAuthModal] = useState(false);

//     useEffect(() => {
//         if (!loading && user) {
//             router.replace("/dashboard");
//             return;
//         }

//         if (!loading && !user) {
//             const timer = setTimeout(() => {
//                 setShowAuthModal(true);
//             }, 5000);

//             return () => clearTimeout(timer);
//         }
//     }, [user, loading, router]);

//     useEffect(() => {
//         fetch('/api/living-styles')
//             .then(res => res.json())
//             .then(data => setCards(data));
//     }, []);

//     useEffect(() => {
//         const fetchProjects = async () => {
//             try {
//                 const res = await fetch("/api/properties");
//                 const data = await res.json();
//                 setProjects(data);
//             } catch (error) {
//                 console.error("Failed to fetch projects", error);
//             }
//         };
//         fetchProjects();
//     }, []);    // Helper handler when a user clicks the "Tour" button on any Property Card
//     const handleTourClick = (project) => {
//         if (!user) {
//             toast.error("Please Signup to book a tour");
//             setShowAuthModal(true); // Automatically opens your login modal layout if guest
//             return;
//         }
//         setActiveTourProject(project);
//         setShowSelectionModal(true);
//     };
//     const [livingIndex, setLivingIndex] = useState(0);
//     const [isLivingHovered, setIsLivingHovered] = useState(false);
//     useEffect(() => {
//         if (isLivingHovered || cards.length <= 1) return;

//         const interval = setInterval(() => {
//             setLivingIndex((prev) => (prev + 1) % cards.length);
//         }, 2500); // pause time

//         return () => clearInterval(interval);
//     }, [cards.length, isLivingHovered]);

//     if (loading || user) return null;

//     return (
//         <div className='bg-white max-h-full'>
//             {/* Banner Section */}
//             <section className="relative min-h-[50vh] md:min-h-[60vh] w-full flex flex-col items-center justify-center py-12 md:py-20">
//                 <div className="absolute inset-0 z-0">
//                     <img src='/banner.png' alt='banner image' className="w-full h-full object-cover object-center rounded-b-[2rem]" />
//                     <div className="absolute inset-0 " />
//                 </div>
//                 <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-12 flex flex-col items-center">
//                     <div className="text-center">
//                         <h2 className="text-4xl md:text-7xl font-extrabold text-[#742E85] drop-shadow-md mb-4">Discover Your Perfect Home</h2>
//                         <p className="text-black text-sm md:text-xl max-w-2xl mx-auto font-semibold opacity-90">Find a home that matches your lifestyle, comfort, and aspirations.</p>
//                     </div>
//                 </div>
//             </section>

//             {/* Featured Projects Section */}
//             <div className='mt-8'>
//                 <div className="px-4">
//                     <h2 className="text-xl md:text-[35px] font-bold text-[#742E85] mb-1.5 text-center">Featured Projects</h2>
//                     <p className="text-center text-black text-xs md:text-sm max-w-3xl mx-auto mb-2 leading-relaxed">Hand-picked developments with verified details and instant transparency</p>
//                 </div>

//                 {projects.length > 0 && (
//                     <FeaturedProjectCarousel
//                         projects={projects}
//                         direction="left"
//                         onTourClick={handleTourClick}
//                         showTopControls
//                     />
//                 )}

//                 {projects.length > 0 && (
//                     <FeaturedProjectCarousel
//                         projects={projects}
//                         direction="right"
//                         onTourClick={handleTourClick}
//                         showBottomControls
//                     />
//                 )}

//                 <div className="flex justify-center m-2">
//                     <Link href="/properties" className="inline-flex items-center justify-center bg-[#ffffff] text-black px-6 py-3 rounded-lg text-sm font-semibold border border-[#969393]">Load More Projects</Link>
//                 </div>



//                 {/* Choose Your Living Style Section */}
//                 <section className="py-8 md:py-10 bg-[#F6F3F6] my-8 px-4" 
//                 style={{backgroundImage: "url('/backgroundImg.png')",backgroundSize: "cover"}}
//                 >
//                     <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center">
//                         <div className="text-center mb-6 md:mb-8">
//                             <h2 className="text-md md:text-xl font-bold text-[#742E85] drop-shadow-md mb-1.5">Choose Your Living Style</h2>
//                             <p className="text-black text-xs md:text-sm max-w-xl mx-auto font-medium opacity-80">Find a home that matches your lifestyle, comfort, and aspirations.</p>
//                         </div>
//                         <div className="w-full">
//                             {/*Mobile Slider */}
//                             <div
//                                 className="sm:hidden overflow-hidden relative"
//                                 onMouseEnter={() => setIsLivingHovered(true)}
//                                 onMouseLeave={() => setIsLivingHovered(false)}
//                             >
//                                 <div
//                                     className="flex transition-transform duration-500 ease-in-out"
//                                     style={{
//                                         transform: `translateX(-${livingIndex * 100}%)`,
//                                     }}
//                                 >
//                                     {cards.map((card) => (
//                                         <div key={card._id} className="min-w-full flex justify-center">
//                                             <LivingStyleCard card={card} />
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/*Desktop Grid */}
//                             <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full justify-items-center">
//                                 {cards.map((card) => (
//                                     <div key={card._id}>
//                                         <LivingStyleCard card={card} />
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>

//             {/* <WhyChooseUs /> */}
//             <About showOn="homepage" />
//             <h2 className="text-md md:text-xl font-bold text-[#742E85] flex items-center justify-center">Google Reviews</h2>
//             <Review />

//             {/* Builder Partners Marquee Section */}
//             <section className="bg-white overflow-hidden my-12">
//                 <div className="max-w-7xl mx-auto px-4 mb-2 text-center">
//                     <h2 className="text-md md:text-xl font-bold text-[#742E85] mb-8 flex items-center justify-center">Our Builder Partners</h2>
//                 </div>
//                 <div className="relative overflow-hidden">
//                     <div className="absolute left-0 top-0 z-10 h-full w-20 " />
//                     <div className="absolute right-0 top-0 z-10 h-full w-20 " />
//                     <div className="flex w-max animate-marquee gap-4">
//                         {["/yooone.png", "/lodha.png", "/tribeca.png", "/kumarProperties.png", "/goelganga.png", "/majestic.png", "/shapoorji.png", "/kraheja.png", "/godrej.png", "/koltepatil.png", "/kohinoor.png", "/solitaire.png", "/nyati.png"]
//                             .concat(["/yooone.png", "/lodha.png", "/tribeca.png", "/kumarProperties.png", "/goelganga.png", "/majestic.png", "/shapoorji.png", "/kraheja.png", "/godrej.png", "/koltepatil.png", "/kohinoor.png", "/solitaire.png", "/nyati.png"])
//                             .map((logo, index) => (
//                                 <div key={index} className="flex items-center justify-center min-w-[100px]">
//                                     <img src={logo} alt="Builder Partner" className="h-9 md:h-6 w-auto object-contain transition duration-300" />
//                                 </div>
//                             ))}
//                     </div>
//                 </div>
//             </section>
//             <WhyPiingkasha />
//             <Counter />

//             {/* CTA Layer Block */}
//            <section className='bg-[#F6F3F6] py-12 px-6 text-center'>
//                 <h2 className="text-sm md:text-xl font-bold text-black mb-2 flex items-center justify-center">Ready to Find Your Dream Home?</h2>
//                 <p className='text-sm md:text-md text-gray-700 mb-2 flex items-center justify-center'>Explore verified projects in wakad with transparent pricing and expert guidance.</p>
//                 <div className="flex items-center justify-center">
//                     <Link href="/properties" className="bg-[#742E85] text-white px-5 py-3 rounded-md text-sm md:text-base font-semibold inline-flex items-center gap-2 hover:bg-[#5e256b] transition-all duration-300">
//                         Explore Projects Now
//                         <ArrowRight size={18} />
//                     </Link>
//                 </div>
//             </section>

//             {/* ================= GLOBAL MODAL ENGINE LAYER ================= */}

//             {/* 1. Type Selection Screen Panel */}
//             {user && <TourSelectionModal
//                 isOpen={showSelectionModal}
//                 onClose={() => setShowSelectionModal(false)}
//                 onSelectSiteVisit={() => {
//                     setShowSelectionModal(false); // Close type selector
//                     setShowSiteVisitModal(true);  // Mount visit form (activeTourProject is preserved)
//                 }}
//                 onSelectVirtualTour={() => {
//                     setShowSelectionModal(false); // Close type selector
//                     setShowVirtualTourModal(true); // Mount tour form (activeTourProject is preserved)
//                 }}
//             />}


//             {/* 2. Site Visit Form Screen Panel */}
//             {showSiteVisitModal && activeTourProject && (
//                 <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 w-screen h-screen top-0 left-0">
//                     <div className="w-full max-w-[420px] mx-4 relative z-[100000]">
//                         <BookSiteVisitModal
//                             propertyId={activeTourProject._id}
//                             propertyName={activeTourProject.projectName}
//                             onClose={() => {
//                                 setShowSiteVisitModal(false);
//                                 setActiveTourProject(null); // Now safe to wipe out the data context reference!
//                             }}
//                             embedded={true}
//                         />
//                     </div>
//                 </div>
//             )}

//             {/* 3. Virtual Tour Form Screen Panel */}
//             {showVirtualTourModal && activeTourProject && (
//                 <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 w-screen h-screen top-0 left-0">
//                     <div className="w-full max-w-[420px] mx-4 relative z-[100000]">
//                         <BookVirtualTourModal
//                             propertyId={activeTourProject._id}
//                             propertyName={activeTourProject.projectName}
//                             onClose={() => {
//                                 setShowVirtualTourModal(false);
//                                 setActiveTourProject(null); // Now safe to wipe out the data context reference!
//                             }}
//                             embedded={true}
//                         />
//                     </div>
//                 </div>
//             )}

//             {showAuthModal && (
//                 <AuthModal
//                     onClose={() => setShowAuthModal(false)}
//                     onAuthSuccess={() => setShowAuthModal(false)}
//                 />
//             )}
//         </div>
//     )
// }


"use client";
import { useMemo, useState, useEffect, useRef } from 'react';
import LivingStyleCard from '@/components/admin/LivingStyleCard';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";
import About from '@/components/about';
import Review from '@/components/Review';
import WhyPiingkasha from '@/components/WhyPiingkasha';
import Counter from '@/components/Counter';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import TourSelectionModal from '@/components/TourSelectionModal';
import BookSiteVisitModal from '@/components/BookSiteVisitModal';
import BookVirtualTourModal from '@/components/BookVirtualTourModal';
import AuthModal from '@/components/AuthModal';
import { ChevronRight, ArrowRight, ChevronDown } from "lucide-react";

// ─── Slide data ───────────────────────────────────────────────────────────────
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
function PropertyFilterBar({ projects, onFilteredProjects }) {
    const [selectedCity, setSelectedCity] = useState("Pune");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [budget, setBudget] = useState(99);
    const [selectedStatus, setSelectedStatus] = useState("");
    const router = useRouter();

    const applyFilters = () => {
        const filtered = projects.filter((project) => {
            const matchesBudget = (project.pricing?.maxPrice || 0) / 100000 <= budget;
            // const matchesCity = !selectedCity || project.address?.city === selectedCity;
            const matchesCity =
                selectedCity === "Pune"
                    ? project.address?.city === "Pune"
                    : project.address?.area
                        ?.toLowerCase()
                        .includes(selectedCity.toLowerCase());
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

    return (
        <div className="bg-white text-[15px] rounded-2xl shadow-2xl px-4 py-4 flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-0 w-full max-w-6xl mx-auto">
            {/* Location */}
            <div className="flex flex-col flex-1 min-w-[110px] md:border-r border-gray-200 md:pr-4">
                <span className="font-semibold text-[#742E85] uppercase tracking-widest mb-1">Location</span>
                <div className="relative">
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className={selectClass}
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
            <div className="flex flex-col flex-1 min-w-[190px] md:border-r border-gray-200 md:px-4">
                <span className="font-semibold text-[#742E85] uppercase tracking-widest mb-1">Property</span>
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={selectClass}
                        style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                    >
                        <option value="">All</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Budget */}
            <div className="flex flex-col flex-1 min-w-[140px] md:border-r border-gray-200 md:px-4">
                <span className="font-semibold text-[#742E85] uppercase tracking-widest mb-1">Budget</span>
                <input
                    type="range" min="50" max="400" step="1" value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-[#742E85] mt-1"
                />
                <span className="text-xs text-gray-600 mt-0.5 font-medium">
                    ₹50L - ₹{budget >= 400 ? "4Cr" : `${budget}L`}
                </span>
            </div>

            {/* Status */}
            <div className="flex flex-col flex-1 min-w-[120px] md:border-r border-gray-200 md:px-4">
                <span className="font-semibold text-[#742E85] uppercase tracking-widest mb-1">Status</span>
                <div className="relative">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className={selectClass}
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
            <div className="md:pl-4">
                <button
                    onClick={applyFilters}
                    className="bg-black text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-gray-900 transition whitespace-nowrap"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}

// ─── Hero Why Choose Us Slider ────────────────────────────────────────────────
function HeroWhyChooseUs({ projects, onFilteredProjects }) {
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
                        className="absolute inset-0 w-full h-full object-cover md:object-center"
                        aria-hidden="true"
                    />

                    {/* ✅ Sharp cut-line overlay — solid dark left panel, clear image right */}
                    <div className="absolute inset-0">
                        {/* Mobile */}
                        <div
                            className="absolute inset-0 md:hidden"
                            style={{
                                background:
                                    "linear-gradient(to bottom, rgba(0,0,0,0.37) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.25) 55%)",
                            }}
                        />

                        {/* Desktop */}
                        <div
                            className="absolute inset-0 hidden md:block"
                            style={{
                                width: "50%",
                                background: "rgba(0,0,0,0.40)",
                            }}
                        />
                    </div>
                </div>
            ))}

            {/* ── Content ── */}
            <div
                className="relative flex flex-col justify-between px-6 md:px-14 lg:px-20 pt-6 pb-4"
                style={{ zIndex: 10, minHeight: "82vh" }}
            >
                <div className="flex-1 flex flex-col justify-center max-w-2xl">

                    <p
                        className="mb-5 font-bold uppercase tracking-[0.22em]"
                        style={{
                            color: "#ffffff",
                            fontSize: "clamp(13px, 1.6vw, 18px)",
                            letterSpacing: "0.22em",
                        }}
                    >
                        WHY CHOOSE US
                    </p>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="flex-shrink-0 flex items-center justify-center rounded-full"
                                    style={{
                                        width: 50,
                                        height: 50,
                                        background: "linear-gradient(135deg, #ffffff 0%, #E372FF 100%)",
                                        boxShadow: "0 4px 18px rgba(227,114,255,0.35)",
                                    }}
                                >
                                    <img
                                        src={slide.icon}
                                        alt=""
                                        style={{ width: 30, height: 30, objectFit: "contain" }}
                                    />
                                </div>

                                <h2
                                    className="font-bold leading-tight text-[22px] md:text-[28px] w-full md:w-[440px]"
                                    style={{

                                        background: "linear-gradient(90deg, #ffffff 0%, #E372FF 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                    }}
                                >
                                    {slide.badge}
                                </h2>
                            </div>

                            <ul className="space-y-3 w-full md:w-[500px] text-[14px] md:text-[15px] tracking-[1.5px]">
                                {slide.points.map((pt, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 leading-snug"
                                        style={{
                                            color: "#ffffff",

                                            fontWeight: 400,
                                        }}
                                    >
                                        <span
                                            className="flex-shrink-0 rounded-full mt-2"
                                            style={{ width: 7, height: 7, background: "#ffffff", marginTop: 8 }}
                                        />
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex flex-col items-center gap-5 mt-0">
                    <PropertyFilterBar projects={projects} onFilteredProjects={onFilteredProjects} />
                </div>
            </div>
        </section>
    );
}

// ─── Featured Project Carousel ────────────────────────────────────────────────
function FeaturedProjectCarousel({ projects, direction, onTourClick, showTopControls = false, showBottomControls = false }) {
    const [index, setIndex] = useState(0);
    const [cardStep, setCardStep] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const carouselRef = useRef(null);

    useEffect(() => {
        const measureStep = () => {
            if (!carouselRef.current) return;
            if (window.innerWidth < 640) {
                setCardStep(carouselRef.current.parentElement.offsetWidth);
                return;
            }
            const firstCard = carouselRef.current.querySelector(':scope > div');
            if (!firstCard) return;
            setCardStep(Math.round(firstCard.getBoundingClientRect().width + 16));
        };
        measureStep();
        window.addEventListener('resize', measureStep);
        return () => window.removeEventListener('resize', measureStep);
    }, [projects.length]);

    useEffect(() => {
        if (projects.length === 0 || isHovering || !cardStep) return;
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setIndex((prev) => prev + 1);
        }, 4500);
        return () => clearInterval(interval);
    }, [projects.length, isHovering, cardStep]);

    useEffect(() => {
        if (projects.length === 0 || !cardStep) return;
        if (index >= projects.length) {
            const t = setTimeout(() => { setIsTransitioning(false); setIndex(0); }, 700);
            return () => clearTimeout(t);
        }
        if (index < 0) {
            const t = setTimeout(() => { setIsTransitioning(false); setIndex(Math.max(0, projects.length - 1)); }, 700);
            return () => clearTimeout(t);
        }
    }, [index, projects.length, cardStep]);

    const carouselProjects = direction === 'right' ? [...projects].reverse() : projects;
    const displayProjects = [...carouselProjects, ...carouselProjects];
    const handleNext = () => { setIsTransitioning(true); setIndex(p => p + 1); };
    const handlePrev = () => { setIsTransitioning(true); setIndex(p => p - 1); };

    return (
        <div className="relative overflow-hidden py-4" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            {showTopControls && (
                <div className="flex justify-end px-3 mb-3 space-x-2">
                    <button type="button" onClick={handlePrev} className="rounded-full bg-white/95 border border-[#742E85] p-2.5 shadow-md text-[#742E85] hover:scale-105 transition">
                        <ChevronRight className="h-5 w-5 rotate-180" />
                    </button>
                    <button type="button" onClick={handleNext} className="rounded-full bg-white/95 border border-[#742E85] p-2.5 shadow-md text-[#742E85] hover:scale-105 transition">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}
            <div className="overflow-hidden md:px-0">
                <div
                    ref={carouselRef}
                    className={`${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''} flex md:gap-0`}
                    style={{ transform: `translateX(-${index * cardStep}px)` }}
                >
                    {displayProjects.map((project, i) => (
                        <div key={`${project._id ?? i}-${i}`} className="flex-shrink-0 w-full sm:w-[280px] md:w-[320px]">
                            <PropertyCard project={project} onTourClick={onTourClick} />
                        </div>
                    ))}
                </div>
            </div>
            {showBottomControls && (
                <div className="flex justify-end px-3 mt-3 space-x-2">
                    <button type="button" onClick={handlePrev} className="rounded-full bg-white/95 border border-[#742E85] p-2.5 shadow-md text-[#742E85] hover:scale-105 transition">
                        <ChevronRight className="h-5 w-5 rotate-180" />
                    </button>
                    <button type="button" onClick={handleNext} className="rounded-full bg-white/95 border border-[#742E85] p-2.5 shadow-md text-[#742E85] hover:scale-105 transition">
                        <ChevronRight className="h-5 w-5" />
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WebsitePage() {
    const [cards, setCards] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [hasFiltered, setHasFiltered] = useState(false);
    const { user, loading } = useAuth();
    const router = useRouter();

    const [activeTourProject, setActiveTourProject] = useState(null);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
    const [showVirtualTourModal, setShowVirtualTourModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [livingIndex, setLivingIndex] = useState(0);
    const [isLivingHovered, setIsLivingHovered] = useState(false);

    useEffect(() => {
        if (!loading && user) { router.replace("/dashboard"); return; }
        if (!loading && !user) {
            const timer = setTimeout(() => setShowAuthModal(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [user, loading, router]);

    useEffect(() => {
        fetch('/api/living-styles').then(res => res.json()).then(data => setCards(data));
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
        if (!user) {
            toast.error("Please Signup to book a tour");
            setShowAuthModal(true);
            return;
        }
        setActiveTourProject(project);
        setShowSelectionModal(true);
    };

    const handleFilteredProjects = (filtered) => {
        setFilteredProjects(filtered);
        setHasFiltered(true);
    };

    if (loading || user) return null;

    return (
        <div className="bg-white">

            {/* ① HERO — Why Choose Us Slideshow */}
            <HeroWhyChooseUs projects={projects} onFilteredProjects={handleFilteredProjects} />

            {/* ② Explore Filtered Results (shown after Apply) */}
            {hasFiltered && (
                <section className="py-8">
                    <ExploreProperties projects={filteredProjects} onTourClick={handleTourClick} />
                </section>
            )}

            {/* ③ Featured Projects */}
            <div className="mt-8">
                <div className="px-4">
                    <h2 className="text-xl md:text-[35px] font-bold text-[#742E85] mb-1.5 text-center">Featured Projects</h2>
                    <p className="text-center text-black text-xs md:text-sm max-w-3xl mx-auto mb-2 leading-relaxed">
                        Hand-picked developments with verified details and instant transparency
                    </p>
                </div>

                {projects.length > 0 && (
                    <FeaturedProjectCarousel projects={projects} direction="left" onTourClick={handleTourClick} showTopControls />
                )}
                {projects.length > 0 && (
                    <FeaturedProjectCarousel projects={projects} direction="right" onTourClick={handleTourClick} showBottomControls />
                )}

                <div className="flex justify-center m-2">
                    <Link href="/properties" className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-lg text-sm font-semibold border border-[#969393]">
                        Load More Projects
                    </Link>
                </div>

                {/* ④ Choose Your Living Style */}
                <section className="py-8 md:py-10 bg-[#F6F3F6] my-8 px-4">
                    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center">
                        <div className="text-center mb-6 md:mb-8">
                            <h2 className="text-md md:text-xl font-bold text-[#742E85] drop-shadow-md mb-1.5">Choose Your Living Style</h2>
                            <p className="text-black text-xs md:text-sm max-w-xl mx-auto font-medium opacity-80">
                                Find a home that matches your lifestyle, comfort, and aspirations.
                            </p>
                        </div>
                        <div className="w-full">
                            {/* Mobile Slider */}
                            <div
                                className="sm:hidden overflow-hidden relative"
                                onMouseEnter={() => setIsLivingHovered(true)}
                                onMouseLeave={() => setIsLivingHovered(false)}
                            >
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${livingIndex * 100}%)` }}
                                >
                                    {cards.map((card) => (
                                        <div key={card._id} className="min-w-full flex justify-center">
                                            <LivingStyleCard card={card} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Desktop Grid */}
                            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full justify-items-center">
                                {cards.map((card) => (
                                    <div key={card._id}><LivingStyleCard card={card} /></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <About showOn="homepage" />

            <h2 className="text-md md:text-xl font-bold text-[#742E85] mb-3 flex items-center justify-center">
                Google Reviews
            </h2>
            <Review />

            {/* ⑤ Builder Partners Marquee */}
            <section className="bg-white overflow-hidden my-12">
                <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
                    <h2 className="text-md md:text-xl font-bold text-[#742E85] mb-8 flex items-center justify-center">
                        Our Builder Partners
                    </h2>
                </div>
                <div className="relative overflow-hidden">
                    <div className="absolute left-0 top-0 z-10 h-full w-20" />
                    <div className="absolute right-0 top-0 z-10 h-full w-20" />
                    <div className="flex w-max animate-marquee gap-4">
                        {[
                            "/yooone.png", "/lodha.png", "/tribeca.png", "/kumarProperties.png",
                            "/goelganga.png", "/majestic.png", "/shapoorji.png", "/kraheja.png",
                            "/godrej.png", "/koltepatil.png", "/kohinoor.png", "/solitaire.png", "/nyati.png",
                            "/yooone.png", "/lodha.png", "/tribeca.png", "/kumarProperties.png",
                            "/goelganga.png", "/majestic.png", "/shapoorji.png", "/kraheja.png",
                            "/godrej.png", "/koltepatil.png", "/kohinoor.png", "/solitaire.png", "/nyati.png",
                        ].map((logo, i) => (
                            <div key={i} className="flex items-center justify-center min-w-[100px]">
                                <img src={logo} alt="Builder Partner" className="h-9 md:h-6 w-auto object-contain transition duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <WhyPiingkasha />
            <Counter />

            {/* ⑥ CTA */}
            <section className="bg-[#F6F3F6] py-12 px-6 text-center">
                <h2 className="text-sm md:text-xl font-bold text-black mb-2 flex items-center justify-center">
                    Ready to Find Your Dream Home?
                </h2>
                <p className="text-sm md:text-md text-gray-700 mb-2 flex items-center justify-center">
                    Explore verified projects in wakad with transparent pricing and expert guidance.
                </p>
                <div className="flex items-center justify-center">
                    <Link
                        href="/properties"
                        className="bg-[#742E85] text-white px-5 py-3 rounded-md text-sm md:text-base font-semibold inline-flex items-center gap-2 hover:bg-[#5e256b] transition-all duration-300"
                    >
                        Explore Projects Now
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* ⑦ Modals */}
            {user && (
                <TourSelectionModal
                    isOpen={showSelectionModal}
                    onClose={() => setShowSelectionModal(false)}
                    onSelectSiteVisit={() => { setShowSelectionModal(false); setShowSiteVisitModal(true); }}
                    onSelectVirtualTour={() => { setShowSelectionModal(false); setShowVirtualTourModal(true); }}
                />
            )}

            {showSiteVisitModal && activeTourProject && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-[420px] mx-4">
                        <BookSiteVisitModal
                            propertyId={activeTourProject._id}
                            propertyName={activeTourProject.projectName}
                            onClose={() => { setShowSiteVisitModal(false); setActiveTourProject(null); }}
                            embedded={true}
                        />
                    </div>
                </div>
            )}

            {showVirtualTourModal && activeTourProject && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-[420px] mx-4">
                        <BookVirtualTourModal
                            propertyId={activeTourProject._id}
                            propertyName={activeTourProject.projectName}
                            onClose={() => { setShowVirtualTourModal(false); setActiveTourProject(null); }}
                            embedded={true}
                        />
                    </div>
                </div>
            )}

            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onAuthSuccess={() => setShowAuthModal(false)}
                />
            )}
        </div>
    );
}