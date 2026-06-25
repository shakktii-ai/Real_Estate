"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Grid2X2, List, Map, ChevronDown } from "lucide-react";
import PropertyCardHori from "@/components/PropertyCardHori";
import { useAuth } from "@/lib/context/AuthContext";
import TourSelectionModal from '@/components/TourSelectionModal';
import BookSiteVisitModal from '@/components/BookSiteVisitModal';
import BookVirtualTourModal from '@/components/BookVirtualTourModal';
import MapModal from "@/components/map";

// ─── Filter Bar Component ─────────────────────────────────────────────────────
function PropertyFilterBar({ projects, selectedCity, setSelectedCity, selectedCategory, setSelectedCategory, budget, setBudget, selectedStatus, setSelectedStatus, onApply }) {
  const cities = [...new Set(projects.map(p => p.address?.city).filter(Boolean))];

  const handleApply = () => {
    if (onApply) onApply();
  };

  const handleReset = () => {
    setSelectedCity("Pune");
    setSelectedCategory("");
    setBudget(99);
    setSelectedStatus("");
  };

  return (
    <div className="bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.08),0_4px_10px_rgba(0,0,0,0.08)] px-4 py-4 mx-0 flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-0 w-full max-w-full text-[14px] font-semibold"
    >
      {/* Location */}
      <div className="flex flex-col flex-1 min-w-[220px] md:border-r border-gray-200 md:pr-4">
        <span className=" text-[#742E85] uppercase tracking-widest mb-1">Location</span>
        <div className="relative">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="appearance-none w-full text-sm text-gray-800 font-semibold bg-transparent outline-none pr-6 cursor-pointer"
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
                    {/* <option value="Sindhudurg (Near Mopa, Goa)">Sindhudurg (Near Mopa, Goa)</option> */}
            {cities.filter(c => c !== "Pune").map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
        </div>
      </div>

      {/* Property */}
      <div className="flex flex-col flex-1 min-w-[220px] md:border-r border-gray-200 md:px-4">
        <span className=" text-[#742E85] uppercase tracking-widest mb-1">Property</span>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full text-sm text-gray-800 font-semibold bg-transparent outline-none pr-6 cursor-pointer truncate"
          >
            <option value="">All</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Plot">Plots</option>
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
        </div>
      </div>

      {/* Budget */}
      <div className="flex flex-col flex-1 min-w-[220px] md:border-r border-gray-200 md:px-4">
        <span className=" text-[#742E85] uppercase tracking-widest mb-1">Budget</span>
        <input
          type="range" min="50" max="1000" value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full accent-[#742E85] mt-1"
        />
        <span className="text-xs text-gray-600 mt-0.5 font-medium">
          ₹50L - ₹{budget >= 1000 ? "10Cr" : `${budget}L`}
        </span>
      </div>

      {/* Status */}
      <div className="flex flex-col flex-1 min-w-[220px] md:border-r border-gray-200 md:px-4">
        <span className=" text-[#742E85] uppercase tracking-widest mb-1">Status</span>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none w-full text-sm text-gray-800 font-semibold bg-transparent outline-none pr-6 cursor-pointer"
          >
            <option value="">All</option>
            <option value="Ready">Ready</option>
            <option value="Under Construction">Under Construction</option>
            <option value="Late Possession">Late Possession</option>
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
        </div>
      </div>

      {/* Apply & Reset */}
      <div className="flex items-center gap-3 md:pl-4">
        <button
          onClick={handleApply}
          className="bg-black text-white text-sm font-semibold px-8 py-3 rounded-xl hover:bg-gray-900 transition whitespace-nowrap"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="bg-white text-black text-sm font-semibold px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition whitespace-nowrap"
        >
          Reset
        </button>
      </div>
    </div>
  );
}


function PropertiesContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const builderParam = searchParams.get("builder");
    const locationParam = searchParams.get("location");
    const queryParam = searchParams.get("q");
    const budgetParam = searchParams.get("budget");
    const statusParam = searchParams.get("status");
    const fromHomeParam = searchParams.get("fromHome");
    const [budget, setBudget] = useState(budgetParam ? Number(budgetParam) : 99);
    const [selectedConfig, setSelectedConfig] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(statusParam || "");
    const [selectedCity, setSelectedCity] = useState(locationParam || "Pune");
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
    const router = useRouter();

const handleApplyFilters = () => {
  const params = new URLSearchParams();

  if (selectedCity) params.set("location", selectedCity);
  if (selectedCategory) params.set("category", selectedCategory);
  if (selectedStatus) params.set("status", selectedStatus);
  if (budget) params.set("budget", budget);

  router.push(`/properties?${params.toString()}`);
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
         setSelectedCity(locationParam || "Pune");
        }
        if (budgetParam) {
            setBudget(Number(budgetParam));
        }
        // if navigated from home, clear config/status to show all
        if (fromHomeParam) {
            setSelectedConfig("");
            setSelectedStatus("");
        } else {
            if (statusParam) {
                setSelectedStatus(statusParam);
            }
        }
    }, [categoryParam, locationParam, builderParam, queryParam, budgetParam, statusParam]);

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
  selectedCity === "Pune" ||
  project.address?.city === selectedCity ||
  project.address?.area?.includes(selectedCity);

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
            
//          const matchesLocation =
//   !locationParam ||
//   (project.address?.city || "").includes(locationParam) ||
//   (project.address?.area || "").includes(locationParam);

            return (
                matchesBudget &&
                matchesConfig &&
                matchesStatus &&
                matchesCity &&
                matchesCategory &&
                matchesQuery &&
                matchesBuilder 
                // matchesLocation
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
            <div className="max-w-full px-1  py-4">
              <PropertyFilterBar 
                projects={projects}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                budget={budget}
                setBudget={setBudget}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                // onApply={() => {}}
                    onApply={handleApplyFilters}
              />
            </div>


            {/* Heading + Right Side Controls */}
            <div className="max-full mx-auto px-6 py-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
                    <div>
                        <h1 className="text-[20px] md:text-[30px] leading-none font-bold text-[#742E85]">
                            New Projects in Pune
                        </h1>
                        <p className="mt-4 text-[14px] md:text-[18px] text-black">
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
                    ? "grid grid-cols-1 md:grid-cols-4 gap-1"
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