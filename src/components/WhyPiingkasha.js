import React from 'react';

const features = [
  {
    id: "01.",
    title: "No Brokerage | Rock Bottom Prices",
    desc: "",
  },
  {
    id: "02.",
    title: "Maharashtra Real Estate Regulatory Authority",
    desc: "RERA No - A52100026024",
  },
  {
    id: "03.",
    title: "Certified By NAREDCO",
    desc: "National Real Estate Development Council",
  },
  {
    id: "04.",
    title: "9+ Years Of Experience",
    desc: "",
  },
  {
    id: "05.",
    title: "Focused Approach",
    desc: "",
  },
  {
    id: "06.",
    title: "Award-Winning Team",
    desc: "",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 px-6 bg-[#F6F3F6]">
      <div className="max-w-7xl mx-auto flex items-center flex-col">
        {/* Main Heading */}
        <h2 className="text-md md:text-xl font-bold text-[#742E85] mb-4 text-center mb-8">
          Why Piinggaksha Is The Perfect Choice?
        </h2>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {features.map((item, index) => (
            <div key={index} className="flex gap-4 items-start ">
              {/* Numbering */}
              <span className="text-md text-[#000000] shrink-0 leading-none">
                {item.id}
              </span>
              
              {/* Content */}
              <div className="">
                <h4 className="text-[14px] text-gray-900 leading-snug">
                  {item.title}
                </h4>
                {item.desc && (
                  <p className="text-xs text-gray-500 font-medium">
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}