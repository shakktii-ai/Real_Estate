"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

// components/HeartButton.jsx (Assuming this is your file)
export default function HeartButton({ propertyId, userId, initialIsWishlisted, onToggle }) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);

  useEffect(() => {
    setIsWishlisted(initialIsWishlisted);
  }, [initialIsWishlisted]);

  const toggleWishlist = async () => {
    const previousState = isWishlisted;
    const newState = !isWishlisted;
    
    // 1. Optimistic Update
    setIsWishlisted(newState);
    if (onToggle) onToggle(propertyId, newState); // Notify parent

    try {
      const response = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, propertyId }),
      });

      if (!response.ok) throw new Error("Failed");
    } catch (error) {
      console.error("Error:", error);
      // 2. Rollback
      setIsWishlisted(previousState);
      if (onToggle) onToggle(propertyId, previousState); 
    }
  };

  return (
    <button onClick={toggleWishlist} className="p-2 transition-colors">
      <Heart
        size={24}
        className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
      />
    </button>
  );
}