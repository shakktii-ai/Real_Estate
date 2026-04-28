"use client";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { useAuth } from "@/lib/context/AuthContext"; // Ensure this matches your Auth setup

export default function WishlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`/api/wishlist/get?userId=${user.uid}`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  if (loading) return <div>Loading your favorites...</div>;
console.log("Current value of items:", items);
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#742E85]">My Wishlist</h1>
      
      {items.length === 0 ? (
        <p className="text-gray-500">No properties in your wishlist yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            // item.propertyId holds the full property object because of .populate()
            <PropertyCard key={item._id} project={item.propertyId} isWishlisted={true}/>
          ))}
        </div>
      )}
    </div>
  );
}