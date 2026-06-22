"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Blog tips data with screenshots details mapped to images and content
const BLOG_TIPS = [
  {
    id: 1,
    image: "/Rectangle_5747_1.png",
    title: "Why NIBM Road is One of Pune's Most Preferred Residential Destinations in 2026",
    content: `**Primary Keywords:**
• NIBM Road Pune Property
• Buy Flat in NIBM Pune
• Luxury Apartments in NIBM
• NIBM Residential Projects
• NIBM Property Investment

**Secondary Keywords:**
• Premium Homes in Pune
• NIBM Road Real Estate
• Gated Communities in NIBM`
  },
  {
    id: 2,
    image: "/Rectangle_5747_2.png",
    title: "Undri vs NIBM: Which Area is Better for Home Buyers and Investors?",
    content: `**Primary Keywords:**
• Undri vs NIBM
• Property Investment in Undri
• Flats in Undri Pune
• NIBM Property Prices
• Best Area to Buy Property in Pune

**Search Intent:**
Comparison-driven buyers researching locations before purchase. Undri is often considered more affordable than NIBM while offering appreciation potential and growing social infrastructure.`
  },
  {
    id: 3,
    image: "/Rectangle_5747_3.png",
    title: "Top Reasons Families are Choosing Mohammadwadi for Their Dream Home",
    content: `**Primary Keywords:**
• Mohammadwadi Pune Property
• Flats in Mohammadwadi
• Residential Projects in Mohammadwadi
• Luxury Homes in Mohammadwadi

**Secondary Keywords:**
• Family-Friendly Areas in Pune
• Schools Near Mohammadwadi
• Premium Living in Pune`
  },
  {
    id: 4,
    image: "/Rectangle_5747_4.png",
    title: "NIBM Annexe: Pune's Emerging Luxury Residential Corridor",
    content: `**Primary Keywords:**
• NIBM Annexe Property
• NIBM Annexe Projects
• Luxury Flats in NIBM Annexe
• Premium Homes Pune

**Long-Tail Keywords:**
• Best Residential Projects in NIBM Annexe
• Future Growth of NIBM Annexe`
  },
  {
    id: 5,
    image: "/Rectangle_5747_5.png",
    title: "Is Handewadi the Next Real Estate Growth Hub of South Pune?",
    content: `**Primary Keywords:**
• Handewadi Pune Property
• Flats in Handewadi
• Property Investment in Handewadi
• Affordable Housing Pune

**Secondary Keywords:**
• South Pune Real Estate
• Handewadi Infrastructure Development
• Handewadi Property Appreciation`
  },
  {
    id: 6,
    image: "/Rectangle_5747_6.png",
    title: "Lullanagar Real Estate Guide: Premium Living in the Heart of Pune",
    content: `**Primary Keywords:**
• Lullanagar Pune Property
• Luxury Flats in Lullanagar
• Premium Residential Projects Pune
• Buy Home in Lullanagar

**SEO Focus:**
Luxury buyers, NRI buyers, and HNI investors.`
  },
  {
    id: 7,
    image: "/Rectangle_5747_7.png",
    title: "Property Appreciation Trends in NIBM, Undri and Mohammadwadi: Where Should You Invest?",
    content: `**Primary Keywords:**
• Property Appreciation Pune
• Pune Real Estate Investment
• Best Investment Areas in Pune
• NIBM vs Mohammadwadi

**Secondary Keywords:**
• Pune Property Market Trends
• ROI on Property in Pune`
  },
  {
    id: 8,
    image: "/Rectangle_5747_8.png",
    title: "Complete Home Buyer's Guide for South Pune: NIBM, Undri, Mohammadwadi and Handewadi",
    content: `**Primary Keywords:**
• Home Buying Guide Pune
• Property Buying Tips Pune
• Residential Property Pune
• Best Localities in South Pune

**High-Converting Keywords:**
• First-Time Home Buyer Pune
• Pune Property Consultant`
  },
  {
    id: 9,
    image: "/Rectangle_5747_9.png",
    title: "Upcoming Infrastructure Projects Boosting Property Prices in South Pune",
    content: `**Primary Keywords:**
• Pune Infrastructure Projects
• Property Price Growth Pune
• South Pune Development
• Pune Metro Impact on Property

**Description:**
Infrastructure improvements remain a major factor influencing real estate demand and price appreciation in Pune.`
  },
  {
    id: 10,
    image: "/Rectangle_5747_10.png",
    title: "Best Residential Projects Near NIBM and Undri for End Users and Investors",
    content: `**Primary Keywords:**
• Best Residential Projects Pune
• New Launch Projects in NIBM
• New Projects in Undri
• Luxury Apartments Pune

**Transactional Keywords:**
• Book Flat in Pune
• Ready Possession Flats Pune
• New Launch Properties Pune

**Highest Ranking SEO Keywords for Your Website:**
Focus on these keywords across blogs, landing pages, and FAQs:
• High Volume Keywords
• Local SEO Keywords
• Property in Pune / NIBM Pune
• Flats in Pune / Undri Pune
• Luxury Apartments Pune
• Flats in Mohammadwadi Pune
• Residential Projects Pune
• Property in Handewadi Pune
• New Launch Projects Pune
• Luxury Flats in Lullanagar
• Buy Flat in Pune
• NIBM Annexe Property
• Real Estate Investment Pune
• South Pune Property
• Premium Homes Pune
• Residential Projects NIBM
• Property Consultant Pune
• Buy Home in Undri
• Best Areas to Buy Property in Pune
• Mohammadwadi Real Estate

**Content Strategy for Maximum SEO Results:**
• 4 Location Guides (NIBM, Undri, Mohammadwadi, Handewadi)
• 2 Comparison Blogs (NIBM vs Undri, Undri vs Handewadi)
• 2 Investment Blogs
• 1 Infrastructure Blog
• 1 Buyer Guide`
  }
];

export default function About({ showOn }) {
  const [reviews, setReviews] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [expandedVideo, setExpandedVideo] = useState(null);

  // Blog section state variables
  const [blogIndex, setBlogIndex] = useState(0);
  const [isBlogHovering, setIsBlogHovering] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [slideDirection, setSlideDirection] = useState("up"); // Direction of scroll animation
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = showOn ? `/api/testimonials?showOn=${showOn}` : "/api/testimonials";
        const res = await fetch(url);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchReviews();
  }, [showOn]);

  // Blog auto-scrolling interval: scrolls every 3 seconds unless hovering or modal open
  useEffect(() => {
    if (isBlogHovering || selectedBlog) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSlideDirection("up");
      setBlogIndex((prev) => (prev + 1) % BLOG_TIPS.length);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBlogHovering, selectedBlog]);

  const handleNextReview = () => {
    if (reviews.length === 0) return;
    setStartIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrevReview = () => {
    if (reviews.length === 0) return;
    setStartIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleBlogNext = () => {
    setSlideDirection("up");
    setBlogIndex((prev) => (prev + 1) % BLOG_TIPS.length);
  };

  const handleBlogPrev = () => {
    setSlideDirection("down");
    setBlogIndex((prev) => (prev - 1 + BLOG_TIPS.length) % BLOG_TIPS.length);
  };

  const isVideo = (url) =>
    url && (url.includes(".mp4") || url.includes("video/upload"));

  // Formatter to render full content cleanly in modal popup
  const formatContent = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      if (line.trim().startsWith("**") && line.trim().endsWith("**")) {
        return (
          <h4 key={idx} className="font-bold text-[#742E85] text-md mt-4 mb-2 uppercase tracking-wide">
            {line.replace(/\*\*/g, "")}
          </h4>
        );
      }
      if (line.trim().startsWith("•")) {
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-gray-700 py-0.5">
            {line.replace(/•\s*/, "")}
          </li>
        );
      }
      if (line.trim() === "") return <div key={idx} className="h-2" />;
      return (
        <p key={idx} className="text-sm text-gray-600 leading-relaxed my-1">
          {line}
        </p>
      );
    });
  };

  const currentReview = reviews[startIndex];
  const currentBlog = BLOG_TIPS[blogIndex];

  // Framer Motion slide variants
  const slideVariants = {
    initial: (direction) => ({
      y: direction === "up" ? 40 : -40,
      opacity: 0
    }),
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: (direction) => ({
      y: direction === "up" ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" }
    })
  };

  return (
    <section className="px-6 py-10 lg:px-16 max-w-7xl mx-auto text-black font-roboto-condensed">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

        {/* ================= LEFT SECTION: WHAT THEY SAY ABOUT US ================= */}
        <div className="flex flex-col h-full justify-between">
          <div>
            <h2 className="text-md md:text-xl font-bold text-[#E5097F] mb-6">
              What They Say About Us
            </h2>

            {currentReview ? (
              <div className="bg-[#F4F4F4] p-5 md:p-6 rounded-[21px] flex flex-col md:flex-row gap-6 items-center shadow-[4px_4px_7.3px_rgba(0,0,0,0.15)] w-full min-h-[305px]">

                {/* Review Media Panel */}
                <div className="relative w-full md:w-[220px] h-[160px] md:h-[180px] rounded-[21px] flex-shrink-0 overflow-hidden group bg-white border border-gray-100 shadow-inner flex items-center justify-center">
                  {currentReview.videoUrl && isVideo(currentReview.videoUrl) ? (
                    <video
                      src={currentReview.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <Image
                      src={currentReview.videoUrl || "/piinggaksha.png"}
                      alt={currentReview.customerName}
                      fill
                      className={currentReview.videoUrl ? "object-cover" : "object-contain p-10"}
                      sizes="(max-width: 768px) 100vw, 220px"
                    />
                  )}
                  {currentReview.videoUrl && (
                    <button
                      onClick={() => setExpandedVideo(currentReview.videoUrl)}
                      className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Enlarge"
                    >
                      <Maximize2 size={16} />
                    </button>
                  )}
                </div>

                {/* Review Details */}
                <div className="flex-1 text-black w-full min-w-0">
                  <div className="text-[#742E85] text-4xl h-6 leading-none">“</div>
                  <p className="text-xs md:text-sm leading-relaxed mb-2 line-clamp-5">{currentReview.reviewText}</p>
                  <div className="mb-2 text-yellow-500 text-md flex gap-1">
                    {"★".repeat(currentReview.rating || 5)}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CCA4D6] to-[#742E85] flex items-center justify-center text-white font-bold uppercase text-xs">
                      {currentReview.customerName?.charAt(0)}
                    </div>
                    <span className="text-xs md:text-sm font-bold text-black uppercase tracking-wider truncate">
                      by {currentReview.customerName}
                    </span>
                    {currentReview.googleLink && (
                      <a
                        href={currentReview.googleLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#742E85] underline ml-auto"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#F4F4F4] rounded-[21px] flex items-center justify-center min-h-[305px] text-gray-400 text-sm shadow-[4px_4px_7.3px_rgba(0,0,0,0.15)]">
                No testimonials found.
              </div>
            )}
          </div>

          {/* Testimonials Pagination Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handlePrevReview}
              className="w-10 h-10 rounded-full border border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white flex items-center justify-center transition shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextReview}
              className="w-10 h-10 rounded-full border border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white flex items-center justify-center transition shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ================= RIGHT SECTION: BLOG TIPS ================= */}
        <div className="flex flex-col h-full justify-between"
          onMouseEnter={() => setIsBlogHovering(true)}
          onMouseLeave={() => setIsBlogHovering(false)}>
          <div>
            <h2 className="text-md md:text-xl font-bold text-[#E5097F] mb-6">
              Blog Tips
            </h2>

            <div className="bg-[#F4F4F4] p-5 md:p-6 rounded-[21px] shadow-[4px_4px_7.3px_rgba(0,0,0,0.15)] w-full min-h-[305px] overflow-hidden relative flex flex-col justify-center">
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  key={blogIndex}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col md:flex-row gap-6 items-center w-full h-full"
                >
                  {/* Blog Image */}
                  <div className="relative w-full md:w-[220px] h-[176px] rounded-[21px] flex-shrink-0 overflow-hidden bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                    <Image
                      src={currentBlog.image}
                      alt={currentBlog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 220px"
                    />
                  </div>

                  {/* Blog Summary Details */}
                  <div className="flex-1 text-black w-full min-w-0">
                    <div className="text-[#742E85] text-4xl h-6 leading-none">“</div>
                    <h3 className="font-bold text-[13px] md:text-[14px] text-slate-800 leading-snug mb-2 line-clamp-2">
                      {currentBlog.title}
                    </h3>

                    {/* Shortened preview of keywords or layout */}
                    <p className="text-[11px] md:text-[12px] text-gray-600 leading-relaxed mb-3 line-clamp-4 whitespace-pre-line">
                      {currentBlog.content.replace(/\*\*/g, "").replace(/•/g, "-")}
                    </p>

                    <div>
                      {currentBlog.content.length > 120 && (
                        <button
                          onClick={() => setSelectedBlog(currentBlog)}
                          className="text-[#E5097F] font-bold text-xs hover:underline cursor-pointer flex items-center gap-0.5 mt-2"
                        >
                          Read more
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Blog Pagination Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleBlogPrev}
              className="w-10 h-10 rounded-full border border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white flex items-center justify-center transition shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleBlogNext}
              className="w-10 h-10 rounded-full border border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white flex items-center justify-center transition shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>

      {/* ================= MODAL LIGHTBOX FOR TESTIMONIAL VIDEO ================= */}
      {expandedVideo && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setExpandedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedVideo(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            {isVideo(expandedVideo) ? (
              <video
                src={expandedVideo}
                className="w-full h-full max-h-[85vh] object-contain"
                controls
                autoPlay
              />
            ) : (
              <div className="relative w-full aspect-video">
                <Image
                  src={expandedVideo}
                  alt="Enlarged testimonial"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= POPUP MODAL FOR READ MORE BLOG DETAILS ================= */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
              initial={{ y: 20, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar / Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-[#F8F9FA]">
                <h3 className="font-bold text-sm text-[#742E85] tracking-wider uppercase">Blog Tip Detail</h3>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content Area */}
              <div className="p-6 overflow-y-auto flex flex-col gap-6">

                {/* Text Content */}
                <div>
                  <h2 className="text-md md:text-lg font-bold text-slate-900 leading-snug mb-4">
                    {selectedBlog.title}
                  </h2>
                  <div className="border-t border-gray-100 pt-4">
                    {formatContent(selectedBlog.content)}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}