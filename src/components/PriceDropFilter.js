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

  // Apply filter whenever change
  useEffect(() => {
    let filtered = [...projects];

    // City
    if (filters.city) {
      filtered = filtered.filter(p => p.address?.city === filters.city);
    }

    // Budget (based on new price)
    if (filters.budget) {
      filtered = filtered.filter(p => p.priceDrop?.newPrice <= Number(filters.budget));
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

    onFilter(filtered);
  }, [filters, projects]);

  return (
    <div className="bg-white p-4 rounded-xl border mb-6">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">

        {/* Location */}
        <select
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="border p-2 rounded text-sm"
        >
          <option value="">All Locations</option>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Budget */}
        <select
          onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
          className="border p-2 rounded text-sm"
        >
          <option value="">Any Budget</option>
          <option value="5000000">Below 50L</option>
          <option value="10000000">Below 1Cr</option>
          <option value="20000000">Below 2Cr</option>
        </select>

        {/* Drop */}
        <select
          onChange={(e) => setFilters({ ...filters, drop: e.target.value })}
          className="border p-2 rounded text-sm"
        >
          <option value="">Any Drop</option>
          <option value="5">5%+</option>
          <option value="10">10%+</option>
          <option value="20">20%+</option>
        </select>

        {/* Property Type */}
        <select
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="border p-2 rounded text-sm"
        >
          <option value="">All Types</option>
          <option value="2BHK">2 BHK</option>
          <option value="3BHK">3 BHK</option>
        </select>

        {/* Builder */}
        <select
          onChange={(e) => setFilters({ ...filters, builder: e.target.value })}
          className="border p-2 rounded text-sm"
        >
          <option value="">All Builders</option>
          {builders.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={() => setFilters({})}
          className="bg-gray-100 text-sm rounded px-3"
        >
          Reset
        </button>
      </div>
    </div>
  );
}