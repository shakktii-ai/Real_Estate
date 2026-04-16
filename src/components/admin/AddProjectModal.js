"use client";
import { useForm } from "react-hook-form";
import { X, Upload, Info } from "lucide-react";

export default function AddProjectModal({ isOpen, onClose, refreshData }) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { constructionProgress: 65 }
  });

  const progressValue = watch("constructionProgress");

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        reset();
        onClose();
        refreshData(); // Refresh the list on the dashboard
      }
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-auto max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-black">Add New Project</h2>
          <button onClick={onClose} className="text-black hover:text-black"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6 text-black">
          
          {/* Basic Information Section */}
          <section>
            <h3 className="text-sm font-semibold text-black mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Project Name</label>
                <input {...register("projectName")} placeholder="Skyline apartment" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Builder name</label>
                <input {...register("builderName")} placeholder="Premium Builders" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Location</label>
                <input {...register("address")} placeholder="Mumbai, Pune" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Pricing Range</label>
                <input {...register("pricing.displayPrice")} placeholder="₹1.5 cr - 2.2 cr" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Possession Date</label>
                <input {...register("possessionDate")} placeholder="December 2027" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Configuration</label>
                <input {...register("configuration")} placeholder="2BHK, 3BHK" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"/>
              </div>
               <div className="space-y-1">
      <label className="text-xs font-medium">Amenities</label>
      <input
        {...register("amenities")}
        placeholder="Gym, Swimming Pool, Club House"
        className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-purple-500"
      />
    </div>
        <div className="space-y-1">
      <label className="text-xs font-medium">Project Status</label>
      <select
        {...register("status")}
        className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-purple-500"
      >
        <option value="">Select Status</option>
        <option value="Ready">Ready</option>
        <option value="Under Construction">Under Construction</option>
        <option value="Late Possession">Late Possession</option>
      </select>
    </div>

            </div>
          </section>

          {/* Price Drop Feature */}
          <div className="flex items-center justify-between py-2 border-y text-black">
            <div>
              <h3 className="text-sm font-semibold">Price Drop Feature</h3>
              <p className="text-[10px] text-black">Show Price Drop Badge</p>
            </div>
            <input type="checkbox" {...register("priceDrop.isEnabled")} className="w-10 h-5 accent-green-500 cursor-pointer"/>
          </div>

          {/* Construction Progress */}
          <div>
             <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-black">Construction Progress</h3>
                <span className="text-[10px] font-bold text-black">Progress: {progressValue}%</span>
             </div>
             <input 
                type="range" 
                {...register("constructionProgress")} 
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D81B60]"
             />
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-black">Tags</h3>
            <div className="flex flex-wrap gap-2 text-black">
              {['RERA Verified', 'Featured', 'Luxury', 'Premium', 'Affordable'].map(tag => (
                <label key={tag} className="cursor-pointer">
                  <input type="checkbox" value={tag} {...register("tags")} className="hidden peer"/>
                  <span className="px-4 py-1 text-[10px] border rounded-full peer-checked:bg-[#D81B60] peer-checked:text-white peer-checked:border-[#D81B60] transition-all">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Media & Documents */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-black">Media & Documents</h3>
            <div className="grid grid-cols-3 gap-4">
              {['Image', 'Brochure', 'Price Sheet'].map(item => (
                <div key={item} className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload size={20} className="text-black"/>
                  <span className="text-[10px] font-medium text-black">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-black">Description (Optional)</label>
            <textarea {...register("description")} rows="3" placeholder="Enter project description..." className="w-full border rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-purple-500"></textarea>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 pb-2">
            <button type="submit" className="flex-1 bg-[#D81B60] text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#ad1457] transition-all">
              Update Project
            </button>
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 py-3 rounded-xl font-bold text-sm text-black hover:bg-gray-50 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}