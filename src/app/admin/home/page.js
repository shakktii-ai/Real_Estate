"use client";
import { useState, useEffect } from 'react';
import LivingStyleCard from '@/components/admin/LivingStyleCard';
import AddCardModal from '@/components/admin/AddCardModal';
import AddReviewModal from '@/components/admin/AddReviewModal';
import AddTestimonialModal from '@/components/admin/AddTestimonialModal'
import EditTestimonialModal from '@/components/admin/EditTestimonialModal';
import EditLivingStyleModal from "@/components/admin/EditLivingStyleModal";
import Review from '@/components/admin/ReviewAdmin';
import { ChevronLeft, ChevronRight, Edit, Trash2, Pencil } from "lucide-react";
import SliderControls from "@/components/SliderControler";
import { toast } from 'react-toastify';
import Image from "next/image";
export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [editData, setEditData] = useState(null);


  const openEditModal = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsEditModalOpen(true);
  };
  const fetchCards = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/living-styles");
      const data = await res.json();

      setCards(data);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/testimonials"); // Ensure this matches your API route
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this card?")) return;

    try {
      const res = await fetch(`/api/living-styles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Card deleted successfully ✅");

      fetchCards(); // refresh list
    } catch (error) {
      toast.error("Failed to delete ❌");
      console.error(error);
    }
  };
  const handleTestimonialDelete = async (id) => {
    if (!confirm("Delete this card?")) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Deleted successfully ✅");

      fetchCards(); // refresh list
    } catch (error) {
      toast.error("Failed to delete ");
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCards();
    fetchReviews();
  }, []);
  const [reviews, setReviews] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 1; // Set to 1 to match your current single-card design

  // Fetch data on component load

  const cardPerPage = 3;

  const visibleCards = cards.slice(
    cardIndex,
    cardIndex + cardPerPage
  );

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
  if (loading) return <div>Loading Styles...</div>;

  return (
    <div className=" bg-[#F8F9FA] min-h-screen ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Home Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#742E85] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold"
        >
          Add New Card
        </button>
      </div>
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchCards}
      />

      <section className="max-w-7xl mx-auto px-2 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCards.map((card) => (
            <div key={card._id} className='flex justify-center items-center flex-col bg-white p-2 rounded-[24px] border shadow-md'>
              <LivingStyleCard key={card._id} card={card} />
              <div className="flex items-center gap-2  p-3">

                <button
                  onClick={() => setEditData(card)}
                  className="w-12 h-10 flex items-center justify-center border border-black rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <Edit size={16} className='text-black' />
                </button>

                <button
                  onClick={() => handleDelete(card._id)}
                  className="w-12 h-10 flex items-center justify-center border border-black rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <Trash2 size={24} />
                </button>

              </div>
            </div>
          ))}
        </div>
        <SliderControls
          totalItems={cards.length}
          startIndex={cardIndex}
          setStartIndex={setCardIndex}
          itemsPerPage={cardPerPage}
        />
        <EditLivingStyleModal
          isOpen={!!editData}
          card={editData}
          onClose={() => setEditData(null)}
          onRefresh={fetchCards}
        />
      </section>
      <section className="p-4 border shadow-md rounded-md mb-4">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Testimonial Management
          </h1>

          <button
            onClick={() => setIsTestModalOpen(true)}
            className="bg-[#742E85] text-white px-4 sm:px-5 py-2 rounded-lg sm:rounded-xl flex items-center gap-2 font-medium hover:opacity-90 transition"
          >
            Add Testimonial
          </button>
        </div>

        <div className="max-w-6xl mx-auto">

          {/* CARDS */}
          <div className="flex flex-col gap-6">
            {visibleReviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#F4F4F4] p-4 sm:p-6 rounded-2xl flex flex-col lg:flex-row gap-6 lg:gap-10 items-center border shadow-md"
              >

                {/* MEDIA */}
                <div className="w-full lg:w-[360px] h-[200px] sm:h-[260px] rounded-xl overflow-hidden relative shrink-0">
                  {review.videoUrl &&
                    (review.videoUrl.includes(".mp4") ||
                      review.videoUrl.includes("video/upload")) ? (
                    <video
                      src={review.videoUrl}
                      className="w-full h-full object-cover rounded-xl"
                      controls
                    />
                  ) : (
                    <Image
                      src={review.videoUrl || "/rectangle-4854.png"}
                      alt={review.customerName}
                      fill
                      className="object-cover rounded-xl"
                    />
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 text-black text-center lg:text-left">
                  <div className="text-[#742E85] text-3xl sm:text-5xl">“</div>

                  <p className="text-sm sm:text-base leading-relaxed mb-2">
                    {review.reviewText}
                  </p>

                  <div className="mb-3 text-yellow-500 text-lg flex justify-center lg:justify-start gap-1">
                    {"★".repeat(review.rating || 5)}
                  </div>

                  <span className="text-sm font-bold uppercase tracking-wide block">
                    by {review.customerName}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex  gap-3">
                  <button
                    onClick={() => openEditModal(review)}
                    className="p-2 border rounded-lg text-black hover:bg-gray-100 transition"
                  >
                    <Edit size={20} />
                  </button>

                  <button
                    onClick={() => handleTestimonialDelete(review._id)}
                    className="p-2 border rounded-lg text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CONTROLS */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition ${startIndex === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white"
                }`}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              disabled={startIndex + cardsPerPage >= reviews.length}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition ${startIndex + cardsPerPage >= reviews.length
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white"
                }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>
      <AddTestimonialModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onRefresh={fetchReviews}
      />
      <EditTestimonialModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentTestimonial(null); // Clear state on close
        }}
        onRefresh={fetchReviews} // Your existing fetch function
        testimonial={currentTestimonial}
      />
      <section className='p-4 border shadow-md rounded-md'>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl text-gray-800">Google Review</h1>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-[#742E85] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:cursor-pointer"
          >
            Add Google reviews
          </button>
        </div>
        <AddReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onRefresh={fetchCards}
        />
        <Review />
      </section>
    </div>
  );
}