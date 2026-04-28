"use client";
import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { toast } from "react-toastify";
export default function EditReviewModal({
  isOpen,
  onClose,
  onRefresh,
  review,
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    reviewText: "",
    rating: 5,
    googleLink: "",
    showOnHomepage: false,
    showOnAboutUs: false,
  });

  // ✅ Prefill data when modal opens
  useEffect(() => {
    if (isOpen && review) {
      setFormData({
        customerName: review.customerName || "",
        reviewText: review.reviewText || "",
        rating: review.rating || 5,
        googleLink: review.googleLink || "",
        showOnHomepage: review.showOnHomepage || false,
        showOnAboutUs: review.showOnAboutUs || false,
      });
    }
  }, [isOpen, review]);

  // ✅ Update API
const handleUpdate = async (e) => {
  e.preventDefault();

  if (!review?._id) return;

  try {
    const res = await fetch(`/api/reviews/${review._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Update failed");
    }

    toast.success("Review updated successfully ✅");

    onRefresh?.();
    onClose();
  } catch (error) {
    console.error("Update failed:", error);
    toast.error(error.message || "Something went wrong ❌");
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleUpdate}
        className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4 text-black">
          <h2 className="text-xl font-bold">Edit Google Review</h2>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* NAME */}
        <input
          value={formData.customerName}
          placeholder="Customer Name"
          className="w-full p-3 border rounded-xl text-black"
          onChange={(e) =>
            setFormData({ ...formData, customerName: e.target.value })
          }
        />

        {/* REVIEW */}
        <textarea
          value={formData.reviewText}
          placeholder="Review Text"
          rows="3"
          className="w-full p-3 border rounded-xl text-black"
          onChange={(e) =>
            setFormData({ ...formData, reviewText: e.target.value })
          }
        />

        {/* ⭐ RATING */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`cursor-pointer ${
                formData.rating >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() =>
                setFormData({ ...formData, rating: star })
              }
            />
          ))}
        </div>

        {/* GOOGLE LINK */}
        <input
          value={formData.googleLink}
          placeholder="Google Link"
          className="w-full p-3 border rounded-xl text-black"
          onChange={(e) =>
            setFormData({ ...formData, googleLink: e.target.value })
          }
        />

        {/* CHECKBOXES */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-black">
            <input
              type="checkbox"
              checked={formData.showOnHomepage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  showOnHomepage: e.target.checked,
                })
              }
            />
            Show on Homepage
          </label>

          <label className="flex items-center gap-2 text-black">
            <input
              type="checkbox"
              checked={formData.showOnAboutUs}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  showOnAboutUs: e.target.checked,
                })
              }
            />
            Show on About Us
          </label>
        </div>

        {/* BUTTON */}
        <button className="w-full bg-[#742E85] text-white py-3 rounded-xl font-bold hover:opacity-90">
          Update Review
        </button>
      </form>
    </div>
  );
}