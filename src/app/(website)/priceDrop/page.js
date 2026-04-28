// src/app/price-drop/page.js
import React from 'react';
import { Heart, Sparkles, Phone, Calendar, MapPin } from 'lucide-react';

// 1. Server-side Data Fetching
async function getPriceDropProjects() {
  const res = await fetch(`/api/priceDrop`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}

// 2. Main Page Component
export default async function PriceDropPage() {
  const { data: projects } = await getPriceDropProjects();
  const totalDrops = projects?.length || 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header Stats */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Price Drop Alerts</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-gray-500 text-sm">Total Drops This Week</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalDrops}</p>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-6">
          {projects && projects.length > 0 ? (
            projects.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))
          ) : (
            <p className="text-center py-10 text-gray-500">No active price drops found.</p>
          )}
        </div>
      </div>
    </main>
  );
}

// 3. Property Card Component
const PropertyCard = ({ property }) => {
  const { 
    projectName, 
    builderName, 
    address, 
    mainImage, 
    priceDrop, 
    tags, 
    units 
  } = property;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
      
      {/* Left: Image Section */}
      <div className="md:w-[350px] relative shrink-0">
        <img 
          src={mainImage || "/api/placeholder/400/500"} 
          alt={projectName} 
          className="w-full h-64 md:h-full object-cover" 
        />
        <div className="absolute bottom-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider">
          Limited time deal
        </div>
      </div>

      {/* Right: Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{projectName}</h2>
              <p className="text-sm text-gray-500 font-medium">By {builderName}</p>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <MapPin size={12} className="mr-1" /> {address?.area}, {address?.city}
              </p>
            </div>
            <button className="text-gray-300 hover:text-red-500 transition-colors">
              <Heart size={24} />
            </button>
          </div>

          {/* Price Box */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-500 line-through">Previous Price: {priceDrop?.oldPrice}</p>
                <p className="text-2xl font-bold text-[#742E85]">New Price: {priceDrop?.newPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-red-600 font-bold text-xs">↓ Price Drop</p>
                <p className="text-gray-400 text-[10px]">Updated Today</p>
              </div>
            </div>
          </div>

          {/* Units Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {units?.map((unit, idx) => (
              <div key={idx} className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                <p className="font-bold text-sm text-gray-800">{unit.type}</p>
                <p className="text-[10px] text-gray-500 mb-1">{unit.size}</p>
                <p className="text-[#742E85] font-semibold text-sm">{unit.price}</p>
                <p className="text-[10px] text-gray-400 line-through">{unit.oldPrice}</p>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="bg-blue-50/50 text-blue-700 p-2 rounded-md text-[11px] font-medium flex items-center gap-2 mb-4">
            <Sparkles size={14} className="shrink-0" /> 
            <span>AI Insight: Early possession advantage - ready to move</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags?.map((tag, i) => (
              <span key={i} className="text-[10px] border px-2 py-1 rounded-full text-gray-600 bg-gray-50 border-gray-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
          <button className="flex-1 border border-gray-200 py-2.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all">
            View Details
          </button>
          <button className="flex-1 border border-gray-200 py-2.5 rounded-lg text-xs font-semibold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
            <Phone size={14}/> Contact Expert
          </button>
          <button className="flex-1 bg-[#742E85] text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#5e256c] transition-all">
            <Calendar size={14}/> Schedule Visit
          </button>
          <button className="border border-gray-200 px-3 rounded-lg hover:bg-gray-50 transition-all">
            <Heart size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};