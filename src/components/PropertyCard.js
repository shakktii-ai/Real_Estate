import React from 'react';
import { Heart, MapPin, Calendar, Home } from 'lucide-react';
import { useState } from 'react';
const PropertyCard = ({ project }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const categoryColors = {
    Premium: "bg-[#009966]",
    Luxury: "bg-[#F97316]",
    Affordable: "bg-[#1447EA]",
    Holiday: "bg-[#1DA2B3]",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow relative p-4">
      {/* Top Image Section */}
      <div className="relative h-56">
        <img src={project.image} alt={project.projectName} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[80%]">


          {project.tags
            ?.filter((tag) => tag !== "RERA Verified")
            .map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[tag] || "text-gray-600 bg-gray-100"
                  }`}
              >
                {tag}
              </span>
            ))}
        </div>
        <button className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full hover:bg-white">
          <Heart size={16} className="text-gray-600" />
        </button>
        {project.tags?.includes("RERA Verified") && (
          <div className="absolute bottom-3 left-3 bg-[#DBFCE7] px-2 py-1 rounded-full flex items-center gap-1 text-[10px] text-[#009318] font-bold border border-green-200">
            RERA Verified
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{project.projectName}</h3>
        <p className="text-sm text-gray-500 mb-2">{project.builderName}</p>

        <p className="text-xl font-bold text-[#1447EA] mb-4">{project.pricing.displayPrice}<span className='font-normal text-sm text-black'>onwards</span></p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin size={14} /> {project.address}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar size={14} /> Possession: {project.possessionDate}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Home size={14} />  {project.configuration?.join(", ")}
          </div>
        </div>

        {/* Construction Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Construction</span>
            <span>{project.constructionProgress}% Complete</span>
          </div>

          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${project.constructionProgress >= 80
                ? "bg-green-500"
                : project.constructionProgress >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
                }`}
              style={{ width: `${project.constructionProgress || 0}%` }}
            />
          </div>
        </div>
        {project.amenities?.length > 0 && (
          <div className="my-2 flex flex-wrap gap-2">
            {(showAllAmenities
              ? project.amenities
              : project.amenities.slice(0, 2)
            ).map((amenity) => (
              <span
                key={amenity}
                className="px-3 py-1 rounded-full bg-[#742E85]/10 text-[#742E85] text-[11px] font-medium"
              >
                {amenity}
              </span>
            ))}

            {project.amenities.length > 2 && !showAllAmenities && (
              <button
                type="button"
                onClick={() => setShowAllAmenities(true)}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium hover:bg-gray-200 transition"
              >
                +{project.amenities.length - 2}
              </button>
            )}
          </div>
        )}
        {/* Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-purple-800 text-white py-2 rounded-md text-sm font-semibold">View Details</button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700">Get Price</button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;