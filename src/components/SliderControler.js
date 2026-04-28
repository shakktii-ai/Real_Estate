"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SliderControls({
  totalItems,
  startIndex,
  setStartIndex,
  itemsPerPage = 1,
}) {
  const handleNext = () => {
    if (startIndex + itemsPerPage < totalItems) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + itemsPerPage >= totalItems;

  return (
    <div className="flex justify-center p-2 gap-3 mt-6">
      <button
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className={`w-12 h-12 rounded-full border flex items-center justify-center transition ${
          isPrevDisabled
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white cursor-pointer"
        }`}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`w-12 h-12 rounded-full border flex items-center justify-center transition ${
          isNextDisabled
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-[#742E85] text-[#742E85] hover:bg-[#742E85] hover:text-white cursor-pointer"
        }`}
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}