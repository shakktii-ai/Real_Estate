"use client";
import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "react-toastify";

export default function EditLivingStyleModal({
  isOpen,
  onClose,
  onRefresh,
  card,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    categoryTag: "",
    cardColor: "",
    description: "",
    pricingRange: "",
    features: ["", "", "", ""],
    image: null, // new image file
    existingImage: "", // already saved image
  });

  // ✅ Prefill data
  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || "",
        categoryTag: card.categoryTag || "",
        cardColor: card.cardColor || "",
        description: card.description || "",
        pricingRange: card.pricingRange || "",
        features: card.features?.length
          ? [...card.features, "", "", "", ""].slice(0, 4)
          : ["", "", "", ""],
        image: null,
        existingImage: card.image || "",
      });
    }
  }, [card]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!card?._id) return;

    if (!formData.title.trim()) return toast.error("Card title is required");
    if (!formData.categoryTag) return toast.error("Select category");
    if (!formData.description) return toast.error("Description required");
    if (!formData.cardColor) return toast.error("Select card color");
    if (!formData.pricingRange.trim())
      return toast.error("Pricing required");

    const validFeatures = formData.features.filter((f) => f.trim() !== "");
    if (validFeatures.length < 2)
      return toast.error("Add at least 2 features");

    const toastId = toast.loading("Updating card...");

    try {
      setLoading(true);

      let imageUrl = formData.existingImage;

      // ✅ Upload new image only if selected
      if (formData.image) {
        const imageForm = new FormData();
        imageForm.append("file", formData.image);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageForm,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) throw new Error("Upload failed");

        imageUrl = uploadData.url;
      }

      const res = await fetch(`/api/living-styles/${card._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          categoryTag: formData.categoryTag,
          cardColor: formData.cardColor,
          description: formData.description,
          pricingRange: formData.pricingRange,
          features: validFeatures,
          image: imageUrl,
        }),
      });

      if (!res.ok) throw new Error();

      toast.update(toastId, {
        render: "Card updated successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      onRefresh();
      onClose();
    } catch (err) {
      toast.update(toastId, {
        render: "Update failed ❌",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-black">Edit Card</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-black">
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 text-black overflow-y-auto space-y-6 max-h-[80vh]">

          {/* TITLE + CATEGORY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div> <label className="block text-xs font-bold text-black mb-2 ">
                Card Title
              </label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Card Title"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3"
            />
</div>
<div>
              <label className="block text-xs font-bold text-black mb-2 ">
                Category Tag
              </label>
            <select
              value={formData.categoryTag}
              onChange={(e) => setFormData({ ...formData, categoryTag: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3"
            >
              <option value="">Select Category</option>
              <option value="Affordable">Affordable</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
              <option value="Holiday">Holiday</option>
            </select>
            </div>
          </div>

          {/* DESCRIPTION */}
             <label className="block text-xs font-bold text-black mb-2 ">
                Description
              </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3"
          />

          {/* COLOR + PRICE */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-black mb-2 ">Card Color</label>
            <select
              value={formData.cardColor}
              onChange={(e) => setFormData({ ...formData, cardColor: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3"
            >
              <option value="">Select Color</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="teal">Teal</option>
            </select>
</div>
<div>
              <label className="block text-xs font-bold text-black mb-2 ">Pricing Range</label>
            <input
              value={formData.pricingRange}
              onChange={(e) => setFormData({ ...formData, pricingRange: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3"
            />
            </div>
          </div>

          {/* FEATURES */}
          <label className="block text-xs font-bold text-black mb-2 ">Features (List Items)</label>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                value={formData.features[i]}
                onChange={(e) => {
                  const arr = [...formData.features];
                  arr[i] = e.target.value;
                  setFormData({ ...formData, features: arr });
                }}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3"
              />
            ))}
          </div>

          {/* IMAGE */}
            <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">
              Image
            </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer">
           <Upload />
            <input
              type="file"
              hidden
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
            />
          </label>

          {formData.existingImage && !formData.image && (
            <img src={formData.existingImage} className="h-20 rounded" />
          )}

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 py-4 rounded-xl">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#E5097F] text-white py-4 rounded-xl"
            >
              {loading ? "Updating..." : "Update Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}