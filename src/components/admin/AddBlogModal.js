"use client";
import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AddBlogModal({ isOpen, onClose, onRefresh }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null,
    });

    const categories = ["Real Estate", "Home Decor", "Investment", "Legal", "Construction"];

    const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title.trim()) {
    toast.error("Blog title is required");
    return;
  }

  if (!formData.description.trim()) {
    toast.error("Description is required");
    return;
  }

  if (!formData.image) {
    toast.error("Please upload a blog image");
    return;
  }

  setLoading(true);
  const toastId = toast.loading("Uploading image and creating blog...");

  try {
    // Upload image exactly like project image upload
    const imageFormData = new FormData();
    imageFormData.append("file", formData.image);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: imageFormData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error("Image upload failed");
    }

    // Save blog with uploaded image URL
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        image: uploadData.url,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      toast.update(toastId, {
        render: "Blog created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setFormData({
        title: "",
        description: "",
        image: null,
      });

      onRefresh();
      onClose();
    } else {
      toast.update(toastId, {
        render: result.error || "Failed to create blog",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  } catch (error) {
    toast.update(toastId, {
      render: "Something went wrong",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  } finally {
    setLoading(false);
  }
};
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Modal Header */}
               <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-black">Add New Blog</h2>
                    <button onClick={onClose} className="text-black hover:text-black cursor-pointer"><X size={24} /></button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[75vh] text-black">
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">
                                Blog Title
                            </label>

                            <input
                                required
                                type="text"
                                placeholder="Enter blog title"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#742E85] outline-none"
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">
                                Description
                            </label>

                            <textarea
                                required
                                rows="5"
                                placeholder="Write blog description..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#742E85] outline-none"
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">
                                Blog Image
                            </label>

                            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-[#742E85] hover:bg-purple-50 transition">
                                <Upload size={28} className="text-[#742E85] mb-2" />

                                <p className="text-sm font-medium text-gray-700">
                                    Click to upload image
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG or WEBP
                                </p>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            image: e.target.files[0],
                                        })
                                    }
                                />
                            </label>

                            {formData.image && (
                                <p className="text-xs text-green-600 mt-2">
                                    Selected: {formData.image.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-10 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${loading
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-[#742E85] hover:bg-[#5e256b] text-white"
                                }`}
                        >
                            {loading ? "Creating..." : (
                                <>
                                    <Plus size={18} />
                                    Create Blog
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}