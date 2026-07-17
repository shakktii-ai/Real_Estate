import React from 'react';
import { Heart, MapPin, Calendar, Home } from 'lucide-react';
import { useState } from 'react';
import HeartButton from "@/components/HeartButton"
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { BsWhatsapp } from 'react-icons/bs';
import ShareProject from '@/components/ShareProject';
const PropertyCard = ({ project, isWishlisted, onToggleWishlist, onTourClick }) => {
  const { user } = useAuth();
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const categoryColors = {
    Premium: "bg-[#00A529]",
    Luxury: "bg-[#F97316]",
    Affordable: "bg-[#1447EA]",
    Holiday: "bg-[#1DA2B3]",
    Featured: "bg-[#A566B8]",
    Residential: "bg-[#8B5CF6]",
    Commercial: "bg-black",
    Plot: "bg-[#F59E0B]",
    "Sold out": "bg-[#c80815]",

  };

  return (
    <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden relative transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] h-full mx-2 flex flex-col justify-between">
      {/* Top Image Section */}
      <Link href={`/properties/${project.slug}`}>
        <div className="w-full">

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
                    className={`px-2.5 py-0.5 rounded-full text-[8px] sm:text-[8px] font-medium whitespace-nowrap shadow-md text-white ${categoryColors[tag] || "text-gray-600 bg-gray-100"}`}
                  >
                    {tag}
                  </span>
                ))}
            </div>
            
            {user && (
              <span
                className="absolute top-3 right-3 bg-white/50 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <HeartButton
                  propertyId={project._id}
                  userId={user?.uid}
                  initialIsWishlisted={isWishlisted}
                  onToggle={onToggleWishlist}
                />
              </span>
            )}
            <div className="absolute top-1 right-10">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <ShareProject project={project} />
              </div>
            </div>
            {project.tags?.includes("RERA Verified") && (
              <div className="absolute bottom-3 left-3 bg-[#DBFCE7] px-2 py-0.5 rounded-full flex items-center gap-1 text-[8px] text-[#009318] font-medium border border-green-200 whitespace-nowrap shadow-md">
                RERA Verified
              </div>
            )}

          </div>


          {/* Content Section */}
          <div className="p-2 flex-col">
            <div className="font-bold text-sm md:text-[14px] text-black">
              {project.projectName}
              <h4 className='ml-1 font-normal text-xs sm:text-[12px] text-gray-600 max-w-[120px] vertical-middle'>
                ({project.reraNumber})
              </h4>
            </div>
            <p className="text-xs sm:text-[12px] text-black mb-2 line-clamp-1 truncate">{project.builderName}</p>

            <p className="text-[10px] md:text-[12px] font-bold text-[#1447EA] mb-1 whitespace-nowrap">
              {project.pricing.displayPrice}
              <span className='ml-1.5 font-normal text-xs sm:text-sm text-black'>onwards</span>
            </p>

            <div className="space-y-1 mb-2 text-[10px] text-black">
              <div className="flex items-center gap-2">
                <MapPin size={10} className="flex-shrink-0" /> {project.address?.area}, {project.address?.city}
              </div>
              <div className="flex items-center gap-2 ">
                <Calendar size={10} className="flex-shrink-0" /> Possession: {project.possessionDate}
              </div>
              <div className="flex items-center gap-2 ">
                <Home size={10} className="flex-shrink-0" /> {project.configuration?.join(", ")}
              </div>
            </div>

            {/* Construction Progress */}
            <div className="mb-1">
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
            {/* 
          {project.amenities?.length > 0 && (
            <div className="my-4 flex flex-wrap gap-1.5 max-h-[28px] ">
              {(showAllAmenities ? project.amenities : project.amenities.slice(0, 1)).map((amenity) => (
                <span key={amenity} className="px-2.5 py-0.5 rounded-full bg-[#D9D9D9] text-black text-[10px] sm:text-[11px] font-medium whitespace-nowrap">
                  {amenity}
                </span>
              ))}

              {project.amenities.length > 1 && !showAllAmenities && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAllAmenities(true);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-[#D9D9D9] text-black text-[10px] sm:text-[11px] font-medium hover:bg-gray-200 transition whitespace-nowrap"
                >
                  +{project.amenities.length - 1}
                </button>
              )}
            </div>
          )} */}
          </div>
        </div>
      </Link>
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
            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 bg-[#742E85] rounded-md text-xs sm:text-sm font-semibold text-white hover:bg-[#A566B8] transition whitespace-nowrap text-center hover:cursor-pointer"
          >
            Tour
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const companyPhoneNumber = "919172400250";
              const message = "Share Project Details";

              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/${companyPhoneNumber}?text=${encodedMessage}`, '_blank');
            }}
            className="flex-1 px-3 sm:px-4 py-2 bg-white text-black rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition border border-black shadow-sm whitespace-nowrap text-center hover:cursor-pointer"
          >
            <BsWhatsapp size={16} className="text-[#25D366]" />
            Live Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;