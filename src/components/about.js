"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function About() {
  const [reviews, setReviews] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 1; // Set to 1 to match your current single-card design

  // Fetch data on component load
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/testimonials"); // Ensure this matches your API route
        const data = await res.json();
        setReviews(data);
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

  const visibleReviews = reviews.slice(startIndex, startIndex + cardsPerPage);

  return (
    <section className="px-6 py-20 lg:px-16">
      <h2 className="text-4xl lg:text-[40px] font-bold text-[#E5097F] mb-12">
        What They <br /> Say About Us
      </h2>
      
      <div className="relative max-w-6xl mx-auto items-center gap-6">
        {/* Dynamic Mapping starts here */}
        {visibleReviews.map((review) => (
          <div key={review._id} className="bg-[#F4F4F4] p-6 rounded-[21px] flex-1 flex flex-col md:flex-row gap-12 items-center border shadow-md">
            <div className="w-[362px] h-[259px] rounded-[21px] flex-shrink-0 overflow-hidden relative">
  {/* Check if the URL contains a video extension (like .mp4) */}
  {review.videoUrl && (review.videoUrl.includes('.mp4') || review.videoUrl.includes('video/upload')) ? (
    <video
      src={review.videoUrl}
      className="w-full h-full object-cover"
      controls
    />
  ) : (
    <Image
      src={review.videoUrl || "/rectangle-4854.png"}
      alt={review.customerName}
      fill
      className="object-cover"
      sizes="362px"
    />
  )}
</div>
            <div className="flex-1 text-black font-roboto-condensed">
              <div className="text-[#742E85] text-5xl ">“</div>
              <p className="text-md leading-relaxed mb-1 ">
                {review.reviewText}
              </p>
              <div className="mb-4 text-yellow-500 text-xl flex gap-1">
                {"★".repeat(review.rating || 5)}
              </div>
              <span className="text-md font-bold text-black uppercase tracking-wider block">
                by {review.customerName}
              </span>
            </div>
          </div>
        ))}
        {/* End of Map */}

        <div className="flex justify-center p-2 gap-3 mt-6">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition ${
              startIndex === 0
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white hover:cursor-pointer"
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
                : "border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white hover:cursor-pointer"
            }`}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}