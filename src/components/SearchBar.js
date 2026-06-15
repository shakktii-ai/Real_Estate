"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, Home } from "lucide-react";

const SearchBar = ({ className = "", inputClassName = "", onSearchComplete }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [suggestions, setSuggestions] = useState({ projects: [], builders: [], locations: [] });
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = async () => {
    setIsFocused(true);
    if (!hasFetched) {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        setAllProjects(data);
        setHasFetched(true);
      } catch (error) {
        console.error("Failed to fetch properties for search", error);
      }
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions({ projects: [], builders: [], locations: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    const matchedProjects = [];
    const matchedBuilders = new Set();
    const matchedLocations = new Set();

    allProjects.forEach((project) => {
      if (project.projectName?.toLowerCase().includes(query)) matchedProjects.push(project);
      if (project.builderName?.toLowerCase().includes(query)) matchedBuilders.add(project.builderName);
      if (project.address?.city?.toLowerCase().includes(query)) matchedLocations.add(project.address.city);
      if (project.address?.area?.toLowerCase().includes(query)) matchedLocations.add(project.address.area);
    });

    setSuggestions({
      projects: matchedProjects.slice(0, 4),
      builders: Array.from(matchedBuilders).slice(0, 3),
      locations: Array.from(matchedLocations).slice(0, 3),
    });
  }, [searchQuery, allProjects]);

  const handleSearchSubmit = (event, customQuery = null) => {
    if (event) event.preventDefault();
    const query = (customQuery || searchQuery).trim();
    if (!query) return;

    const qLower = query.toLowerCase();

    const exactProject = allProjects.find(p => p.projectName?.toLowerCase() === qLower);
    if (exactProject) { handleNavigate(`/properties/${exactProject.slug}`); return; }

    const exactBuilder = allProjects.find(p => p.builderName?.toLowerCase() === qLower);
    if (exactBuilder) { handleNavigate(`/properties?builder=${encodeURIComponent(exactBuilder.builderName)}`); return; }

    const exactLocation = allProjects.find(p =>
      p.address?.city?.toLowerCase() === qLower || p.address?.area?.toLowerCase() === qLower
    );
    if (exactLocation) {
      const loc = exactLocation.address.city.toLowerCase() === qLower ? exactLocation.address.city : exactLocation.address.area;
      handleNavigate(`/properties?location=${encodeURIComponent(loc)}`);
      return;
    }

    handleNavigate(`/properties?q=${encodeURIComponent(query)}`);
  };

  const handleNavigate = (url) => {
    setIsFocused(false);
    setSearchQuery("");
    if (onSearchComplete) onSearchComplete();
    router.push(url);
  };

  const hasSuggestions = suggestions.projects.length > 0 || suggestions.builders.length > 0 || suggestions.locations.length > 0;

  return (
    <>
      {/* Scrolling placeholder keyframe */}
      <style>{`
        @keyframes marquee-placeholder {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .placeholder-marquee {
          animation: marquee-placeholder 8s linear infinite;
          white-space: nowrap;
          display: inline-block;
        }
      `}</style>

      <div ref={wrapperRef} className={`relative flex items-center w-full ${className}`}>
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full items-center gap-2 bg-[#F5F5F7] border border-[#E8E8EA] rounded-full px-3 py-1.5 shadow-sm transition-all duration-300"
        >
          {/* Custom placeholder shown only when input is empty and not focused */}
          <div className="relative flex-1 overflow-hidden">
            {!searchQuery && !isFocused && (
              <div className="absolute inset-0 flex items-center pointer-events-none">
                <span className="placeholder-marquee text-sm text-gray-500">
                  Search builder, locality or project
                </span>
              </div>
            )}
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleFocus}
              placeholder=""
              className={`w-full bg-transparent text-sm text-black outline-none ${inputClassName}`}
              aria-label="Search properties"
              autoComplete="off"
            />
          </div>

          <button type="submit" className="p-2 rounded-full bg-[#742E85] text-white hover:bg-[#5f256a] shrink-0">
            <Search size={16} />
          </button>
        </form>

        {/* Suggestions Dropdown */}
        {isFocused && searchQuery.trim() && (
          <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-[100] max-h-[60vh] overflow-y-auto">
            {hasSuggestions ? (
              <div className="p-2 flex flex-col gap-1">
                {suggestions.projects.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase tracking-wider">Projects</div>
                    {suggestions.projects.map(project => (
                      <button
                        key={project._id}
                        onClick={() => handleNavigate(`/properties/${project.slug}`)}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors group"
                      >
                        <div className="bg-purple-100 p-1.5 rounded-md text-[#742E85] group-hover:bg-[#742E85] group-hover:text-white transition-colors">
                          <Home size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">{project.projectName}</span>
                          <span className="text-xs text-gray-500">{project.builderName} • {project.address?.area}, {project.address?.city}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {suggestions.builders.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase tracking-wider">Builders</div>
                    {suggestions.builders.map(builder => (
                      <button
                        key={builder}
                        onClick={() => handleNavigate(`/properties?builder=${encodeURIComponent(builder)}`)}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors group"
                      >
                        <div className="bg-purple-100 p-1.5 rounded-md text-[#742E85] group-hover:bg-[#742E85] group-hover:text-white transition-colors">
                          <Building2 size={14} />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{builder}</span>
                      </button>
                    ))}
                  </div>
                )}

                {suggestions.locations.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase tracking-wider">Locations</div>
                    {suggestions.locations.map(location => (
                      <button
                        key={location}
                        onClick={() => handleNavigate(`/properties?location=${encodeURIComponent(location)}`)}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors group"
                      >
                        <div className="bg-purple-100 p-1.5 rounded-md text-[#742E85] group-hover:bg-[#742E85] group-hover:text-white transition-colors">
                          <MapPin size={14} />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{location}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;