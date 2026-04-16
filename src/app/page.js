"use client";

import { useMemo, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Grid2X2, List, Map } from "lucide-react";

const dummyData = [
  {
    name: "Urban Heights",
    type: "Premium",
    location: "Wakad",
    city: "Pune",
    status: "Ready",
    budget: 120,
    configs: ["2 BHK", "3 BHK"],
  },
  {
    name: "Skyline Towers",
    type: "Luxury",
    location: "Baner",
    city: "Pune",
    status: "Under Construction",
    budget: 180,
    configs: ["3 BHK", "4 BHK"],
  },
  {
    name: "Green Avenue",
    type: "Affordable",
    location: "Wakad",
    city: "Pune",
    status: "Late Possession",
    budget: 80,
    configs: ["1 BHK", "2 BHK"],
  },
];

export default function Home() {
  const [budget, setBudget] = useState(200);
  const [selectedConfig, setSelectedConfig] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
const [projects, setProjects] = useState([]);
useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
  }, []);

  // Dynamic filter options from DB data
  const cities = [...new Set(projects.map((p) => p.location?.city).filter(Boolean))];
  const areas = [...new Set(projects.map((p) => p.location?.address).filter(Boolean))];
  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))];

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
        !selectedCity || project.location?.city === selectedCity;

      const matchesArea =
        !selectedArea || project.location?.address === selectedArea;

      const matchesCategory =
        !selectedCategory || project.category === selectedCategory;

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

  return (
    <main className="min-h-screen bg-gray-50 ">
      <Navbar />

      {/* Filter Section */}
      <div className="max-w-7xl px-4 mx-auto mt-4 border-y border-gray-300 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-8">
          {/* Budget */}
          <div className="border-r border-gray-300 pr-6">
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

          {/* Configuration */}
          <div className="border-r border-gray-300 ">
            <h3 className="text-[15px] font-medium text-black mb-4">
              Configuration
            </h3>

            <div className="flex flex-wrap gap-2">
              {[
                "1 BHK",
                "1.5 BHK",
                "2 BHK",
                "2.5 BHK",
                "3 BHK",
                "3.5 BHK",
                "4 BHK",
                "4.5 BHK",
                "5 BHK",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedConfig(item)}
                  className={`px-4 py-2 rounded-md border text-[14px] font-medium transition ${
                    selectedConfig === item
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
                    className={`px-5 py-3 rounded-md border text-[14px] font-medium transition ${
                      selectedStatus === item
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
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-[14px] text-black outline-none"
              >
                <option value="">City</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
              </select>

              <div className="flex gap-3">
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-[14px] text-black outline-none"
                >
                  <option value="">Area</option>
                  <option value="Wakad">Wakad</option>
                  <option value="Baner">Baner</option>
                </select>

                <button className="px-6 bg-[#742E85] text-white rounded-md text-[14px] font-medium">
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
                  className="px-6 border border-gray-300 rounded-md text-[14px] text-black"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heading + Right Side Controls */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
              className="min-w-[220px] px-4 py-3 border border-gray-300 rounded-xl text-[16px] text-black bg-white outline-none"
            >
              <option value="">All Categories</option>
              <option value="Affordable">Affordable</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
              <option value="Holiday">Holiday</option>
            </select>

            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button className="px-5 py-3 bg-[#742E85] text-white">
                <Grid2X2 size={18} />
              </button>
              <button className="px-5 py-3 bg-white text-gray-500 border-l border-gray-300">
                <List size={18} />
              </button>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl bg-white text-[16px] text-black">
              <Map size={18} />
              Map
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <PropertyCard key={idx} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}