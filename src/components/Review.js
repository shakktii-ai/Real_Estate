"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(5);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCardsPerPage = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(1); // mobile
      } else {
        setCardsPerPage(5); // desktop
      }
    };

    updateCardsPerPage();

    window.addEventListener("resize", updateCardsPerPage);

    return () => {
      window.removeEventListener("resize", updateCardsPerPage);
    };
  }, []);

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

  // Auto-scroll functionality
  useEffect(() => {
    if (reviews.length <= cardsPerPage || isHovering) return;

    const interval = setInterval(() => {
      setStartIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex + cardsPerPage > reviews.length) {
          return 0; // Loop back to start
        }
        return nextIndex;
      });
    }, 3000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [reviews.length, cardsPerPage, isHovering]);

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
      <div className="max-w-7xl mx-auto" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        {visibleReviews.length > 0 ? (
          <div
            className={`grid gap-6  ${
              cardsPerPage === 1
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5"
            }`}
          >
            {visibleReviews.map((review) => (
        
               <ReviewCard key={review._id} review={review} />
             
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            No reviews to display yet.
          </div>
        )}

        {reviews.length > cardsPerPage && (
          <div className="flex items-center justify-center gap-5 mt-8">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition ${
                startIndex === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white"
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
                  : "border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white"
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