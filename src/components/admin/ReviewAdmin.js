"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCards from "@/components/admin/ReviewCardAdmin";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    const updateCardsPerPage = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(1); // mobile
      } else {
        setCardsPerPage(3); // tablet/desktop
      }
    };

    updateCardsPerPage();

    window.addEventListener("resize", updateCardsPerPage);

    return () => {
      window.removeEventListener("resize", updateCardsPerPage);
    };
  }, []);

 const fetchReviews = async () => {
  try {
    const res = await fetch("/api/reviews?showOn=homepage");
    const data = await res.json();
    setReviews(data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchReviews();
  setLoading(false);
}, []);
const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this review?")) return;

  await fetch(`/api/reviews/${id}`, {
    method: "DELETE",
  });

  fetchReviews(); // refresh UI
};

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
    <section className="py-2 px-2 md:px-6">
      <div className="max-w-7xl mx-auto">
        {visibleReviews.length > 0 ? (
          <div
            className={`grid gap-6 ${
              cardsPerPage === 1
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            {visibleReviews.map((review) => (
              <ReviewCards key={review._id} review={review}  onDelete={handleDelete}
    onRefresh={fetchReviews}/>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            No reviews to display yet.
          </div>
        )}

        {reviews.length > cardsPerPage && (
          <div className="flex items-center justify-center gap-3 mt-8">
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