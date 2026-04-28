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
        const res = await fetch("/api/testimonials", {
            method: "POST",
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            toast.success("Testimonial Added!");
            onRefresh();
            onClose();
        } else {
            toast.error("Error Adding Testimonial")
        }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            {/* 1. Added flex flex-col here to manage internal layout */}
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-xl">

                {/* Header - Stays fixed at the top */}
                <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
                    <h2 className="text-xl font-bold text-black">Add New Testimonial</h2>
                    <button onClick={onClose} className="text-black hover:text-black cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                {/* 2. Content Form - flex-1 and overflow-y-auto makes it scroll internally */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-black">
                    <label>Customer Name</label>
                    <input
                        placeholder="Customer Name"
                        className="w-full p-3 border border-gray-200 rounded-lg"
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />

                    <label>Reviews</label>
                    <textarea
                        placeholder="Review text"
                        className="w-full p-3 border border-gray-200 rounded-lg h-24"
                        onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    />

                    <label className="mb-2">Rating</label>
                    <div className="flex gap-2 border border-gray-200 p-2 rounded">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star
                                key={star}
                                className={`cursor-pointer ${formData.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                onClick={() => setFormData({ ...formData, rating: star })}
                            />
                        ))}
                    </div>

                    <label>Upload Video</label>
                   <CldUploadWidget
  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
  onSuccess={(result) => {
    // result.info.secure_url is what you want
    setFormData({ ...formData, videoUrl: result.info.secure_url });
  }}
  options={{
    sources: ["local"], // Only allow user to upload from their computer
    multiple: false,    // Prevent uploading more than one file
    maxFiles: 1,
    clientAllowedFormats: ["mp4", "jpg", "png"], // UI-level restriction
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
        complete: "#22c55e", // Green checkmark
        error: "#ef4444",
      },
    },
  }}
>
  {({ open, isLoading }) => (
    <button
      type="button" // Important: prevents form submission when clicking upload
      onClick={() => open()}
      disabled={isLoading} // Prevent clicking while loading
      className="w-full border-2 border-dashed border-gray-200 p-6 rounded-lg text-gray-500 hover:border-[#742E85] transition-colors"
    >
      {isLoading ? "Uploading..." : formData.videoUrl ? "Video Uploaded ✅" : "Click to Upload"}
    </button>
  )}
</CldUploadWidget>

                    <div className="flex justify-start gap-4">
                        <div className="flex justify-between gap-2"> 
                            <span>Show on Homepage</span>
                            <input
                                type="checkbox"
                                onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                            />
                        </div>
                        <div className="flex justify-between gap-2">
                            <span>Show on Aboutpage</span>
                            <input
                                type="checkbox"
                                onChange={(e) => setFormData({ ...formData, showOnAboutUs: e.target.checked })}
                            />
                        </div>
                    </div>

                    {/* Submit button stays visible at the bottom of the scroll area */}
                    <button type="submit" className="w-full py-3 bg-[#742E85] text-white rounded-lg">
                        Add Testimonial
                    </button>
                </form>
            </div>
        </div>);
}