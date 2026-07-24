"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

function Counter({ from, to, duration }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration: duration || 2 });
      return () => controls.stop();
    }
  }, [isInView, to, count, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function StatsSection() {
  const stats = [
    { target: 35, label: "Projects Marketed and Promoted By PIINGGAKSHA" },
    { target: 160, label: "Served Happy Customers" },
    { target: 450, label: "Total Site Visit Done" },
  ];

  return (
    <section className="py-8 bg-[#F6F3F6]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center ">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center border-b md:border-b-0 md:border-r-4  border-gray-200 last:border-b-0 md:last:border-r-0 pb-4 md:pb-0">
              <h3 className="text-sm md:text-[24px] font-bold text-[#E5097F] mb-1">
                <Counter from={0} to={stat.target} duration={2.5} />+
              </h3>
              <p className="text-xs md:text-[16px] text-black max-w-[250px] leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}