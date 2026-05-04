"use client";
import { useState, useEffect } from "react";

export default function PriceDropFilters({ projects, onFilter }) {
  const [filters, setFilters] = useState({
    city: "",
    budget: "",
    drop: "",
    type: "",
    builder: "",
  });

  // Extract unique values
  const cities = [...new Set(projects.map(p => p.address?.city).filter(Boolean))];
  const builders = [...new Set(projects.map(p => p.builderName).filter(Boolean))];
  const priceRanges = [...new Set(projects.map(p => p.pricing?.displayPrice).filter(Boolean))]; // Apply filter whenever change
  const configurations = [...new Set(projects.flatMap(p => p.configuration).filter(Boolean))];

  console.log("Unique Cities:", configurations);
  useEffect(() => {
    let filtered = [...projects];

    // City
    if (filters.city) {
      filtered = filtered.filter(p => p.address?.city === filters.city);
    }

    // Budget (based on new price)
    if (filters.budget) {
      filtered = filtered.filter(p => p.pricing?.displayPrice === filters.budget);
    }

    // Drop %
    if (filters.drop) {
      filtered = filtered.filter(p => {
        const oldP = p.priceDrop?.oldPrice || 0;
        const newP = p.priceDrop?.newPrice || 0;
        const percent = ((oldP - newP) / oldP) * 100;
        return percent >= Number(filters.drop);
      });
    }

    // Builder
    if (filters.builder) {
      filtered = filtered.filter(p => p.builderName === filters.builder);
    }
    // Property Type
    if (filters.type) {
      filtered = filtered.filter(p =>
        p.configuration?.includes(filters.type)
      );
    }
    onFilter(filtered);
  }, [filters, projects]);

  return (
    <div className="bg-white p-4 rounded-xl border mb-6">
      <h2 className="text-black text-lg font-semibold mb-4">Filters</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-[#6F6F6F]">

        {/* Location */}
        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="border p-2 rounded text-sm"
        >
          <option value="">All Locations</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Budget */}
        <select
          value={filters.budget}
          onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
          className="border p-2 rounded text-sm"
        >
          <option value="">Any Budget</option>
          {priceRanges.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Drop */}
        <select
          value={filters.drop}
          onChange={(e) => setFilters({ ...filters, drop: e.target.value })}
          className="border p-2 rounded text-sm"
        >
          <option value="">Any Drop</option>
          <option value="5">5%+</option>
          <option value="10">10%+</option>
          <option value="20">20%+</option>
          <option value="30">30%+</option>
          <option value="40">40%+</option>
        </select>

        {/* Property Type */}
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="border p-2 rounded text-sm"
        >
          <option value="">All Types</option>
          {configurations?.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Builder */}
        <select
          value={filters.builder}
          onChange={(e) => setFilters({ ...filters, builder: e.target.value })}
          className="border p-2 rounded text-sm"
        >
          <option value="">All Builders</option>
          {builders.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={() =>
            setFilters({
              city: "",
              budget: "",
              drop: "",
              type: "",
              builder: "",
            })
          }
          className="bg-gray-100 text-sm rounded px-3 hover:bg-gray-200 transition-all text-gray-700 font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
}