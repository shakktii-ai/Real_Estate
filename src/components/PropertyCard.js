import React from 'react';
import { Heart, MapPin, Calendar, Home } from 'lucide-react';
import { useState } from 'react';
import HeartButton from "@/components/HeartButton"
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

const PropertyCard = ({ project, isWishlisted, onToggleWishlist, onTourClick }) => {
  const { user } = useAuth();
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const categoryColors = {
    Premium: "bg-[#009966]",
    Luxury: "bg-[#F97316]",
    Affordable: "bg-[#1447EA]",
    Holiday: "bg-[#1DA2B3]",
    Featured:"bg-[#A566B8]",

  };

  return (
    <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden relative transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] h-full mx-2 flex flex-col justify-between">
      {/* Top Image Section */}
      <div className="w-full">
        <Link href={`/properties/${project.slug}`}>
          <div className="relative h-48 sm:h-52 md:h-56 w-full">
            <img
              src={project.mainImage}
              alt={project.projectName}
              className="w-full h-full object-cover rounded-t-2xl"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
              {project.tags
                ?.filter((tag) => tag !== "RERA Verified")
                .map((tag) => (
                  <span
                    key={tag}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap text-white ${categoryColors[tag] || "text-gray-600 bg-gray-100"}`}
                  >
                    {tag}
                  </span>
                ))}
            </div>
            {user && (
              <span
                className="absolute top-3 right-3 bg-white/50 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <HeartButton
                  propertyId={project._id}
                  userId={user?.uid}
                  initialIsWishlisted={isWishlisted}
                  onToggle={onToggleWishlist}
                />
              </span>
            )}
            {project.tags?.includes("RERA Verified") && (
              <div className="absolute bottom-3 left-3 bg-[#DBFCE7] px-2 py-1 rounded-full flex items-center gap-1 text-[10px] text-[#009318] font-bold border border-green-200 whitespace-nowrap">
                RERA Verified
              </div>
            )}
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-2 flex-col">
          <div className="font-bold text-sm md:text-md text-black">
            {project.projectName}
            <h4 className='ml-1 font-normal text-xs sm:text-sm text-gray-600 max-w-[120px] vertical-middle'>
              ({project.reraNumber})
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-black mb-2 line-clamp-1 truncate">{project.builderName}</p>

          <p className="text-lg sm:text-xl font-bold text-[#1447EA] mb-3 whitespace-nowrap">
            {project.pricing.displayPrice}
            <span className='ml-1.5 font-normal text-xs sm:text-sm text-black'>onwards</span>
          </p>

          <div className="space-y-2 mb-4 text-xs text-black">
            <div className="flex items-center gap-2 line-clamp-1 truncate">
              <MapPin size={14} className="flex-shrink-0" /> {project.address?.area}, {project.address?.city}
            </div>
            <div className="flex items-center gap-2 line-clamp-1 truncate">
              <Calendar size={14} className="flex-shrink-0" /> Possession: {project.possessionDate}
            </div>
            <div className="flex items-center gap-2 line-clamp-1 truncate">
              <Home size={14} className="flex-shrink-0" /> {project.configuration?.join(", ")}
            </div>
          </div>

          {/* Construction Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-[#6F6F6F] mb-1 whitespace-nowrap">
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
            <div className="my-2 flex flex-wrap gap-1.5 max-h-[28px] overflow-hidden">
              {(showAllAmenities ? project.amenities : project.amenities.slice(0, 2)).map((amenity) => (
                <span key={amenity} className="px-2.5 py-0.5 rounded-full bg-[#D9D9D9] text-black text-[10px] sm:text-[11px] font-medium whitespace-nowrap">
                  {amenity}
                </span>
              ))}

              {project.amenities.length > 2 && !showAllAmenities && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAllAmenities(true);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-[#D9D9D9] text-black text-[10px] sm:text-[11px] font-medium hover:bg-gray-200 transition whitespace-nowrap"
                >
                  +{project.amenities.length - 2}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buttons Block anchored at the bottom */}
      <div className="p-4 pt-0 w-full">
        <div className="flex gap-2 w-full">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onTourClick) onTourClick(project);
            }}
            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 bg-[#742E85] rounded-md text-xs sm:text-sm font-semibold text-white hover:bg-[#A566B8] transition whitespace-nowrap text-center"
          >
            Tour
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const companyPhoneNumber = "919284429197";
              const message = `Hello Piinggaksha Team, I am interested in *${project.projectName}* by ${project.builderName} located in ${project.address?.area || 'Pune'}. Please share the current pricing, floor plans, and layout options for ${project.configuration?.join(", ") || 'this project'}.`;

              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/${companyPhoneNumber}?text=${encodedMessage}`, '_blank');
            }}
            className="flex-1 px-3 sm:px-4 py-2 bg-[#1AA34A] hover:bg-[#20ba5a] text-white rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition border border-transparent shadow-sm whitespace-nowrap text-center"
          >
            Live Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;