"use client";
import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "react-toastify";

export default function EditBlogModal({ isOpen, onClose, onRefresh, blog }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  // ✅ Prefill
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        description: blog.description || "",
        image: null,
      });
    }
  }, [blog]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!blog?._id) return;

    const toastId = toast.loading("Updating blog...");

    try {
      setLoading(true);

      let imageUrl = blog.image;

      // ✅ If new image selected → upload
      if (formData.image) {
        const imgData = new FormData();
        imgData.append("file", formData.image);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imgData,
        });

        const uploadResult = await uploadRes.json();

        if (!uploadRes.ok) throw new Error("Image upload failed");

        imageUrl = uploadResult.url;
      }

      // ✅ Update blog
      const res = await fetch(`/api/blogs/${blog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image: imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.update(toastId, {
        render: "Blog updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      onRefresh();
      onClose();
    } catch (error) {
      toast.update(toastId, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center  bg-black/50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-black">Edit Blog</h2>
          <button onClick={onClose}>
            <X size={22} className="text-black"/>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="p-8 space-y-6 text-black max-h-[80vh] overflow-y-auto">

          {/* TITLE */}
          <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">
                                Blog Title
                            </label>
          <input
            value={formData.title}
            placeholder="Blog Title"
            className="w-full border rounded-xl p-3"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          {/* DESCRIPTION */}
            <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">
                                Description
                            </label>
          <textarea
            value={formData.description}
            rows="4"
            placeholder="Description"
            className="w-full border rounded-xl p-3"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          {/* IMAGE */}
          <div>
    <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">
                                Blog Image
                            </label>
  {/* OLD IMAGE PREVIEW */}
  {!formData.image && blog?.image && (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-2">Current Image</p>
      <div className="w-full h-40 rounded-xl overflow-hidden border">
        <img
          src={blog.image}
          alt="Blog"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )}

  {/* NEW IMAGE PREVIEW */}
  {formData.image && (
    <div className="mb-4">
      <p className="text-xs text-green-600 mb-2">New Image Selected</p>
      <div className="w-full h-40 rounded-xl overflow-hidden border">
        <img
          src={URL.createObjectURL(formData.image)}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )}

  {/* UPLOAD BUTTON */}
  <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-[#742E85] hover:bg-purple-50 transition">
    <p className="text-sm font-medium text-gray-700">
      {formData.image ? "Change Image" : "Upload New Image"}
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
</div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#742E85] text-white py-3 rounded-xl"
            >
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}