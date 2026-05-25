// "use client";
// import { useMemo, useState, useEffect, useRef } from 'react';
// import LivingStyleCard from '@/components/admin/LivingStyleCard';
// import PropertyCard from '@/components/PropertyCard';
// import Link from 'next/link';
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
// import {
//     CalendarDays,
//     TrendingDown,
//     Gift,
//     User,
//     ChevronRight, ArrowBigRight, ArrowRight
// } from "lucide-react";
// import PropertySlider from '@/components/PropertySlidder';

// export default function WebsitePage() {
//     const [cards, setCards] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [budget, setBudget] = useState(200);
//     const [selectedConfig, setSelectedConfig] = useState("");
//     const [selectedStatus, setSelectedStatus] = useState("");
//     const [selectedCity, setSelectedCity] = useState("");
//     const [selectedArea, setSelectedArea] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const { user, loading } = useAuth();


//     const router = useRouter();
//     const [index, setIndex] = useState(0);
//     const [itemsPerView, setItemsPerView] = useState(4);
//     const [isHovered, setIsHovered] = useState(false);
//     // Place these state hooks near your other state variables inside WebsitePage component:
//     const [activeTourProject, setActiveTourProject] = useState(null);
//     const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
//     const [showVirtualTourModal, setShowVirtualTourModal] = useState(false);
//     const containerRef = useRef(null);

// useEffect(() => {
//     if (!loading && user) {
//       router.replace("/dashboard");
//     }
//   }, [user, loading, router]);

//     useEffect(() => {
//         fetch('/api/living-styles')
//             .then(res => res.json())
//             .then(data => {
//                 setCards(data);

//             });
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
//     }, []);
//     const cities = [
//         ...new Set(projects.map((p) => p.address?.city).filter(Boolean)),
//     ];

//     const areas = [
//         ...new Set(projects.map((p) => p.address?.area).filter(Boolean)),
//     ];
//     const filteredProjects = useMemo(() => {
//         return projects.filter((project) => {
//             const matchesBudget =
//                 (project.pricing?.maxPrice || 0) / 100000 <= budget;

//             const matchesConfig =
//                 !selectedConfig ||
//                 project.configuration?.includes(selectedConfig);

//             const matchesStatus =
//                 !selectedStatus || project.status === selectedStatus;

//             const matchesCity =
//                 !selectedCity || project.address?.city === selectedCity;

//             const matchesArea =
//                 !selectedArea || project.address?.area === selectedArea;

//             const matchesCategory =
//                 !selectedCategory || project.tags?.includes(selectedCategory);

//             return (
//                 matchesBudget &&
//                 matchesConfig &&
//                 matchesStatus &&
//                 matchesCity &&
//                 matchesArea &&
//                 matchesCategory
//             );
//         });
//     }, [
//         projects,
//         budget,
//         selectedConfig,
//         selectedStatus,
//         selectedCity,
//         selectedArea,
//         selectedCategory,
//     ]);

//     useEffect(() => {
//         const updateItems = () => {
//             if (window.innerWidth < 640) setItemsPerView(1);
//             else if (window.innerWidth < 768) setItemsPerView(2);
//             else if (window.innerWidth < 1024) setItemsPerView(3);
//             else setItemsPerView(4);
//         };

//         updateItems();
//         window.addEventListener("resize", updateItems);
//         return () => window.removeEventListener("resize", updateItems);
//     }, []);

//     // Function to get item width class accounting for gap
//     const getItemWidth = () => {
//         if (itemsPerView === 1) return 'w-full';
//         if (itemsPerView === 2) return 'w-1/2';
//         if (itemsPerView === 3) return 'w-1/3';
//         if (itemsPerView === 4) return 'w-1/5';
//         return 'w-full';
//     };
//     const getItemWidths = () => {
//         if (itemsPerView === 1) return 'w-full';
//         if (itemsPerView === 2) return 'w-1/2';
//         if (itemsPerView === 3) return 'w-1/3';
//         if (itemsPerView === 4) return 'w-1/3';
//         return 'w-full';
//     };

//     // ✅ Auto slide with pause (like Housiey)
//     useEffect(() => {
//         if (isHovered) return;

//         const interval = setInterval(() => {
//             setIndex((prev) => {
//                 if (prev >= projects.length - itemsPerView) return 0;
//                 return prev + 1;
//             });
//         }, 3000); // pause time

//         return () => clearInterval(interval);
//     }, [projects.length, itemsPerView, isHovered]);

//     // ✅ Navigation
//     const nextSlide = () => {
//         setIndex((prev) =>
//             prev >= projects.length - itemsPerView ? 0 : prev + 1
//         );
//     };

//     const prevSlide = () => {
//         setIndex((prev) =>
//             prev <= 0 ? projects.length - itemsPerView : prev - 1
//         );
//     };
//     if (loading || user) return null;
//     return (
//         <div className='bg-white max-h-full'>
//             <section className="relative min-h-screen w-full flex flex-col items-center justify-start md:justify-center py-12 md:py-20">
//                 {/* Background Image Container */}
//                 <div className="absolute inset-0 z-0">
//                     <img
//                         src='/banner.png'
//                         alt='banner image'
//                         /* Added object-center to keep the image focused */
//                         className="w-full h-full object-cover object-center transition-transform duration-700 rounded-b-[2rem]"
//                     />
//                     {/* Slightly darker overlay for better text contrast on small screens */}
//                     <div className="absolute inset-0 " />
//                 </div>

//                 {/* Content Wrapper */}
//                 <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-12 flex flex-col items-center">

//                     {/* Header Text - Responsive alignment */}
//                     <div className="text-center mb-8 md:mb-12">
//                         <h2 className="text-3xl md:text-6xl font-extrabold text-[#742E85] drop-shadow-md mb-2">
//                             Choose Your Living Style
//                         </h2>
//                         <p className="text-black text-sm md:text-xl max-w-2xl mx-auto font-medium opacity-90">
//                             Find a home that matches your lifestyle, comfort, and aspirations.
//                         </p>
//                     </div>

//                     {/* Cards Grid - Use justify-items-center for perfect centering */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center">
//                         {cards.map((card) => (
//                             <div key={card._id} className="">
//                                 <LivingStyleCard card={card} />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             <div className='mt-36'>
//                 <div className="px-4"> {/* Wrapper to prevent text hitting screen edges on mobile */}
//                     <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-[#742E85] mb-3 text-center">
//                         Featured Projects
//                     </h2>

//                     <p className="text-center text-black text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-4 leading-relaxed">
//                         Hand-picked developments with verified details and instant transparency
//                     </p>
//                 </div>
//                 <div
//                     className="relative overflow-hidden px-0 sm:px-6 md:px-8 lg:px-2 py-12 md:py-16  mx-2 md:mx-0"
//                     onMouseEnter={() => setIsHovered(true)}
//                     onMouseLeave={() => setIsHovered(false)}
//                 >
//                     {/* Slider */}
//                     <div
//                         ref={}
//                         className="flex gap-0 md:gap-4 transition-transform duration-700 ease-in-out"
//                         style={{
//                             transform: `translateX(-${index * (100 / itemsPerView)}%)`,
//                         }}
//                     >
//                         {projects.map((project) => (
//                             <div
//                                 key={project._id}
//                                 className={`flex-shrink-0 ${getItemWidth()}`}
//                             >
//                                 <PropertyCard project={project} 
//                                 onTourClick={(p) => setActiveTourProject(p)}
//                                 />

//                             </div>
//                         ))}
//                     </div>

//                     <div className="absolute top-1 sm:top-1 md:top-1 right-2 sm:right-4 md:right-8 lg:right-12 flex gap-4  z-20">
//                         <button
//                             onClick={prevSlide}
//                             className="bg-white shadow-md rounded-full 
//              p-1.5 sm:p-2 md:p-2.5 
//              text-sm sm:text-base md:text-lg text-gray-800
//              hover:bg-gray-100 transition"
//                         >
//                             ←
//                         </button>

//                         <button
//                             onClick={nextSlide}
//                             className="bg-white shadow-md rounded-full 
//              p-1.5 sm:p-2 md:p-2.5 
//              text-sm sm:text-base md:text-lg text-gray-800
//              hover:bg-gray-100 transition"
//                         >
//                             →
//                         </button>
//                     </div>
//                 </div>
//                 <div className="flex justify-center m-8">
//                     <Link
//                         href="/properties"
//                         className="inline-flex items-center justify-center bg-[#ffffff] text-black px-6 py-3 rounded-lg text-sm font-semibold border border-[#969393] "
//                     >
//                         Load More Projects
//                     </Link>
//                 </div>
//                 <hr className='h-4 text-gray-500 mx-24 my-8' />
//                 <div className='grid grid-cols-1 lg:grid-cols-12  gap-8 mx-4 my-8'>
//                     <div className='lg:col-span-4 space-y-8 border p-4 rounded-lg shadow-md'>


//                         {/* Configuration */}
//                         <div className="border-gray-300 ">
//                             <h3 className="text-[15px] font-medium text-black mb-4">
//                                 BHK TYPE
//                             </h3>

//                             <div className="flex flex-wrap gap-2">
//                                 {[
//                                     "1BHK",
//                                     "1.5BHK",
//                                     "2BHK",
//                                     "2.5BHK",
//                                     "3BHK",
//                                     "3.5BHK",
//                                     "4BHK",
//                                     "4.5BHK",
//                                     "5BHK",
//                                 ].map((item) => (
//                                     <button
//                                         key={item}
//                                         onClick={() => setSelectedConfig(item)}
//                                         className={`px-4 py-2 rounded-md border text-[14px] font-medium transition ${selectedConfig === item
//                                             ? "bg-[#E61E8C] text-white border-[#E61E8C]"
//                                             : "bg-white text-black border-gray-300"
//                                             }`}
//                                     >
//                                         {item}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                         <h3 className="text-[15px] font-medium uppercase text-black mb-4">
//                             Location
//                         </h3>
//                         <select
//                             value={selectedCity}
//                             onChange={(e) => {
//                                 setSelectedCity(e.target.value);
//                                 setSelectedArea("");
//                             }}
//                             className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] text-black outline-none"
//                         >
//                             <option value="">City</option>
//                             {cities.map((city) => (
//                                 <option key={city} value={city}>
//                                     {city}
//                                 </option>
//                             ))}
//                         </select>
//                         <select
//                             value={selectedArea}
//                             onChange={(e) => setSelectedArea(e.target.value)}
//                             className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] text-black outline-none"
//                         >
//                             <option value="">Area</option>
//                             {areas.map((area) => (
//                                 <option key={area} value={area}>
//                                     {area}
//                                 </option>
//                             ))}
//                         </select>
//                         <div >
//                             <h3 className="text-[15px] font-medium text-black mb-4">
//                                 Budget (₹ Lakhs)
//                             </h3>

//                             <input
//                                 type="range"
//                                 min="0"
//                                 max="200"
//                                 value={budget}
//                                 onChange={(e) => setBudget(Number(e.target.value))}
//                                 className="w-full accent-[#742E85]"
//                             />

//                             <div className="mt-3 text-[15px] text-black font-medium">
//                                 ₹0L - ₹{budget}L
//                             </div>
//                         </div>
//                         {/* Status */}
//                         <div className=" border-gray-300 ">
//                             <h3 className="text-[15px] font-medium text-black mb-4">Status</h3>

//                             <div className="flex flex-wrap gap-3">
//                                 {["Ready", "Under Construction", "Late Possession"].map(
//                                     (item) => (
//                                         <button
//                                             key={item}
//                                             onClick={() => setSelectedStatus(item)}
//                                             className={`px-5 py-3 rounded-md border text-[14px] font-medium transition ${selectedStatus === item
//                                                 ? "bg-[#742E85] text-white border-[#742E85]"
//                                                 : "bg-white text-black border-gray-300"
//                                                 }`}
//                                         >
//                                             {item}
//                                         </button>
//                                     )
//                                 )}
//                             </div>
//                         </div>

//                         {/* Location */}
//                         <div>


//                             <div className="space-y-3">

//                                 <div className="flex-1 flex flex-col sm:flex-row gap-2">
//                                     <button
//                                         className="flex-1 bg-[#742E85] text-white rounded-md text-[14px] font-medium py-3 hover:bg-[#5f256d] transition"
//                                     >
//                                         Apply
//                                     </button>

//                                     <button
//                                         onClick={() => {
//                                             setBudget(200);
//                                             setSelectedConfig("");
//                                             setSelectedStatus("");
//                                             setSelectedCity("");
//                                             setSelectedArea("");
//                                         }}
//                                         className="flex-1 border border-gray-300 rounded-md text-[14px] text-black py-3 hover:bg-gray-100 transition"
//                                     >
//                                         Reset
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                     <div
//                         className="lg:col-span-8 relative overflow-hidden pt-16"
//                         onMouseEnter={() => setIsHovered(true)}
//                         onMouseLeave={() => setIsHovered(false)}
//                     >
//                         <div
//                             className="flex gap-0 md:gap-4 transition-transform duration-700 ease-in-out"
//                             style={{
//                                 transform: `translateX(-${index * (100 / itemsPerView)}%)`,
//                             }}
//                         >
//                             {[...filteredProjects, ...filteredProjects].map((project, i) => (
//                                 <div
//                                     key={i}
//                                     className={`flex-shrink-0 ${getItemWidths()}`}
//                                 >

//                                     <PropertyCard project={project} 
//                                     onTourClick={(p) => setActiveTourProject(p)}
//                                     />

//                                 </div>
//                             ))}
//                         </div>
//                         <div className="absolute top-1 sm:top-1 md:top-1 right-2 sm:right-4 md:right-8 lg:right-12 flex gap-4  z-20">
//                             <button
//                                 onClick={prevSlide}
//                                 className="bg-white shadow-md rounded-full 
//              p-1.5 sm:p-2 md:p-2.5 
//              text-sm sm:text-base md:text-lg text-gray-800
//              hover:bg-gray-100 transition"
//                             >
//                                 ←
//                             </button>

//                             <button
//                                 onClick={nextSlide}
//                                 className="bg-white shadow-md rounded-full 
//              p-1.5 sm:p-2 md:p-2.5 
//              text-sm sm:text-base md:text-lg text-gray-800
//              hover:bg-gray-100 transition"
//                             >
//                                 →
//                             </button>
//                         </div>
//                     </div>

//                 </div>
//                 <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-[#742E85] mb-3 text-center">
//                     Explore Propertis on Map
//                 </h2>
//                 <section className="max-w-7xl mx-auto px-8 py-4">


//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.5 }}
//                         className="w-full h-[424px] overflow-hidden shadow-lg border border-gray-400"
//                     >
//                         <iframe
//                             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.123456789!2d73.912345!3d18.456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI3JzI0LjQiTiA3M8KwNTQnNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123"
//                             width="100%"
//                             height="100%"
//                             style={{ border: 0 }}
//                             allowFullScreen=""
//                             loading="lazy"
//                             referrerPolicy="no-referrer-when-downgrade"
//                             title="Piinggaksha Office Location"
//                         />
//                     </motion.div>
//                 </section>
//             </div>
//             <WhyChooseUs />
//             <About showOn="homepage" />
//             <h2 className="text-4xl md:text-6xl  font-semibold text-[#742E85] mb-3 flex items-center justify-center">
//                 Google Reviews
//             </h2>
//             <Review />
//             <section className=" bg-white overflow-hidden mb-12">
//                 <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
//                     <h2 className="text-4xl md:text-6xl  font-semibold text-[#742E85] mb-3 flex items-center justify-center">
//                         Our Builder Partners
//                     </h2>

//                 </div>

//                 <div className="relative overflow-hidden">
//                     {/* Fade effect left */}
//                     <div className="absolute left-0 top-0 z-10 h-full w-20 " />

//                     {/* Fade effect right */}
//                     <div className="absolute right-0 top-0 z-10 h-full w-20 " />

//                     <div className="flex w-max animate-marquee gap-16">
//                         {[
//                             "/yooone.png",
//                             "/lodha.png",
//                             "/tribeca.png",
//                             "/kumarProperties.png",
//                             "/goelganga.png",
//                             "/majestic.png",
//                             "/shapoorji.png",
//                             "/kraheja.png",
//                             "/godrej.png",
//                             "/koltepatil.png",
//                             "/kohinoor.png",
//                             "/solitaire.png",
//                             "/nyati.png"
//                         ]
//                             .concat([
//                                 "/yooone.png",
//                                 "/lodha.png",
//                                 "/tribeca.png",
//                                 "/kumarProperties.png",
//                                 "/goelganga.png",
//                                 "/majestic.png",
//                                 "/shapoorji.png",
//                                 "/kraheja.png",
//                                 "/godrej.png",
//                                 "/koltepatil.png",
//                                 "/kohinoor.png",
//                                 "/solitaire.png",
//                                 "/nyati.png"
//                             ])
//                             .map((logo, index) => (
//                                 <div
//                                     key={index}
//                                     className="flex items-center justify-center min-w-[180px]"
//                                 >
//                                     <img
//                                         src={logo}
//                                         alt="Builder Partner"
//                                         className="h-16 md:h-20 w-auto object-contain  transition duration-300"
//                                     />
//                                 </div>
//                             ))}
//                     </div>
//                 </div>
//             </section>
//             <WhyPiingkasha />
//             <Counter />
//             <section className='bg-[#F6F3F6] p-12'>
//                 <h2 className="text-4xl md:text-5xl  font-semibold text-black mb-3 flex items-center justify-center">
//                     Ready to Find Your Dream Home?
//                 </h2>
//                 <p className='text-xl md:text-2xl  text-black mb-3 flex items-center justify-center'>Explore verified projects in wakad with transparent pricing and expert guidence.</p>
//                 <div className="flex items-center justify-center">
//                     <Link
//                         href="/properties"
//                         className="bg-[#742E85] text-white px-6 py-4 rounded-md text-lg font-medium inline-flex items-center gap-2 hover:bg-[#5e256b] transition-all duration-300"
//                     >
//                         Explore Projects Now
//                         <ArrowRight size={20} />
//                     </Link>
//                 </div>
//             </section>
//             {/* ================= GLOBAL MODAL ENGINE LAYER (Safe from Transforms) ================= */}
//           <TourSelectionModal
//                 isOpen={Boolean(activeTourProject)}
//                 onClose={() => setActiveTourProject(null)}
//                 onSelectSiteVisit={() => setShowSiteVisitModal(true)}
//                 onSelectVirtualTour={() => setShowVirtualTourModal(true)}
//             />

//             {/* Site Visit Modal */}
//             {showSiteVisitModal && activeTourProject && (
//                 <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 w-screen h-screen top-0 left-0">
//                     <div className="w-full max-w-[420px] mx-4 relative z-[100000]">
//                         <BookSiteVisitModal
//                             propertyId={activeTourProject._id}
//                             propertyName={activeTourProject.projectName}
//                             onClose={() => {
//                                 setShowSiteVisitModal(false);
//                                 setActiveTourProject(null);
//                             }}
//                             embedded={true}
//                         />
//                     </div>
//                 </div>
//             )}

//             {/* Virtual Tour Modal */}
//             {showVirtualTourModal && activeTourProject && (
//                 <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 w-screen h-screen top-0 left-0">
//                     <div className="w-full max-w-[420px] mx-4 relative z-[100000]">
//                         <BookVirtualTourModal
//                             propertyId={activeTourProject._id}
//                             propertyName={activeTourProject.projectName}
//                             onClose={() => {
//                                 setShowVirtualTourModal(false);
//                                 setActiveTourProject(null);
//                             }}
//                             embedded={true}
//                         />
//                     </div>
//                 </div>
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
import { motion } from "framer-motion";
import WhyChooseUs from '@/components/WhyChoose';
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
import {
    CalendarDays,
    TrendingDown,
    Gift,
    User,
    ChevronRight, ArrowBigRight, ArrowRight
} from "lucide-react";
import PropertySlider from '@/components/PropertySlidder';

export default function WebsitePage() {
    const [cards, setCards] = useState([]);
    const [projects, setProjects] = useState([]);
    const [budget, setBudget] = useState(3000);
    const [selectedConfig, setSelectedConfig] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCity, setSelectedCity] = useState("Pune");
    const [selectedCategory, setSelectedCategory] = useState("");
    const { user, loading } = useAuth();

    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [isHovered, setIsHovered] = useState(false);

    // Modal Control Layer State
    const [activeTourProject, setActiveTourProject] = useState(null);
    const [showSelectionModal, setShowSelectionModal] = useState(false); // New state to separate selection display from project state
    const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
    const [showVirtualTourModal, setShowVirtualTourModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const containerRef = useRef(null);
    useEffect(() => {

        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [user, loading, router]);
    useEffect(() => {
        fetch('/api/living-styles')
            .then(res => res.json())
            .then(data => setCards(data));
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

    const cities = useMemo(() => [
        ...new Set(projects.map((p) => p.address?.city).filter(Boolean)),
    ], [projects]);



    const extractMinPriceInLakhs = (priceStr) => {
        if (!priceStr) return 0;
        const regex = /([\d\.]+)\s*(cr|lakhs|lakh|l|k)?/gi;
        let match;
        let minLakhs = Infinity;
        while ((match = regex.exec(priceStr)) !== null) {
            let val = parseFloat(match[1]);
            let unit = match[2] ? match[2].toLowerCase() : '';
            if (unit.startsWith('cr')) val *= 100;
            else if (unit === 'k') val /= 100;
            else if (!unit && val > 1000) val /= 100000;

            if (val > 0 && val < minLakhs) minLakhs = val;
        }
        return minLakhs === Infinity ? 0 : minLakhs;
    };

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const projectPriceInLakhs = project.pricing?.displayPrice
                ? extractMinPriceInLakhs(project.pricing.displayPrice)
                : 0;

            const matchesBudget = projectPriceInLakhs <= budget;
            const matchesConfig = !selectedConfig || project.configuration?.includes(selectedConfig);
            const matchesStatus = !selectedStatus || project.status === selectedStatus;
            const matchesCity = !selectedCity || project.address?.city === selectedCity;
            const matchesCategory = !selectedCategory || project.tags?.includes(selectedCategory);

            return matchesBudget && matchesConfig && matchesStatus && matchesCity && matchesCategory;
        });
    }, [projects, budget, selectedConfig, selectedStatus, selectedCity, selectedCategory]);

    useEffect(() => {
        const updateItems = () => {
            if (window.innerWidth < 640) setItemsPerView(1);
            else if (window.innerWidth < 768) setItemsPerView(2);
            else if (window.innerWidth < 1024) setItemsPerView(3);
            else setItemsPerView(4);
        };
        updateItems();
        window.addEventListener("resize", updateItems);
        return () => window.removeEventListener("resize", updateItems);
    }, []);

    const getItemWidth = () => {
        if (itemsPerView === 1) return 'w-full';
        if (itemsPerView === 2) return 'w-1/2';
        if (itemsPerView === 3) return 'w-1/3';
        if (itemsPerView === 4) return 'w-1/5';
        return 'w-full';
    };

    const getItemWidths = () => {
        if (itemsPerView === 1) return 'w-full';
        if (itemsPerView === 2) return 'w-1/2';
        if (itemsPerView === 3) return 'w-1/3';
        if (itemsPerView === 4) return 'w-1/3';
        return 'w-full';
    };

    useEffect(() => {
        if (isHovered || projects.length === 0) return;
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setIndex((prev) => prev + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, [projects.length, isHovered]);

    useEffect(() => {
        if (index >= projects.length && projects.length > 0) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setIndex(0);
            }, 700);
            return () => clearTimeout(timeout);
        }
    }, [index, projects.length]);

    const nextSlide = () => {
        setIsTransitioning(true);
        setIndex((prev) => prev + 1);
    };

    const prevSlide = () => {
        setIsTransitioning(true);
        setIndex((prev) => prev <= 0 ? projects.length - 1 : prev - 1);
    };

    // Helper handler when a user clicks the "Tour" button on any Property Card
    const handleTourClick = (project) => {
        if (!user) {
            toast.error("Please Signup to book a tour");
            setShowAuthModal(true); // Automatically opens your login modal layout if guest
            return;
        }
        setActiveTourProject(project);
        setShowSelectionModal(true);
    };
    const [livingIndex, setLivingIndex] = useState(0);
    const [isLivingHovered, setIsLivingHovered] = useState(false);
    useEffect(() => {
        if (isLivingHovered || cards.length <= 1) return;

        const interval = setInterval(() => {
            setLivingIndex((prev) => (prev + 1) % cards.length);
        }, 2500); // pause time

        return () => clearInterval(interval);
    }, [cards.length, isLivingHovered]);

    if (loading || user) return null;

    return (
        <div className='bg-white max-h-full'>
            {/* Banner Section */}
            <section className="relative min-h-screen w-full flex flex-col items-center justify-start md:justify-center py-12 md:py-20">
                <div className="absolute inset-0 z-0">
                    <img src='/banner.png' alt='banner image' className="w-full h-full object-cover object-center rounded-b-[2rem]" />
                    <div className="absolute inset-0 " />
                </div>
                <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-12 flex flex-col items-center">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-6xl font-extrabold text-[#742E85] drop-shadow-md mb-2">Choose Your Living Style</h2>
                        <p className="text-black text-sm md:text-xl max-w-2xl mx-auto font-medium opacity-90">Find a home that matches your lifestyle, comfort, and aspirations.</p>
                    </div>
                    <div className="w-full">

                        {/*Mobile Slider */}
                        <div
                            className="sm:hidden overflow-hidden relative "
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
                        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center">
                            {cards.map((card) => (
                                <div key={card._id}>
                                    <LivingStyleCard card={card} />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <div className='mt-12'>
                <div className="px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-[#742E85] mb-3 text-center">Featured Projects</h2>
                    <p className="text-center text-black text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-4 leading-relaxed">Hand-picked developments with verified details and instant transparency</p>
                </div>
                <div className="relative overflow-hidden px-0 sm:px-6 md:px-8 lg:px-2 py-12 md:py-16 mx-2 md:mx-0" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <div ref={containerRef} className={`flex gap-0 md:gap-2 ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`} style={{ transform: `translateX(-${index * (100 / itemsPerView)}%)` }}>
                        {[...projects, ...projects].map((project, i) => (
                            <div key={i} className={`flex-shrink-0 ${getItemWidth()}`}>
                                <PropertyCard project={project} onTourClick={handleTourClick} />
                            </div>
                        ))}
                    </div>
                    <div className="absolute top-1 right-2 sm:right-4 md:right-8 lg:right-12 flex gap-4 z-20">
                        <button onClick={prevSlide} className="bg-white shadow-md rounded-full p-1.5 sm:p-2 md:p-2.5 text-sm sm:text-base md:text-lg text-gray-800 hover:bg-gray-100 transition">←</button>
                        <button onClick={nextSlide} className="bg-white shadow-md rounded-full p-1.5 sm:p-2 md:p-2.5 text-sm sm:text-base md:text-lg text-gray-800 hover:bg-gray-100 transition">→</button>
                    </div>
                </div>

                <div className="flex justify-center m-8">
                    <Link href="/properties" className="inline-flex items-center justify-center bg-[#ffffff] text-black px-6 py-3 rounded-lg text-sm font-semibold border border-[#969393]">Load More Projects</Link>
                </div>

                <hr className='h-4 text-gray-500 mx-2 my-2' />

                {/* Search Filters & Layout List */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-2 mx-2 my-2'>
                    <div className='lg:col-span-4 space-y-8 border p-4 rounded-lg shadow-md'>
                        <div className="border-gray-300">
                            <h3 className="text-[15px] font-medium text-black mb-4">BHK TYPE</h3>
                            <div className="flex flex-wrap gap-2">
                                {["1BHK", "1.5BHK", "2BHK", "2.5BHK", "3BHK", "3.5BHK", "4BHK", "4.5BHK", "5BHK"].map((item) => (
                                    <button key={item} onClick={() => setSelectedConfig(item)} className={`px-4 py-2 rounded-md border text-[14px] font-medium transition ${selectedConfig === item ? "bg-[#E61E8C] text-white border-[#E61E8C]" : "bg-white text-black border-gray-300"}`}>{item}</button>
                                ))}
                            </div>
                        </div>
                        <h3 className="text-[15px] font-medium uppercase text-black mb-4">Location</h3>
                        <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); }} className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] text-black outline-none">
                            <option value="">City</option>
                            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                        </select>
                        <div>
                            <h3 className="text-[15px] font-medium text-black mb-4">Budget</h3>
                            <input type="range" min="0" max="3000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-[#742E85]" />
                            <div className="mt-3 text-[15px] text-black font-medium">₹0 - {budget >= 100 ? `₹${(budget / 100).toFixed(2)} Cr` : `₹${budget} L`}</div>
                        </div>
                        <div className="border-gray-300">
                            <h3 className="text-[15px] font-medium text-black mb-4">Status</h3>
                            <div className="flex flex-wrap gap-3">
                                {["Ready", "Under Construction", "Late Possession"].map((item) => (
                                    <button key={item} onClick={() => setSelectedStatus(item)} className={`px-5 py-3 rounded-md border text-[14px] font-medium transition ${selectedStatus === item ? "bg-[#742E85] text-white border-[#742E85]" : "bg-white text-black border-gray-300"}`}>{item}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="space-y-3">
                                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                                    <button className="flex-1 bg-[#742E85] text-white rounded-md text-[14px] font-medium py-3 hover:bg-[#5f256d] transition">Apply</button>
                                    <button onClick={() => { setBudget(3000); setSelectedConfig(""); setSelectedStatus(""); setSelectedCity("Pune"); }} className="flex-1 border border-gray-300 rounded-md text-[14px] text-black py-3 hover:bg-gray-100 transition">Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtered Track Results Row */}
                    <div className="lg:col-span-8 relative overflow-hidden pt-16" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        <div className={`flex gap-0 md:gap-4 ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`} style={{ transform: `translateX(-${index * (100 / itemsPerView)}%)` }}>
                            {[...filteredProjects, ...filteredProjects].map((project, i) => (
                                <div key={i} className={`flex-shrink-0 ${getItemWidths()}`}>
                                    <PropertyCard project={project} onTourClick={handleTourClick} />
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-1 right-2 sm:right-4 md:right-8 lg:right-12 flex gap-4 z-20">
                            <button onClick={prevSlide} className="bg-white shadow-md rounded-full p-1.5 sm:p-2 md:p-2.5 text-sm sm:text-base md:text-lg text-gray-800 hover:bg-gray-100 transition">←</button>
                            <button onClick={nextSlide} className="bg-white shadow-md rounded-full p-1.5 sm:p-2 md:p-2.5 text-sm sm:text-base md:text-lg text-gray-800 hover:bg-gray-100 transition">→</button>
                        </div>
                    </div>
                </div>

                {/* Map Integration wrapper layout block */}
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-[#742E85] my-8 text-center">Explore Properties on Map</h2>
                <section className="max-w-8xl mx-auto px-4 py-4">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full h-[424px] overflow-hidden shadow-lg border border-gray-400">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.513447079499!2d73.91246457334937!3d18.460387771013473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eb291d95088b%3A0xbfae7509b6f71b86!2sPIINGGAKSHA!5e0!3m2!1sen!2sin!4v1778153416410!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </motion.div>
                </section>
            </div>

            <WhyChooseUs />
            <About showOn="homepage" />
            <h2 className="text-4xl md:text-6xl font-semibold text-[#742E85] mb-3 flex items-center justify-center">Google Reviews</h2>
            <Review />

            {/* Builder Partners Marquee Section */}
            <section className="bg-white overflow-hidden mb-12">
                <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-semibold text-[#742E85] mb-3 flex items-center justify-center">Our Builder Partners</h2>
                </div>
                <div className="relative overflow-hidden">
                    <div className="absolute left-0 top-0 z-10 h-full w-20 " />
                    <div className="absolute right-0 top-0 z-10 h-full w-20 " />
                    <div className="flex w-max animate-marquee gap-16">
                        {["/yooone.png", "/lodha.png", "/tribeca.png", "/kumarProperties.png", "/goelganga.png", "/majestic.png", "/shapoorji.png", "/kraheja.png", "/godrej.png", "/koltepatil.png", "/kohinoor.png", "/solitaire.png", "/nyati.png"]
                            .concat(["/yooone.png", "/lodha.png", "/tribeca.png", "/kumarProperties.png", "/goelganga.png", "/majestic.png", "/shapoorji.png", "/kraheja.png", "/godrej.png", "/koltepatil.png", "/kohinoor.png", "/solitaire.png", "/nyati.png"])
                            .map((logo, index) => (
                                <div key={index} className="flex items-center justify-center min-w-[180px]">
                                    <img src={logo} alt="Builder Partner" className="h-16 md:h-20 w-auto object-contain transition duration-300" />
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            <WhyPiingkasha />
            <Counter />

            {/* CTA Layer Block */}
            <section className='bg-[#F6F3F6] p-12'>
                <h2 className="text-4xl md:text-5xl font-semibold text-black mb-3 flex items-center justify-center">Ready to Find Your Dream Home?</h2>
                <p className='text-xl md:text-2xl text-black mb-3 flex items-center justify-center'>Explore verified projects in wakad with transparent pricing and expert guidance.</p>
                <div className="flex items-center justify-center">
                    <Link href="/properties" className="bg-[#742E85] text-white px-6 py-4 rounded-md text-lg font-medium inline-flex items-center gap-2 hover:bg-[#5e256b] transition-all duration-300">
                        Explore Projects Now
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* ================= GLOBAL MODAL ENGINE LAYER ================= */}

            {/* 1. Type Selection Screen Panel */}
            {user && <TourSelectionModal
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
            />}


            {/* 2. Site Visit Form Screen Panel */}
            {showSiteVisitModal && activeTourProject && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 w-screen h-screen top-0 left-0">
                    <div className="w-full max-w-[420px] mx-4 relative z-[100000]">
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
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 w-screen h-screen top-0 left-0">
                    <div className="w-full max-w-[420px] mx-4 relative z-[100000]">
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
    )
}