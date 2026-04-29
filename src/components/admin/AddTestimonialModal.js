"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Star, X } from "lucide-react";
import { toast } from "react-toastify";

export default function TestimonialModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    customerName: "",
    reviewText: "",
    rating: 5,
    videoUrl: "",
    showOnHomepage: false,
    showOnAboutUs: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Testimonial Added!");
        onRefresh();
        onClose();
        // Reset form
        setFormData({
          customerName: "",
          reviewText: "",
          rating: 5,
          videoUrl: "",
          showOnHomepage: false,
          showOnAboutUs: false,
        });
      } else {
        const errorData = await res.json();
        console.error("Server Error:", errorData);
        toast.error(`Error: ${errorData.details || "Failed to add testimonial"}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-bold text-black">Add New Testimonial</h2>
          <button onClick={onClose} className="text-black hover:text-black cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-black">
          <div>
            <label className="block mb-2 font-medium">Customer Name</label>
            <input
              placeholder="Customer Name"
              value={formData.customerName}
              className="w-full p-3 border border-gray-200 rounded-lg"
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Reviews</label>
            <textarea
              placeholder="Review text"
              value={formData.reviewText}
              className="w-full p-3 border border-gray-200 rounded-lg h-24"
              onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Rating</label>
            <div className="flex gap-2 border border-gray-200 p-2 rounded">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`cursor-pointer ${formData.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Upload Video</label>
          <div className="relative">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result) => {
                setFormData((prev) => ({ ...prev, videoUrl: result.info.secure_url }));
              }}
              options={{
                sources: ["local"],
                multiple: false,
                maxFiles: 1,
                clientAllowedFormats: ["mp4", "webm", "mov", "jpg", "png"],
                resourceType: "auto",
                styles: {
                  palette: {
                    window: "#FFFFFF",
                    sourceBg: "#F4F4F4",
                    windowBorder: "#742E85",
                    tabIcon: "#742E85",
                    inactiveTabIcon: "#999",
                    menuIcons: "#742E85",
                    link: "#742E85",
                    action: "#742E85",
                    inProgress: "#742E85",
                    complete: "#22c55e",
                    error: "#ef4444",
                  },
                },
              }}
            >
              {({ open, isLoading }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  disabled={isLoading}
                  className="w-full border-2 border-dashed border-gray-200 p-6 rounded-lg text-gray-500 hover:border-[#742E85] transition-colors"
                >
                  {isLoading ? "Uploading..." : formData.videoUrl ? "Video Uploaded ✅" : "Click to Upload"}
                </button>
              )}
            </CldUploadWidget>
            {formData.videoUrl && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, videoUrl: "" }))}
                className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors z-10"
                title="Remove Video"
              >
                <X size={16} />
              </button>
            )}
          </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Show on Homepage</span>
              <input
                type="checkbox"
                checked={formData.showOnHomepage}
                onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                className="w-5 h-5 accent-[#742E85]"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Show on About Us Page</span>
              <input
                type="checkbox"
                checked={formData.showOnAboutUs}
                onChange={(e) => setFormData({ ...formData, showOnAboutUs: e.target.checked })}
                className="w-5 h-5 accent-[#742E85]"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-[#742E85] text-white rounded-lg font-bold hover:bg-[#5a2468] transition-colors">
            Add Testimonial
          </button>
        </form>
      </div>
    </div>
  );
}