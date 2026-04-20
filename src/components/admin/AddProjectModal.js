"use client";
import { useForm } from "react-hook-form";
import { X, Upload, CheckCircle2, FileText } from "lucide-react";
import { toast } from "react-toastify";
export default function AddProjectModal({ isOpen, onClose, refreshData }) {
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { constructionProgress: 65 }
    });
    const watchedImage = watch("imageFile");
    const watchedBrochure = watch("brochureFile");
    const watchedPriceSheet = watch("priceSheetFile");
    const watchedQrCode = watch("qrCodeUrlFile");
    const progressValue = watch("constructionProgress");
    const isPriceDropEnabled = watch("priceDrop.isEnabled");
    const FileStatus = ({ fileList, label }) => {
        if (fileList && fileList.length > 0) {
            return (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 size={24} className="text-green-500 mb-1" />
                    <p className="text-[10px] font-bold text-green-600 uppercase">Selected</p>
                    <p className="text-[9px] text-gray-500 truncate max-w-[100px]">{fileList[0].name}</p>
                </div>
            );
        }
        return (
            <>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${label === 'Project Image' ? 'bg-[#D81B60]/10' : 'bg-gray-100'}`}>
                    <Upload size={18} className={label === 'Project Image' ? 'text-[#D81B60]' : 'text-gray-400'} />
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-black">{label}</p>
                    <p className="text-[11px] text-gray-500 mt-1">Click to upload</p>
                </div>
            </>
        );
    };
    const onSubmit = async (data) => {
        const toastId = toast.loading("Uploading media and saving project...");

        try {
            // 1. Handle File Uploads (Multiple Files)
            const uploadFile = async (file) => {
                if (!file?.[0]) return "";
                const formData = new FormData();
                formData.append("file", file[0]);
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                const json = await res.json();
                return json.url;
            };

            // Upload all files in parallel for speed
            const [mainImageUrl, brochureUrl, priceSheetUrl, qrCodeUrl] = await Promise.all([
                uploadFile(data.imageFile),
                uploadFile(data.brochureFile),
                uploadFile(data.priceSheetFile),
                uploadFile(data.qrCodeUrlFile),
            ]);

            // 2. Format Data for MongoDB
            const formattedData = {
                ...data,
                mainImage: mainImageUrl,
                brochureUrl,
                priceSheetUrl,
                qrCodeUrl,
                address: {
                    area: data.address?.area,
                    city: data.address?.city,
                },
                configuration: data.configuration
                    ? data.configuration.split(",").map((i) => i.trim())
                    : [],
                amenities: data.amenities
                    ? data.amenities.split(",").map((i) => i.trim())
                    : [],
            };

            // Clean up temporary form fields
            delete formattedData.imageFile;
            delete formattedData.brochureFile;
            delete formattedData.priceSheetFile;
            delete formattedData.qrCodeUrlFile;

            // 3. Save to Database
            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            });

            if (res.ok) {
                toast.update(toastId, {
                    render: "Project created successfully! ",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
                reset();
                onClose();
                refreshData();
            } else {
                throw new Error("Failed to save project");
            }

        } catch (error) {
            console.error(error);
            toast.update(toastId, {
                render: "Error: Could not save project. Please try again.",
                type: "error",
                isLoading: false,
                autoClose: 4000
            });
        }
    }; if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-auto max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-black">Add New Project</h2>
                    <button onClick={onClose} className="text-black hover:text-black"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6 text-black">

                    {/* Basic Information Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-black mb-4">Basic Information</h3>
                        <div >
                            <label className="text-xs font-medium">Project Name</label>
                            <input {...register("projectName", { required: "Project Name is Required" })} placeholder="Skyline apartment" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50" />
                            {errors.projectName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.projectName.message}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="space-y-1">
                                <label className="text-xs font-medium">Builder name</label>
                                <input {...register("builderName", { required: "Builder Name is Required" })} placeholder="Premium Builders" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50" />
                                {errors.builderName && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.builderName.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium">RERA Number</label>
                                <input {...register("reraNumber", { required: "RERA Number is Required" })} placeholder="Premium Builders" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50" />
                                {errors.reraNumber && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.reraNumber.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Area</label>
                                    <input
                                        {...register("address.area", { required: "Area is Required" })}
                                        placeholder="Wakad"
                                        className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"
                                    />
                                    {errors.address?.area && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.address.area.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium">City</label>
                                    <input
                                        {...register("address.city", { required: "City is Required" })}
                                        placeholder="Pune"
                                        className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"
                                    />
                                    {errors.address?.city && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.address.city.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium">Pricing Range</label>
                                <input {...register("pricing.displayPrice", { required: "Price Range is Required" })} placeholder="₹1.5 cr - 2.2 cr" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50" />
                                {errors.pricing?.displayPrice && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.pricing.displayPrice.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium">Possession Date</label>
                                <input {...register("possessionDate", { required: "Possession Date is Required" })} placeholder="December 2027" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50" />
                                {errors.possessionDate && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.possessionDate.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium">Configuration</label>
                                <input {...register("configuration", { required: "Configuration is Required" })} placeholder="2BHK, 3BHK" className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50" />
                                {errors.configuration && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.configuration.message}
                                    </p>
                                )}
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



                    <div className="border-y py-3 text-black">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold">Price Drop Feature</h3>
                                <p className="text-[10px] text-black">Show Price Drop Badge</p>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("priceDrop.isEnabled")}
                                    className="sr-only peer"
                                />

                                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#00A76F] transition-colors duration-300"></div>

                                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5"></div>
                            </label>
                        </div>

                        {isPriceDropEnabled && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium mb-1">Old Price</label>
                                    <input
                                        type="text"
                                        placeholder="Enter old price"
                                        {...register("priceDrop.oldPrice")}
                                        className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium mb-1">New Price</label>
                                    <input
                                        type="text"
                                        placeholder="Enter new price"
                                        {...register("priceDrop.newPrice")}
                                        className="w-full border rounded-md px-3 py-2 text-sm outline-none"
                                    />
                                </div>
                            </div>
                        )}
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
                                    <input type="checkbox" value={tag} {...register("tags")} className="hidden peer" />
                                    <span className="px-4 py-1 text-[10px] border rounded-full peer-checked:bg-[#D81B60] peer-checked:text-white peer-checked:border-[#D81B60] transition-all">
                                        {tag}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Media & Documents */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4 text-black">Media & Documents</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Project Image */}
                            <label className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${watchedImage?.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-[#D81B60]'}`}>
                                <FileStatus fileList={watchedImage} label="Project Image" />
                                <input type="file" accept="image/*" {...register("imageFile")} className="hidden" />
                            </label>

                            {/* Brochure */}
                            <label className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${watchedBrochure?.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-[#742E85]'}`}>
                                <FileStatus fileList={watchedBrochure} label="Brochure PDF" />
                                <input type="file" accept=".pdf" {...register("brochureFile")} className="hidden" />
                            </label>

                            {/* Price Sheet */}
                            <label className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${watchedPriceSheet?.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-[#00A76F]'}`}>
                                <FileStatus fileList={watchedPriceSheet} label="Price Sheet" />
                                <input type="file" accept=".pdf" {...register("priceSheetFile")} className="hidden" />
                            </label>

                            {/* QR Code */}
                            <label className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${watchedQrCode?.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-500'}`}>
                                <FileStatus fileList={watchedQrCode} label="QR Code" />
                                <input type="file" accept=".pdf,image/*" {...register("qrCodeUrlFile")} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-black">Description (Optional)</label>
                        <textarea {...register("description")} rows="3" placeholder="Enter project description..." className="w-full border rounded-lg p-3 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-purple-500"></textarea>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 pb-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-[#D81B60] hover:bg-[#ad1457] text-white"
                                }`}
                        >
                            {isSubmitting ? "Uploading..." : "Upload Project"}
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
