import { Star, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewCard({ review }) {
  const [isOpen, setIsOpen] = useState(false);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [{ label: "year", seconds: 31536000 }, { label: "month", seconds: 2592000 }, { label: "day", seconds: 86400 }];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
    return "Recently";
  };

  return (
    <>
      <div className="bg-white text-black rounded-xl border border-gray-200 p-3.5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full min-h-[190px] relative">
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
              {review.customerName?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-[12px] leading-tight">{review.customerName}</h3>
              <p className="text-[10px] text-gray-400">{getTimeAgo(review.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className={i < review.rating ? "fill-[#FBBC05] text-[#FBBC05]" : "text-gray-200"} />
          ))}
        </div>
      
        <div className="flex-grow">
          <p className="text-gray-700 text-[11px] leading-relaxed line-clamp-4">
            {review.reviewText}
          </p>
          {review.reviewText?.length > 100 && (
            <button 
              onClick={() => setIsOpen(true)}
              className="text-[#4285F4] text-[10px] font-semibold mt-1.5 hover:underline"
            >
              Read more
            </button>
          )}
        </div>
      </div>

      {/* --- HOUSIEY STYLE MODAL OVERLAY --- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 md:p-8"
            >
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#D9D9D9] flex items-center justify-center text-black font-bold text-2xl">
                  {review.customerName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{review.customerName}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#FBBC05]">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-current" />)}
                    </div>
                    <span className="text-gray-400 text-sm">• {getTimeAgo(review.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {review.reviewText}
                </p>
              </div>

            
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}