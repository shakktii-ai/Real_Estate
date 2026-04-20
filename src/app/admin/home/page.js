"use client";
import { useState, useEffect } from 'react';
import LivingStyleCard from '@/components/admin/LivingStyleCard';
import AddCardModal from '@/components/admin/AddCardModal';
import AddReviewModal from '@/components/admin/AddReviewModal';
import Review from '@/components/Review';
export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen,setIsReviewModalOpen] = useState(false);
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

useEffect(() => {
  fetchCards();
}, []);
 
  if (loading) return <div>Loading Styles...</div>;

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen md:ml-64">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-28">
          {cards.map((card) => (
            <LivingStyleCard key={card._id} card={card} />
          ))}
        </div>
      </section>
      <section className='p-4 border shadow-md rounded-md'>
<div className="flex justify-between items-center mb-8">
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
      <Review/>
      </section>
    </div>
  );
}