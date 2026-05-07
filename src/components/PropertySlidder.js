"use client";
import { useEffect, useRef, useState } from "react";
import PropertyCard from "./PropertyCard";
export default function PropertySlider({ projects = [] }) {
    const [index, setIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [isHovered, setIsHovered] = useState(false);

    const containerRef = useRef(null);

    // ✅ Responsive items count
    useEffect(() => {
        const updateItems = () => {
            if (window.innerWidth < 640) setItemsPerView(1);
            else if (window.innerWidth < 768) setItemsPerView(2);
            else if (window.innerWidth < 1024) setItemsPerView(3);
            else setItemsPerView(4);
        };

        updateItems();
        window.addEventListener("resize", updateItems);
        return () => window.removeEventListener("resize", updateItems);
    }, []);

    // Function to get item width class accounting for gap
    const getItemWidth = () => {
        if (itemsPerView === 1) return 'w-full';
        if (itemsPerView === 2) return 'w-[calc(50%-4px)]';
        if (itemsPerView === 3) return 'w-[calc(33.333%-8px)]';
        if (itemsPerView === 4) return 'w-[calc(25%-6px)]';
        return 'w-full';
    };

    // ✅ Auto slide with pause (like Housiey)
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setIndex((prev) => {
                if (prev >= projects.length - itemsPerView) return 0;
                return prev + 1;
            });
        }, 3000); // pause time

        return () => clearInterval(interval);
    }, [projects.length, itemsPerView, isHovered]);

    // ✅ Navigation
    const nextSlide = () => {
        setIndex((prev) =>
            prev >= projects.length - itemsPerView ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setIndex((prev) =>
            prev <= 0 ? projects.length - itemsPerView : prev - 1
        );
    };

    return (
        <div
            className="relative overflow-hidden px-0 sm:px-6 md:px-8 lg:px-2 py-6 md:py-16 mt-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slider */}
            <div
                ref={containerRef}
                className="flex gap-1 sm:gap-2 md:gap-6 transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${index * (100 / itemsPerView)}%)`,
                }}
            >
                {projects.map((project) => (
                    <div
                        key={project._id}
                        className={`flex-shrink-0 ${getItemWidth()}`}
                    >
                        <PropertyCard project={project} />
                    </div>
                ))}
            </div>

            <div className="absolute top-1 sm:top-2 md:top-1 right-2 sm:right-4 md:right-8 lg:right-12 flex gap-4  z-20">
                <button
                    onClick={prevSlide}
                    className="bg-white shadow-md rounded-full 
             p-1.5 sm:p-2 md:p-2.5 
             text-sm sm:text-base md:text-lg text-gray-800
             hover:bg-gray-100 transition"
                >
                    ←
                </button>

                <button
                    onClick={nextSlide}
                    className="bg-white shadow-md rounded-full 
             p-1.5 sm:p-2 md:p-2.5 
             text-sm sm:text-base md:text-lg
             hover:bg-gray-100 transition"
                >
                    →
                </button>
            </div>
        </div>
    );
}