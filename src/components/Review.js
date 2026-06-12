"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(5);
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
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

  useEffect(() => {
    if (reviews.length === 0 || isHovering) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviews.length, isHovering]);

  useEffect(() => {
    if (index >= reviews.length && reviews.length > 0) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 700); // matches duration-700
      return () => clearTimeout(timeout);
    }
  }, [index, reviews.length]);

  const handleNext = () => {
    setIsTransitioning(true);
    setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setIndex((prev) => (prev <= 0 ? reviews.length - 1 : prev - 1));
  };

  const getItemWidthClass = () => {
    if (itemsPerView === 1) return "w-full";
    if (itemsPerView === 2) return "w-1/2";
    if (itemsPerView === 3) return "w-1/3";
    if (itemsPerView === 4) return "w-1/4";
    return "w-1/5";
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading Reviews...
      </div>
    );
  }

  // To make the infinite loop seamless, we duplicate the array
  const displayReviews = [...reviews, ...reviews];

  return (
    <section className="py-4 px-4 md:px-6 overflow-hidden">
      <div 
        className="max-w-7xl mx-auto relative" 
        onMouseEnter={() => setIsHovering(true)} 
        onMouseLeave={() => setIsHovering(false)}
      >
        {reviews.length > 0 ? (
          <div className="overflow-hidden">
            <div
              className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
              style={{
                transform: `translateX(-${index * (100 / itemsPerView)}%)`,
              }}
            >
              {displayReviews.map((review, i) => (
                <div
                  key={`${review._id}-${i}`}
                  className={`flex-shrink-0 px-3 ${getItemWidthClass()}`}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            No reviews to display yet.
          </div>
        )}

        {reviews.length > itemsPerView && (
          <div className="flex items-center justify-center gap-5 mt-8">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border flex items-center justify-center transition border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border flex items-center justify-center transition border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}