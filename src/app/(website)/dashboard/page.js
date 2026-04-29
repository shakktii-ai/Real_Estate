"use client";
import { useMemo, useState, useEffect } from 'react';
import LivingStyleCard from '@/components/admin/LivingStyleCard';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import { motion } from "framer-motion";
import WhyChooseUs from '@/components/WhyChoose';
import About from '@/components/about';
import Review from '@/components/Review';
import WhyPiingkasha from '@/components/WhyPiingkasha';
import Counter from '@/components/Counter';
import { useAuth } from '@/lib/context/AuthContext';
import {
    CalendarDays,
    TrendingDown,
    Gift,
    User,
    ChevronRight, ArrowBigRight, ArrowRight
} from "lucide-react";

export default function WebsitePage() {
    const [cards, setCards] = useState([]);
    const [projects, setProjects] = useState([]);
    const [budget, setBudget] = useState(200);
    const [selectedConfig, setSelectedConfig] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const { user, loading } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [priceDropCount, setPriceDropCount] = useState(0);
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

                // CHANGE THIS: 
                // Instead of mapping the whole object, map just the ID.
                // Since you populated, item.propertyId is an object, so we access ._id
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
    const cities = [
        ...new Set(projects.map((p) => p.address?.city).filter(Boolean)),
    ];

    const areas = [
        ...new Set(projects.map((p) => p.address?.area).filter(Boolean)),
    ];
    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesBudget =
                (project.pricing?.maxPrice || 0) / 100000 <= budget;

            const matchesConfig =
                !selectedConfig ||
                project.configuration?.includes(selectedConfig);

            const matchesStatus =
                !selectedStatus || project.status === selectedStatus;

            const matchesCity =
                !selectedCity || project.address?.city === selectedCity;

            const matchesArea =
                !selectedArea || project.address?.area === selectedArea;

            const matchesCategory =
                !selectedCategory || project.tags?.includes(selectedCategory);

            return (
                matchesBudget &&
                matchesConfig &&
                matchesStatus &&
                matchesCity &&
                matchesArea &&
                matchesCategory
            );
        });
    }, [
        projects,
        budget,
        selectedConfig,
        selectedStatus,
        selectedCity,
        selectedArea,
        selectedCategory,
    ]);
    if (loading) return null;
    return (
        <div className='bg-white max-h-full'>
    <section className="relative min-h-screen w-full flex flex-col items-center justify-start md:justify-center py-12 md:py-20">
    {/* Background Image Container */}
    <div className="absolute inset-0 z-0">
        <img
            src='/banner.png'
            alt='banner image'
            /* Added object-center to keep the image focused */
            className="w-full h-full object-cover object-center transition-transform duration-700 rounded-b-[2rem]"
        />
        {/* Slightly darker overlay for better text contrast on small screens */}
        <div className="absolute inset-0 " />
    </div>

    {/* Content Wrapper */}
    <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-12 flex flex-col items-center">
        
        {/* Header Text - Responsive alignment */}
        <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-6xl font-extrabold text-[#742E85] drop-shadow-md mb-2">
                Choose Your Living Style
            </h2>
            <p className="text-black text-sm md:text-xl max-w-2xl mx-auto font-medium opacity-90">
                   Find a home that matches your lifestyle, comfort, and aspirations.
            </p>
        </div>

        {/* Cards Grid - Use justify-items-center for perfect centering */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center">
            {cards.map((card) => (
                <div key={card._id} className="">
                     <LivingStyleCard card={card} />
                </div>
            ))}
        </div>
    </div>
</section>
             <section className='mt-[8rem] mx-4'>
            {user && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
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

                    <Link
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
                    </Link>

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
            <div className='mt-12'>
               <div className="px-4"> {/* Wrapper to prevent text hitting screen edges on mobile */}
    <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-[#742E85] mb-3 text-center">
        Featured Projects
    </h2>
    
    <p className="text-center text-black text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-4 leading-relaxed">
        Hand-picked developments with verified details and instant transparency
    </p>
</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-8">
                    {projects
                        .slice(0, 6)
                        .map((project) => (
                            <PropertyCard key={project._id} project={project} isWishlisted={wishlist.includes(project._id)} onToggleWishlist={handleToggleWishlist}/>

                        ))}
                </div>
                <div className="flex justify-center m-8">
                    <Link
                        href="/properties"
                        className="inline-flex items-center justify-center bg-[#ffffff] text-black px-6 py-3 rounded-lg text-sm font-semibold border border-[#969393] "
                    >
                        Load More Projects
                    </Link>
                </div>
                <hr className='h-4 text-gray-500 mx-24 my-8' />
                <div className='grid grid-cols-1 lg:grid-cols-12  gap-8 mx-4 my-8'>
                    <div className='lg:col-span-4 space-y-8 border p-4 rounded-lg shadow-md'>


                        {/* Configuration */}
                        <div className="border-gray-300 ">
                            <h3 className="text-[15px] font-medium text-black mb-4">
                                BHK TYPE
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    "1BHK",
                                    "1.5BHK",
                                    "2BHK",
                                    "2.5BHK",
                                    "3BHK",
                                    "3.5BHK",
                                    "4BHK",
                                    "4.5BHK",
                                    "5BHK",
                                ].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setSelectedConfig(item)}
                                        className={`px-4 py-2 rounded-md border text-[14px] font-medium transition ${selectedConfig === item
                                            ? "bg-[#E61E8C] text-white border-[#E61E8C]"
                                            : "bg-white text-black border-gray-300"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <h3 className="text-[15px] font-medium uppercase text-black mb-4">
                            Location
                        </h3>
                        <select
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedCity(e.target.value);
                                setSelectedArea("");
                            }}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] text-black outline-none"
                        >
                            <option value="">City</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] text-black outline-none"
                        >
                            <option value="">Area</option>
                            {areas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                        <div >
                            <h3 className="text-[15px] font-medium text-black mb-4">
                                Budget (₹ Lakhs)
                            </h3>

                            <input
                                type="range"
                                min="0"
                                max="200"
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                                className="w-full accent-[#742E85]"
                            />

                            <div className="mt-3 text-[15px] text-black font-medium">
                                ₹0L - ₹{budget}L
                            </div>
                        </div>
                        {/* Status */}
                        <div className=" border-gray-300 ">
                            <h3 className="text-[15px] font-medium text-black mb-4">Status</h3>

                            <div className="flex flex-wrap gap-3">
                                {["Ready", "Under Construction", "Late Possession"].map(
                                    (item) => (
                                        <button
                                            key={item}
                                            onClick={() => setSelectedStatus(item)}
                                            className={`px-5 py-3 rounded-md border text-[14px] font-medium transition ${selectedStatus === item
                                                ? "bg-[#742E85] text-white border-[#742E85]"
                                                : "bg-white text-black border-gray-300"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div>


                            <div className="space-y-3">

                                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                                    <button
                                        className="flex-1 bg-[#742E85] text-white rounded-md text-[14px] font-medium py-3 hover:bg-[#5f256d] transition"
                                    >
                                        Apply
                                    </button>

                                    <button
                                        onClick={() => {
                                            setBudget(200);
                                            setSelectedConfig("");
                                            setSelectedStatus("");
                                            setSelectedCity("");
                                            setSelectedArea("");
                                        }}
                                        className="flex-1 border border-gray-300 rounded-md text-[14px] text-black py-3 hover:bg-gray-100 transition"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredProjects.map((project) => (
                                <PropertyCard key={project._id} project={project} isWishlisted={wishlist.includes(project._id)} onToggleWishlist={handleToggleWishlist} />

                            ))}
                        </div>
                    </div>

                </div>
                <h2 className="text-4xl md:text-6xl  font-semibold text-[#742E85] my-12 flex items-center justify-center">
                    Explore Propertis on Map
                </h2>
                <section className="max-w-7xl mx-auto px-8 py-4">


                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="w-full h-[424px] overflow-hidden shadow-lg border border-gray-400"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.123456789!2d73.912345!3d18.456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI3JzI0LjQiTiA3M8KwNTQnNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Piinggaksha Office Location"
                        />
                    </motion.div>
                </section>
            </div>
            <WhyChooseUs />
            <About />
            <h2 className="text-4xl md:text-6xl  font-semibold text-[#742E85] mb-3 flex items-center justify-center">
                Google Reviews
            </h2>
            <Review />
            <section className=" bg-white overflow-hidden mb-12">
                <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                    <h2 className="text-4xl md:text-6xl  font-semibold text-[#742E85] mb-3 flex items-center justify-center">
                        Our Builder Partners
                    </h2>

                </div>

                <div className="relative overflow-hidden">
                    {/* Fade effect left */}
                    <div className="absolute left-0 top-0 z-10 h-full w-20 " />

                    {/* Fade effect right */}
                    <div className="absolute right-0 top-0 z-10 h-full w-20 " />

                    <div className="flex w-max animate-marquee gap-16">
                        {[
                            "/yooone.png",
                            "/lodha.png",
                            "/tribeca.png",
                            "/kumarProperties.png",
                            "/goelganga.png",
                            "/majestic.png",
                            "/shapoorji.png",
                            "/kraheja.png",
                            "/godrej.png",
                            "/koltepatil.png",
                            "/kohinoor.png",
                            "/solitaire.png",
                            "/nyati.png"
                        ]
                            .concat([
                                "/yooone.png",
                                "/lodha.png",
                                "/tribeca.png",
                                "/kumarProperties.png",
                                "/goelganga.png",
                                "/majestic.png",
                                "/shapoorji.png",
                                "/kraheja.png",
                                "/godrej.png",
                                "/koltepatil.png",
                                "/kohinoor.png",
                                "/solitaire.png",
                                "/nyati.png"
                            ])
                            .map((logo, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-center min-w-[180px]"
                                >
                                    <img
                                        src={logo}
                                        alt="Builder Partner"
                                        className="h-16 md:h-20 w-auto object-contain  transition duration-300"
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </section>
            <WhyPiingkasha />
            <Counter />
            <section className='bg-[#F6F3F6] p-12'>
                <h2 className="text-4xl md:text-5xl  font-semibold text-black mb-3 flex items-center justify-center">
                    Ready to Find Your Dream Home?
                </h2>
                <p className='text-xl md:text-2xl  text-black mb-3 flex items-center justify-center'>Explore verified projects in wakad with transparent pricing and expert guidence.</p>
                <div className="flex items-center justify-center">
                    <Link
                        href="/properties"
                        className="bg-[#742E85] text-white px-6 py-4 rounded-md text-lg font-medium inline-flex items-center gap-2 hover:bg-[#5e256b] transition-all duration-300"
                    >
                        Explore Projects Now
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    )
}