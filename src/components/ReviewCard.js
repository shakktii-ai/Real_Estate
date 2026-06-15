import { Star, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function ReviewCard({ review, onOpen, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    onOpen?.();
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      onClose?.();
    };
  }, [isOpen, onOpen, onClose]);

  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
    return "Recently";
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const Modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0" onClick={closeModal} />

          <motion.div
            className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="px-6 py-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#D9D9D9] flex items-center justify-center text-black font-bold text-2xl">
                  {review.customerName?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{review.customerName}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <div className="flex text-[#FBBC05]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-current" />
                      ))}
                    </div>
                    <span>• {getTimeAgo(review.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="max-h-[70vh] overflow-y-auto pr-2 text-slate-700 text-base leading-relaxed whitespace-pre-line">
                {review.reviewText}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="bg-white text-black rounded-xl border border-gray-200 p-4 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl flex flex-col h-full min-h-[180px]">
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center text-black font-bold text-sm">
              {review.customerName?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-[13px] leading-tight">{review.customerName}</h3>
              <p className="text-[11px] text-gray-400">{getTimeAgo(review.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < review.rating ? "fill-[#FBBC05] text-[#FBBC05]" : "text-gray-200"} />
          ))}
        </div>

        <div className="flex-grow">
          <p className="text-gray-700 text-[12px] leading-relaxed line-clamp-4">{review.reviewText}</p>
          {review.reviewText?.length > 120 && (
            <button onClick={openModal} className="text-[#4285F4] text-[12px] font-semibold mt-2 hover:underline">Read more</button>
          )}
        </div>
      </div>

      {typeof document !== "undefined" ? createPortal(Modal, document.body) : null}
    </>
  );
}