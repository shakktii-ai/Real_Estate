"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Link2, Link2Icon } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { toast } from "react-toastify";
import { BsTwitterX } from "react-icons/bs";

export default function ShareProject({ project,showText = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const projectUrl = `${process.env.NEXT_PUBLIC_HOST}/properties/${project.slug}`;
  
  // Custom pre-formatted message (Great for WhatsApp & Copying)
  const shareMessage = `${project.projectName} By ${project.builderName}
-Location
${project.address?.area}, ${project.address?.city}
-Apartments
${project.configuration?.join(", ")}
-Pricing
${project.pricing?.displayPrice}
-Possession
RERA Possession - ${project.reraPossessionDate || project.possessionDate}
For more details including -
• Book Site Visit.
• Book Virtual Tour.
• Brochure.
- Visit
${projectUrl}`;

  const copyProject = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      toast.success("Project details copied!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy details.");
    }
    setOpen(false);
  };

  const shareWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank");
    setOpen(false);
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`, "_blank");
    setOpen(false);
  };

  const shareTwitter = () => {
    // Twitter works best with a concise summary text + the URL
    const tweetText = `${project.projectName} by ${project.builderName} in ${project.address?.city}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(projectUrl)}`, "_blank");
    setOpen(false);
  };

  const shareInstagram = async () => {
    // Direct link sharing isn't supported by Instagram's API. 
    // Best UX is copying the details to clipboard and informing the user.
    try {
      await navigator.clipboard.writeText(shareMessage);
      toast.info("Details copied! Open Instagram to share in Stories or DMs.");
    } catch (err) {
      console.error(err);
    }
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Share Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        // If showText is true: rectangular with text padding. If false: a clean square/circle wrapper for the icon.
        className={
          showText
            ? "flex items-center gap-2 px-4 py-2 border bg-white rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 text-gray-700 transition hover:cursor-pointer"
            : "flex items-center justify-center p-1.5  bg-white/50 rounded-full hover:bg-gray-50 text-gray-700 transition hover:cursor-pointer mt-2.5 z-[99999]"
        }
        title={!showText ? "Share project" : undefined}
      >
        <Share2 size={showText ? 16 : 12} />
        {showText && <span>Share</span>}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 text-[12px] rounded-md bg-white border border-gray-200 z-50">
          
          {/* Clipboard */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              copyProject();
            }}
            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-200 transition text-left"
          >
            
            <Link2Icon size={18} />
            <span>Copy</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              shareWhatsapp();
            }}
            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-200 transition text-left"
          >
            <FaWhatsapp size={18}  />
            <span>WhatsApp</span>
          </button>

          {/* Facebook */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              shareFacebook();
            }}
            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-200 transition text-left"
          >
            <FaFacebook size={15}  />
            <span>Facebook</span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              shareTwitter();
            }}
            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-200 transition text-left"
          >
           
            <BsTwitterX size={15}  />
            <span>Twitter</span>
          </button>

          

        </div>
      )}
    </div>
  );
}