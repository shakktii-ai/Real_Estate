import { useState, useEffect } from 'react';
import { Star, Pencil, Trash2 } from 'lucide-react';
import EditReviewModal from '@/components/admin/EditReviewModal';
export default function ReviewCard({ review, onDelete, onRefresh }) {
  const [editData, setEditData] = useState(null);
  const getTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);

    const seconds = Math.floor((now - created) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);

      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };
  return (
    <section className='bg-gray-100 p-2 m-2 rounded-xl border border-gray-200 shadow-md'>
      <div className="bg-white text-black rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center gap-4 bg-[#F4F4F4] px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-[#D9D9D9] flex items-center justify-center font-bold uppercase">
            {review.customerName?.charAt(0)}
          </div>

          <div>
            <h3 className="font-semibold text-sm">{review.customerName}</h3>
            <p className="text-xs text-gray-500">
              {review.reviewCount || "3 reviews"}
            </p>
          </div>
        </div>

        {/* RATING + TIME */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          <p className="text-xs text-gray-500">
            {getTimeAgo(review.createdAt)}
          </p>
        </div>

        {/* REVIEW TEXT */}
        <p className="text-sm text-gray-700 px-4 py-3 leading-relaxed">
          {review.reviewText}
        </p>

        {/* GOOGLE LINK */}
        <div className="px-4 pb-3">
          <a
            href={review.googleLink}
            target="_blank"
            className="text-[#1447EA] text-sm font-medium hover:underline flex items-center gap-1"
          >
            <span className="text-red-500 font-bold">G</span> View on Google
          </a>
        </div>



      </div>
      <div className="flex items-center gap-2  p-3">

        <button
          onClick={() => setEditData(review)}
          className="flex-1 flex items-center justify-center gap-2 border border-black text-black rounded-lg py-2 text-sm hover:bg-gray-100 transition"
        >
          <Pencil size={16} /> Edit
        </button>

        <button
          onClick={() => onDelete(review._id)}
          className="w-12 h-10 flex items-center justify-center border border-black rounded-lg text-red-500 hover:bg-red-50 transition"
        >
          <Trash2 size={24} />
        </button>

      </div>
      <EditReviewModal
        isOpen={!!editData}
        review={editData}
        onClose={() => setEditData(null)}
        onRefresh={onRefresh}
      />
    </section>
  );
}