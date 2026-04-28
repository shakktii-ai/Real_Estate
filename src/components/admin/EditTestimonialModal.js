"use client";
import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Star, X } from "lucide-react";

export default function EditTestimonialModal({ isOpen, onClose, onRefresh, testimonial }) {
    const [formData, setFormData] = useState({
        customerName: "",
        reviewText: "",
        rating: 5,
        videoUrl: "",
        showOnHomepage: false,
        showOnAboutUs: false,
    });

    // 1. Guard Clause: Don't render anything if the modal is closed OR no data exists yet


    // 2. Sync state when the testimonial prop updates
   useEffect(() => {
  if (isOpen && testimonial) {
    setFormData({
      customerName: testimonial.customerName || "",
      reviewText: testimonial.reviewText || "",
      rating: testimonial.rating || 5,
      videoUrl: testimonial.videoUrl || "",
      showOnHomepage: testimonial.showOnHomepage || false,
      showOnAboutUs: testimonial.showOnAboutUs || false,
    });
  }
}, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 3. Safety Guard: Prevent execution if _id is missing
        if (!testimonial?._id) {
            alert("Error: No testimonial selected.");
            return;
        }

        try {
            const res = await fetch(`/api/testimonials/${testimonial._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Testimonial Updated!");
                onRefresh();
                onClose();
            } else {
                alert("Failed to update testimonial");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("An error occurred");
        }
    };
    if (!isOpen || !testimonial) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
                    <h2 className="text-xl font-bold text-black">Edit Testimonial</h2>
                    <button onClick={onClose} className="text-black hover:text-black cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-black">
                    <label>Customer Name</label>
                    <input
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg"
                    />

                    <label>Review</label>
                    <textarea
                        value={formData.reviewText}
                        onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg h-24"
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

                    <label>Update Video/Media</label>
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
                                onClick={(e) =>
                                    open()
                                }
                                disabled={isLoading} // Prevent clicking while loading
                                className="w-full border-2 border-dashed border-gray-200 p-6 rounded-lg text-gray-500 hover:border-[#742E85] transition-colors"
                            >
                                {isLoading ? "Uploading..." : formData.videoUrl ? "Video Uploaded ✅" : "Click to Upload"}
                            </button>
                        )}
                    </CldUploadWidget>

                    {/* Visibility Toggles */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between">
                            <span>Show on Homepage</span>
                            <input
                                type="checkbox"
                                checked={formData.showOnHomepage}
                                onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                            />
                        </div>
                        <div className="flex justify-between">
                            <span>Show on About Us</span>
                            <input
                                type="checkbox"
                                checked={formData.showOnAboutUs}
                                onChange={(e) => setFormData({ ...formData, showOnAboutUs: e.target.checked })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-[#742E85] text-white rounded-lg">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}