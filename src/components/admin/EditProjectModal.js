"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "react-toastify";

export default function EditProjectModal({
  isOpen,
  onClose,
  onRefresh,
  project,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    builderName: "",
    reraNumber: "",
    area: '',
    city: "",
    possessionDate: "",
    pricingRange: "",
    configuration: "",
    description: "",
    oldPrice: "",
    newPrice: "",
    progress: 0,
    tag: "",
    priceDrop: false,
    image: null,
    brochure: null,
    priceSheet: null,
    qrCode: null,
  });

  // ✅ Prefill
  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || "",
        builderName: project.builderName || "",
        reraNumber: project.reraNumber || "",

        area: project.address?.area || "",
        city: project.address?.city || "",

        pricingRange: project.pricing?.displayPrice || "",

        possessionDate: project.possessionDate || "",

        configuration: project.configuration?.join(", ") || "",

        progress: project.constructionProgress || 0,

        oldPrice: project.priceDrop?.oldPrice || "",
        newPrice: project.priceDrop?.newPrice || "",
        priceDrop: project.priceDrop?.isEnabled || false,

        tag: project.tags?.[0] || "",

        description: project.description || "",
      });
    }
  }, [project]);

  // ✅ Upload helper
  const uploadFile = async (file) => {
    if (!file) return null;

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    return data.url;
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Updating project...");

    try {
      setLoading(true);

      const [img, brochure, sheet, qr] = await Promise.all([
        uploadFile(formData.image),
        uploadFile(formData.brochure),
        uploadFile(formData.priceSheet),
        uploadFile(formData.qrCode),
      ]);

      const payload = {
        projectName: formData.projectName,
        builderName: formData.builderName,
        reraNumber: formData.reraNumber,

        address: {
          area: formData.area,
          city: formData.city,
        },

        pricing: {
          displayPrice: formData.pricingRange,
        },

        possessionDate: formData.possessionDate,

        configuration: formData.configuration
          .split(",")
          .map((i) => i.trim()),

        constructionProgress: Number(formData.progress),

        priceDrop: {
          isEnabled: formData.priceDrop,
          oldPrice: formData.oldPrice,
          newPrice: formData.newPrice,
        },

        tags: formData.tag ? [formData.tag] : [],

        description: formData.description,

        mainImage: img || project.mainImage,
        brochureUrl: brochure || project.brochureUrl,
        priceSheetUrl: sheet || project.priceSheetUrl,
        qrCodeUrl: qr || project.qrCodeUrl,
      };

      const res = await fetch(`/api/properties/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
const result = await res.json();
      if (!res.ok) {
      // Throw the error message from the backend if available
      throw new Error(result.error || "Failed to update");
    }

    toast.update(toastId, {
      render: "Project updated successfully",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });

    // Call onRefresh and wait for it to finish before closing
    if (onRefresh) await onRefresh(); 
    onClose();

  } catch (err) {
    console.error("Update Error Details:", err); // CHECK YOUR CONSOLE FOR THIS
    toast.update(toastId, {
      render: err.message || "Update failed", // Use the actual error message
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  } finally {
    setLoading(false);
  }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-bold text-black">Edit Project</h2>
          <button onClick={onClose}>
            <X className="text-black" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-black"
        >

          {/* BASIC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold mb-2 block">Project Name</label>
              <input
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs font-bold mb-2 block">Builder Name</label>
              <input
                value={formData.builderName}
                onChange={(e) => setFormData({ ...formData, builderName: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Area</label>
              <input
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"
              />

            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">City</label>
              <input
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"
              />

            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold mb-2 block">Possession Date</label>
              <input value={formData.possessionDate} onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })} placeholder="Possession Date" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-bold mb-2 block">Pricing range</label>
              <input value={formData.pricingRange} onChange={(e) => setFormData({ ...formData, pricingRange: e.target.value })} placeholder="Pricing Range" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold mb-2 block">RERA Number</label>
              <input value={formData.reraNumber} onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })} placeholder="RERA Number" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-bold mb-2 block">Congiruration</label>
              <input value={formData.configuration} onChange={(e) => setFormData({ ...formData, configuration: e.target.value })} placeholder="Configuration" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50" />
            </div>
          </div>

          {/* PRICE DROP */}
        <div className="border p-4 rounded-xl flex items-center justify-between">
            <span className="text-sm font-semibold">Enable Price Drop</span>
            <input type="checkbox" checked={formData.priceDrop} onChange={(e) => setFormData({...formData, priceDrop: e.target.checked})} />
          </div>

          {formData.priceDrop && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in">
              <div>
            <label className="text-sm font-semibold mb-2 block">Old Price</label>
              <input value={formData.oldPrice} onChange={(e) => setFormData({...formData, oldPrice: e.target.value})} placeholder="Old Price" className="border p-2.5 rounded-lg text-sm" />
              </div>
              <div>
            <label className="text-sm font-semibold mb-2 block">New Price</label>
              <input value={formData.newPrice} onChange={(e) => setFormData({...formData, newPrice: e.target.value})} placeholder="New Price" className="border p-2.5 rounded-lg text-sm" />
            </div>
            </div>
          )}

          {/* PROGRESS */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-black">Construction Progress</h3>
              <span className="text-[10px] font-bold text-black">Progress: {formData.progress}%</span>
            </div>
            <input
              type="range"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              className="w-full accent-pink-500"
            />
          </div>

          {/* TAGS */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Tags</label>
            <div className="flex gap-2 flex-wrap">
              {["RERA Verified", "Featured", "Luxury", "Premium", "Affordable"].map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setFormData({ ...formData, tag })}
                  className={`px-3 py-1 rounded-full text-sm ${formData.tag === tag
                    ? "bg-[#E5097F] text-white"
                    : "bg-gray-100"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* MEDIA */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Media & Documents</label>

            {/* EXISTING PREVIEW */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { key: "mainImage", label: "Image" },
                { key: "brochureUrl", label: "Brochure" },
                { key: "priceSheetUrl", label: "Price Sheet" },
                { key: "qrCodeUrl", label: "QR Code" },
              ].map((item) => (
                <div key={item.key}>
                  {project[item.key] && (
                    <p className="text-xs text-green-600 mb-1">
                      Existing {item.label} ✓
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {["image", "brochure", "priceSheet", "qrCode"].map((field, i) => (
                <label key={i} className="border-dashed border-2 p-4 rounded-lg text-center cursor-pointer">
                  <Upload className="mx-auto mb-1" />
                  <p className="text-xs capitalize">{field}</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.files[0] })}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="text-sm font-semibold mb-2 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
              className="w-full border rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-1"
            />
          </div>
          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              disabled={loading}
              className="flex-1 bg-[#E5097F] text-white py-3 rounded-xl font-bold"
            >
              {loading ? "Updating..." : "Update Project"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}