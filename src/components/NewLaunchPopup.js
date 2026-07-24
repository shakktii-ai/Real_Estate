// components/NewLaunchPopup.jsx

"use client";

import { X, ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export default function NewLaunchPopup({
    open,
    onClose,
    projects,
}) {
    const getPriceLabel = (project) => {
        if (project.pricing?.displayPrice) return project.pricing.displayPrice;

        const min = project.pricing?.minPrice ?? project.pricing?.startingPrice;
        const max = project.pricing?.maxPrice ?? project.pricing?.endingPrice;

        if (min || max) {
            const formatValue = (value) => {
                if (!value) return "On Request";
                if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
                if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
                return `₹${value.toLocaleString("en-IN")}`;
            };

            return `${formatValue(min)} - ${formatValue(max)}`;
        }

        return "Price on request";
    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">

            <div className="w-[400px] max-w-md max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">

                {/* Header */}

                <div className="relative bg-gradient-to-br from-[#742E85] to-[#E5097F] px-6 py-3 text-white flex-shrink-0">

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/44 rounded-full p-1 hover:cursor-pointer"
                    >
                        <X size={16} />
                    </button>

                    <div className="text-center">
                        <div className="flex justify-center">
                            <Image
                                src="/rocket.png"
                                alt="New Launch"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </div>

                        <h2 className="font-semibold text-[20px] mt-2 text-white">
                            Something BIG just landed at
                            <br />
                            Piinggaksha!
                        </h2>

                        <p className="mt-2 text-[15px] font-normal">
                            New launches you don't want to miss
                        </p>

                        <div className="mt-2 bg-white/32 rounded-full py-1 text-[14px] font-medium">

                            ✨ AI based Property Search • No Spam Calls

                        </div>

                    </div>

                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">

                    {projects.map(project => (

                        <Link
                            href={`/properties/${project.slug}`}
                            key={project._id}
                        >

                            <div className="border-1 border-gray-300 rounded-2xl p-2  transition flex gap-2 my-2.5">

                                <img
                                    src={project.mainImage}
                                    className="w-[103px] h-[100px] rounded-2xl object-cover"
                                />

                                <div className="flex-1">

                                    <span className="bg-[#FFE2E2] text-[#FF0000] text-[12px] px-3 py-1 rounded-full font-normal">

                                        NEW LAUNCH

                                    </span>

                                    <h3 className="text-[15px] text-black mt-2">

                                        {project.projectName}

                                    </h3>

                                    <p className="text-[12px] text-black line-clamp-1">

                                        {project.address?.area},{" "}
                                        {project.address?.city}

                                    </p>

                                    <p className="text-[#742E85] font-medium text-[12px] mt-1">
                                        {getPriceLabel(project)}
                                    </p>

                                </div>

                                <ChevronRight size={12} className="text-black" />

                            </div>

                        </Link>

                    ))}

                </div>

                {/* Bottom */}

                <div className="p-4">

                    <div className="grid grid-cols-2 gap-3">

                        <a
                            href="tel:+919284429197"
                            className="bg-[#E5097F] text-white rounded-xl py-3 flex justify-center items-center gap-2"
                        >

                            <Phone size={18} />

                            9284429197

                        </a>

                        <a
                            href="tel:+919529249230"
                            className="bg-[#742E85] text-white rounded-xl py-3 flex justify-center items-center gap-2"
                        >

                            <Phone size={18} />

                            9529249230

                        </a>

                    </div>

                    <button
                        className="mt-3 w-full border-1 border-[#742E85] rounded-xl py-3 text-[#742E85] font-medium"
                    >

                        Request a Free Callback

                    </button>

                </div>

            </div>

        </div>

    );

}