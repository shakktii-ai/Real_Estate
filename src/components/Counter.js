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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center ">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center  border-r border-gray-300 ">
              <h3 className="text-4xl md:text-5xl font-black text-[#E5097F] mb-4">
                <Counter from={0} to={stat.target} duration={2.5} />+
              </h3>
              <p className="text-lg md:text-lg font-medium text-black max-w-[250px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}