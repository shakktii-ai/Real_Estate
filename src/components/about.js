"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export default function About() {
  const [reviews, setReviews] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [expandedVideo, setExpandedVideo] = useState(null);
  const cardsPerPage = 1;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleNext = () => {
    if (startIndex + cardsPerPage < reviews.length) {
      setStartIndex(startIndex + cardsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - cardsPerPage >= 0) {
      setStartIndex(startIndex - cardsPerPage);
    }
  };

  const isVideo = (url) =>
    url && (url.includes(".mp4") || url.includes("video/upload"));

  const visibleReviews = reviews.slice(startIndex, startIndex + cardsPerPage);

  return (
    <section className="px-6 py-20 lg:px-16">
      <h2 className="text-4xl lg:text-[40px] font-bold text-[#E5097F] mb-12">
        What They <br /> Say About Us
      </h2>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-8">
          {visibleReviews.map((review) => (
            <div
              key={review._id}
              className="bg-[#F4F4F4] p-6 md:p-8 rounded-[21px] flex flex-col md:flex-row gap-8 md:gap-12 items-center shadow-[4px_4px_7.3px_rgba(0,0,0,0.15)] w-full min-h-[305px]"
            >
              {/* Left Panel: Video or Avatar */}
              {review.videoUrl ? (
                <div className="relative w-full md:w-[362px] h-[200px] md:h-[259px] rounded-[21px] flex-shrink-0 overflow-hidden group bg-black">
                  {isVideo(review.videoUrl) ? (
                    <video
                      src={review.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <Image
                      src={review.videoUrl}
                      alt={review.customerName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 362px"
                    />
                  )}
                  {/* Enlarge Button */}
                  <button
                    onClick={() => setExpandedVideo(review.videoUrl)}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Enlarge"
                  >
                    <Maximize2 size={18} />
                  </button>
                </div>
              ) : (
                /* Gmail-style circular avatar */
                <div className="w-[150px] h-[150px] md:w-[220px] md:h-[220px] rounded-full flex-shrink-0 bg-gradient-to-br from-[#CCA4D6] to-[#742E85] flex items-center justify-center shadow-lg">
                  <span className="text-white text-4xl md:text-7xl font-bold uppercase">
                    {review.customerName?.charAt(0)}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 text-black font-roboto-condensed w-full">
                <div className="text-[#742E85] text-5xl h-8">"</div>
                <p className="text-sm md:text-md leading-relaxed mb-3">{review.reviewText}</p>
                <div className="mb-4 text-yellow-500 text-xl flex gap-1">
                  {"★".repeat(review.rating || 5)}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#CCA4D6] to-[#742E85] flex items-center justify-center text-white font-bold uppercase text-xs md:text-sm">
                    {review.customerName?.charAt(0)}
                  </div>
                  <span className="text-sm md:text-md font-bold text-black uppercase tracking-wider">
                    by {review.customerName}
                  </span>
                  {review.googleLink && (
                    <a
                      href={review.googleLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#742E85] underline ml-auto md:ml-2"
                    >
                      View on Google
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Buttons - Now positioned below */}
          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition ${
                startIndex === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white hover:cursor-pointer shadow-sm"
              }`}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex + cardsPerPage >= reviews.length}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition ${
                startIndex + cardsPerPage >= reviews.length
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white hover:cursor-pointer shadow-sm"
              }`}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {expandedVideo && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setExpandedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedVideo(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
            >
              <X size={22} />
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
                  alt="Enlarged media"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}