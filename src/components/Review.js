"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  const cardsPerPage = 3;

  useEffect(() => {
    fetch("/api/reviews?showOn=homepage")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
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

  const visibleReviews = reviews.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading Reviews...
      </div>
    );
  }

  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header + Arrows */}
        
        {/* Reviews */}
        {visibleReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {visibleReviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            No reviews to display yet.
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 mt-4 ">
          

          {reviews.length > cardsPerPage && (
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className={`w-12 h-12 rounded-full border flex items-center justify-center  transition ${
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
          )}
        </div>

    </section>
  );
}