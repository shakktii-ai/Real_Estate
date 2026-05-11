import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';

export default function MapModal({ isOpen, onClose, locationName, address, iframeSrc }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
          {/* 1. Animated Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* 2. Responsive Modal Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-4xl h-[80vh] md:h-[75vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header Section */}
            <div className="p-4 md:px-6 flex justify-between items-center bg-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-[#742E85]/10 p-2 rounded-full">
                  <MapPin className="text-[#742E85]" size={20} />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-gray-900 text-sm md:text-lg truncate">{locationName}</h3>
                  <p className="text-[11px] md:text-xs text-gray-500 truncate">{address}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X size={22} className="text-gray-400" />
              </button>
            </div>

            {/* 3. Map Content Area */}
            <div className="flex-grow relative bg-gray-50">
              {/* Simple Loading Skeleton */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 animate-pulse">
                  <div className="w-10 h-10 border-4 border-[#742E85]/20 border-t-[#742E85] rounded-full animate-spin" />
                  <p className="mt-4 text-xs text-gray-400 font-medium">Loading Map...</p>
                </div>
              )}

              {/* Your Iframe Hook */}
              <iframe
                src={iframeSrc} 
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setIsLoading(false)}
                className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>
            
            {/* Footer Action */}
           
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}