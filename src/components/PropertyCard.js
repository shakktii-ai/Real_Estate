import React from 'react';
import { Heart, MapPin, Calendar, Home } from 'lucide-react';
import { useState } from 'react';
import HeartButton from "@/components/HeartButton"
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
const PropertyCard = ({ project, isWishlisted, onToggleWishlist }) => {
  const {user} = useAuth();
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const categoryColors = {
    Premium: "bg-[#009966]",
    Luxury: "bg-[#F97316]",
    Affordable: "bg-[#1447EA]",
    Holiday: "bg-[#1DA2B3]",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow relative ">
      {/* Top Image Section */}
      <div className="relative h-56">
        <img
          src={project.mainImage}
          alt={project.projectName}
          className="w-full h-full object-cover rounded-t-2xl"
        />
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
        { user &&(
        <span className="absolute top-3 right-3 bg-white/50  rounded-full">
          <HeartButton
          propertyId={project._id}  // Make sure this matches your project object ID
          userId={user?.uid}        // Pass the UID from your auth object
          initialIsWishlisted={isWishlisted}
          onToggle={onToggleWishlist}
          />
      </span>)
}
        {project.tags?.includes("RERA Verified") && (
          <div className="absolute bottom-3 left-3 bg-[#DBFCE7] px-2 py-1 rounded-full flex items-center gap-1 text-[10px] text-[#009318] font-bold border border-green-200">
            RERA Verified
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-black ">{project.projectName}<span className='ml-1 font-normal text-sm'>({project.reraNumber})</span></h3>
        <p className="text-sm text-black mb-2">{project.builderName}</p>

        <p className="text-xl font-bold text-[#1447EA] mb-4">{project.pricing.displayPrice}<span className='ml-2 font-normal text-sm text-black'>onwards</span></p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-black">
            <MapPin size={14} /> {project.address?.area}, {project.address?.city}
          </div>
          <div className="flex items-center gap-2 text-xs text-black">
            <Calendar size={14} /> Possession: {project.possessionDate}
          </div>
          <div className="flex items-center gap-2 text-xs text-black">
            <Home size={14} />  {project.configuration?.join(", ")}
          </div>
        </div>

        {/* Construction Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-[#6F6F6F] mb-1">
            <span>Construction</span>
            <span>{project.constructionProgress}% Complete</span>
          </div>

          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-1 rounded-full transition-all duration-500 bg-[#02B11F]"
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
                className="px-3 py-1 rounded-full bg-[#D9D9D9] text-black text-[11px] font-medium"
              >
                {amenity}
              </span>
            ))}

            {project.amenities.length > 2 && !showAllAmenities && (
              <button
                type="button"
                onClick={() => setShowAllAmenities(true)}
                className="px-3 py-1 rounded-full bg-[#D9D9D9] text-black text-[11px] font-medium hover:bg-gray-200 transition"
              >
                +{project.amenities.length - 2}
              </button>
            )}
          </div>
        )}
        {/* Buttons */}
        <div className="flex gap-2">
          <Link href={`/properties/${project.slug}`} className="flex-1 flex items-center justify-center bg-[#742E85] text-white py-2 rounded-md text-sm font-semibold">View Details</Link>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700">Get Price</button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;