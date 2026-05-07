import React from 'react';

export default function TourSelectionModal({ isOpen, onClose, onSelectSiteVisit, onSelectVirtualTour }) {
  if (!isOpen) return null;

  return (
    // Fixed layout coverage fix
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 w-screen h-screen top-0 left-0">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 relative z-[10001]">
        <div className="flex items-start justify-between mb-4 p-6 pb-0">
          <div>
            <h3 className="text-lg font-semibold text-black">Choose Tour Type</h3>
            <p className="text-sm text-gray-500 mt-1">Select the booking option you want for this property.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl leading-none px-2 py-1"
          >
            ×
          </button>
        </div>

        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectSiteVisit();
            }}
            className="w-full mb-3 rounded-xl bg-[#742E85] text-white py-3 text-sm font-semibold hover:bg-[#5f256d] transition"
          >
            Book Site Visit
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectVirtualTour();
            }}
            className="w-full rounded-xl border border-[#742E85] text-[#742E85] py-3 text-sm font-semibold hover:bg-[#742E85] hover:text-white transition"
          >
            Book Virtual Tour
          </button>
        </div>
      </div>
    </div>
  );
}