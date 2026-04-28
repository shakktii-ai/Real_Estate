"use client";
import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
export default function AddLivingStyleModal({ isOpen, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    categoryTag: '',
    cardColor: '',
    description: '',
    pricingRange: '',
    features: ['', '', '', ''],
    image: null
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Card title is required");
      return;
    }

    if (!formData.categoryTag) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.description) {
      toast.error("Description is required");
      return;
    }
    if (!formData.cardColor) {
      toast.error("Please select a card color");
      return;
    }

    if (!formData.pricingRange.trim()) {
      toast.error("Pricing range is required");
      return;
    }

  const validFeatures = formData.features.filter(
  (f) => f.trim() !== ""
);

if (validFeatures.length < 4) {
  toast.error("First 4 features are required");
  return;
}

    if (validFeatures.length < 2) {
      toast.error("Please add at least 2 features");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }
    const toastId = toast.loading("Uploading media and saving project...");
    try {
      setLoading(true);
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
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("categoryTag", formData.categoryTag);
      submitData.append("cardColor", formData.cardColor);
      submitData.append("description", formData.description);
      submitData.append("pricingRange", formData.pricingRange);
      submitData.append("features", JSON.stringify(validFeatures));
      submitData.append("image", uploadData.url);

      const res = await fetch("/api/living-styles", {
        method: "POST",
        body: submitData,
      });

      if (res.ok) {
        toast.update(toastId, {
          render: "Card added successfully! ",
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
        onRefresh();
        onClose();

        setFormData({
          title: "",
          categoryTag: "Affordable",
          cardColor: "blue",
          description: "",
          pricingRange: "",
          features: ["", "", "", ""],
          image: null,
        });
      } else {
        alert("Failed to add card");
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Error: Could not save project. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 4000
      });
      console.error("Error adding card:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">

        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-black">Add New Card</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-black"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8  text-black overflow-y-auto space-y-6 max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-black mb-2 ">
                Card Title
              </label>
              <input
                type="text"
                placeholder="e.g. Smart Living"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black mb-2 ">
                Category Tag
              </label>
              <select
                value={formData.categoryTag}
                onChange={(e) =>
                  setFormData({ ...formData, categoryTag: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Category</option>
                <option value="Affordable">Affordable</option>
                <option value="Premium">Premium</option>
                <option value="Luxury">Luxury</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-2 ">
              Description
            </label>
            <textarea
              type="text"
              placeholder=""
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-black mb-2 ">Card Color</label>
              <select
                value={formData.cardColor}
                onChange={(e) =>
                  setFormData({ ...formData, cardColor: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">- Select Card Color -</option>
                <option value="blue">Blue (Smart)</option>
                <option value="green">Green (Comfort)</option>
                <option value="yellow">Yellow (Elite)</option>
                <option value="teal">Teal (Relax)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-black mb-2 ">Pricing Range</label>
              <input
                type="text"
                placeholder="₹25L - ₹60L onwards"
                value={formData.pricingRange}
                onChange={(e) =>
                  setFormData({ ...formData, pricingRange: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
  <label className="block text-xs font-bold text-black mb-2">
    Features (List Items)
  </label>

  <div className="grid grid-cols-2 gap-4">
    {formData.features.map((feature, i) => (
      <div key={i} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder={`Feature ${i + 1}`}
          value={feature}
          onChange={(e) => {
            const newFeatures = [...formData.features];
            newFeatures[i] = e.target.value;

            setFormData({
              ...formData,
              features: newFeatures,
            });
          }}
          className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* ❌ Remove button (only for extra fields) */}
        {i >= 4 && (
          <button
            type="button"
            onClick={() => {
              const newFeatures = formData.features.filter(
                (_, index) => index !== i
              );
              setFormData({
                ...formData,
                features: newFeatures,
              });
            }}
            className="text-red-500 text-xs"
          >
            ✕
          </button>
        )}
      </div>
    ))}
  </div>

  {/* ➕ Add More Button */}
  <button
    type="button"
    onClick={() =>
      setFormData({
        ...formData,
        features: [...formData.features, ""],
      })
    }
    className="mt-3 text-sm text-[#742E85] font-semibold hover:underline"
  >
    + Add Feature
  </button>
</div>

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">
              Image
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

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-4 rounded-xl font-bold transition-all ${loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#E5097F] text-white hover:opacity-90"
                }`}
            >
              {loading ? "Adding..." : "Add Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}