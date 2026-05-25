"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Grid2X2, List, Map } from "lucide-react";
import PropertyCardHori from "@/components/PropertyCardHori";
import { useAuth } from "@/lib/context/AuthContext";
import TourSelectionModal from '@/components/TourSelectionModal';
import BookSiteVisitModal from '@/components/BookSiteVisitModal';
import BookVirtualTourModal from '@/components/BookVirtualTourModal';
import MapModal from "@/components/map";
function PropertiesContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const builderParam = searchParams.get("builder");
    const locationParam = searchParams.get("location");
    const queryParam = searchParams.get("q");
    const [budget, setBudget] = useState(3000);
    const [selectedConfig, setSelectedConfig] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCity, setSelectedCity] = useState(locationParam || builderParam || queryParam ? "" : "Pune");
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
    const [projects, setProjects] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const { user } = useAuth(); // Access current user
    const [wishlist, setWishlist] = useState([]);
    const [activeTourProject, setActiveTourProject] = useState(null);
    const [showSelectionModal, setShowSelectionModal] = useState(false); // New state to separate selection display from project state
    const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
    const [showVirtualTourModal, setShowVirtualTourModal] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);

    const officeDetails = {
        name: "PIINGGAKSHA Team Office",
        address: "ILESEUM CO-WORKING Space, GANGA GLITZ, Kad Nagar, Undri, Pune, Maharashtra 411060"
    };
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
        // If the user manually changes the URL, update state
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
        if (locationParam || builderParam || queryParam) {
            setSelectedCity("");
        }
    }, [categoryParam, locationParam, builderParam, queryParam]);

    const cities = [
        ...new Set(projects.map((p) => p.address?.city).filter(Boolean)),
    ];


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

            const matchesConfig =
                !selectedConfig ||
                project.configuration?.includes(selectedConfig);

            const matchesStatus =
                !selectedStatus || project.status === selectedStatus;

            const matchesCity =
                !selectedCity || project.address?.city === selectedCity;

            const matchesCategory =
                !selectedCategory || project.tags?.includes(selectedCategory);

            const qLower = queryParam?.toLowerCase();
            const matchesQuery = !queryParam || (
                project.projectName?.toLowerCase().includes(qLower) ||
                project.builderName?.toLowerCase().includes(qLower) ||
                project.address?.city?.toLowerCase().includes(qLower) ||
                project.address?.area?.toLowerCase().includes(qLower)
            );

            const matchesBuilder = !builderParam || project.builderName?.toLowerCase() === builderParam.toLowerCase();
            
            const matchesLocation = !locationParam || (
                project.address?.city?.toLowerCase() === locationParam.toLowerCase() ||
                project.address?.area?.toLowerCase() === locationParam.toLowerCase()
            );

            return (
                matchesBudget &&
                matchesConfig &&
                matchesStatus &&
                matchesCity &&
                matchesCategory &&
                matchesQuery &&
                matchesBuilder &&
                matchesLocation
            );
        });
    }, [
        projects,
        budget,
        selectedConfig,
        selectedStatus,
        selectedCity,
        selectedCategory,
        queryParam,
        builderParam,
        locationParam
    ]);
    const handleTourClick = (project) => {
        setActiveTourProject(project);
        setShowSelectionModal(true);
    };
    return (
        <main className="min-h-screen bg-gray-50 ">


            {/* Filter Section */}
            <div className="max-w-7xl  mx-auto border-y border-black bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-8">
                    {/* Budget */}
                    <div className="border-r border-gray-300 pr-6">
                        <h3 className="text-[15px] font-medium text-black mb-4">
                            Budget
                        </h3>

                        <input
                            type="range"
                            min="0"
                            max="3000"
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="w-full accent-[#742E85]"
                        />

                        <div className="mt-3 text-[15px] text-black font-medium">
                            ₹0 - {budget >= 100 ? `₹${(budget / 100).toFixed(2)} Cr` : `₹${budget} L`}
                        </div>
                    </div>

                    {/* Configuration */}
                    <div className="border-r border-gray-300 ">
                        <h3 className="text-[15px] font-medium text-black mb-4">
                            Configuration
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

                    {/* Status */}
                    <div className="border-r border-gray-300 ">
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
                        <h3 className="text-[15px] font-medium uppercase text-black mb-4">
                            Location
                        </h3>

                        <div className="space-y-3">
                            <select
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
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
                            <div className="flex gap-2">


                                <button className="px-6 py-2 bg-[#742E85] text-white rounded-md text-[14px] font-medium">
                                    Apply
                                </button>

                                    <button
                                        onClick={() => {
                                            setBudget(3000);
                                            setSelectedConfig("");
                                            setSelectedStatus("");
                                            setSelectedCity("Pune");
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-[14px] text-black"
                                    >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Heading + Right Side Controls */}
            <div className="max-full mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
                    <div>
                        <h1 className="text-[40px] leading-none font-bold text-[#742E85]">
                            New Projects in Wakad, Pune
                        </h1>
                        <p className="mt-4 text-[18px] text-black">
                            {filteredProjects.length} Projects found
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="min-w-[20px] px-4 py-3 border border-gray-300 rounded-xl text-[16px] text-black bg-white outline-none"
                        >
                            <option value="">All Categories</option>
                            <option value="Affordable">Affordable</option>
                            <option value="Premium">Premium</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Holiday">Holiday</option>
                        </select>

                        <div className="hidden md:flex border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`px-5 py-3 transition-colors ${viewMode === "grid" ? "bg-[#742E85] text-white" : "bg-white text-gray-500"}`}
                            >
                                <Grid2X2 size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-5 py-3 transition-colors border-l border-gray-300 ${viewMode === "list" ? "bg-[#742E85] text-white" : "bg-white text-gray-500"}`}
                            >
                                <List size={18} />
                            </button>
                        </div>

                        <button onClick={() => setIsMapOpen(true)} className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl bg-white text-[16px] text-black">
                            <Map size={18} />
                            Map
                        </button>
                        <MapModal
                            isOpen={isMapOpen}
                            onClose={() => setIsMapOpen(false)}
                            locationName={officeDetails.name}
                            address={officeDetails.address}
                            iframeSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.513447079499!2d73.91246457334937!3d18.460387771013473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eb291d95088b%3A0xbfae7509b6f71b86!2sPIINGGAKSHA!5e0!3m2!1sen!2sin!4v1778153416410!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                {/* Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <PropertyCard key={idx} project={project} />
          ))}
        </div> */}
                <div className={viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-5 gap-2"
                    : "flex flex-col gap-6"
                }>
                    {filteredProjects.map((project) => (
                        viewMode === "grid"
                            ? <PropertyCard key={project._id} project={project} isWishlisted={wishlist.includes(project._id)} onToggleWishlist={handleToggleWishlist} onTourClick={handleTourClick} />
                            : <PropertyCardHori key={project._id} project={project} isWishlisted={wishlist.includes(project._id)} onToggleWishlist={handleToggleWishlist} onTourClick={handleTourClick} />
                    ))}
                </div>
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
        </main>
    );
}
export default function Home() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <PropertiesContent />
        </Suspense>
    );
}