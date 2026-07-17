import Link from "next/link";
import { MapPin, Calendar, Home, Heart } from "lucide-react";
import { useState } from "react";
import HeartButton from "@/components/HeartButton"
import { useAuth } from "@/lib/context/AuthContext";
import { BsWhatsapp } from "react-icons/bs";
import ShareProject from "@/components/ShareProject";
export default function ProjectListCard({ project, isWishlisted, onToggleWishlist, onTourClick }) {
  const { user } = useAuth();
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const categoryColors = {
    Premium: "bg-[#009966]",
    Luxury: "bg-[#F97316]",
    Affordable: "bg-[#1447EA]",
    Holiday: "bg-[#1DA2B3]",
    Featured:"bg-[#A566B8]",
    Residential: "bg-[#8B5CF6]",
    Commercial: "bg-black",
    Plot:"bg-[#F59E0B]",
    "Sold out": "bg-[#c80815]",
  };
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row overflow-visible h-auto md:h-[350px]">

      {/* Left Image Section */}
      <div className="relative w-full md:w-[45%] h-60 md:h-full overflow-hidden rounded-l-3xl">
          <Link href={`/properties/${project.slug}`}>
        <img
          src={project.mainImage}
          className="w-full h-full object-cover"
          alt={project.projectName}
        />
        </Link>
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[80%]">


          {project.tags
            ?.filter((tag) => tag !== "RERA Verified")
            .map((tag) => (
              <span
                key={tag}
                className={`px-2.5 py-0.5 rounded-full text-[8px] font-medium text-white ${categoryColors[tag] || "text-gray-600 bg-gray-100"
                  }`}
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
          <div className="absolute bottom-3 left-3 bg-[#DBFCE7] px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[8px] text-[#009318] font-medium border border-green-200">
            RERA Verified
          </div>
        )}
      </div>

      {/* Right Content Section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-black">
              {project.projectName} <span className="ml-1 font-normal text-sm">({project.reraNumber})</span>
            </h3>
            <p className="text-sm text-black mb-2">by {project.builderName}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-[#1447EA] ">{project.pricing?.displayPrice}</p>
            <span className="ml-2 font-normal text-sm text-black">onwards</span>
          </div>
        </div>

        {/* Specs List */}
        <div className="mt-4 space-y-2">
          <p className="flex items-center gap-2 text-sm text-black">
            <MapPin size={14} className="text-black" /> {project.address?.area}, {project.address?.city}
          </p>
          <p className="flex items-center gap-2 text-sm text-black">
            <Calendar size={14} className="text-black" /> Possession: {project.possessionDate}
          </p>
          <p className="flex items-center gap-2 text-sm text-black">
            <Home size={14} className="text-black" /> {project.configuration?.join(", ")}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-2">
            <span>Construction</span>
            <span>{project.constructionProgress}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-1000"
              style={{ width: `${project.constructionProgress}%` }}
            />
          </div>
        </div>
        {/* {/* {project.amenities?.length > 0 && (
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
        )} */}
     
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

              const companyPhoneNumber = "919284429197";
              const message = "Share Project Details";

              const encodedMessage = encodeURIComponent(message);
              window.open(`https://wa.me/${companyPhoneNumber}?text=${encodedMessage}`, '_blank');
            }}
            className="flex-1 px-3 sm:px-4 py-2 bg-white text-black rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition border border-black shadow-sm whitespace-nowrap text-cente hover:cursor-pointer"
          >
            <BsWhatsapp size={16} className="text-[#25D366]" />
            Live Chat
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}