import React from 'react';

const features = [
  {
    id: "01.",
    title: "No Brokerage | Rock Bottom Prices",
    desc: ""
  },
  {
    id: "02.",
    title: "Maharashtra Real Estate Regulatory Authority.",
    desc: "Rera no - A52100026024"
  },
  {
    id: "03.",
    title: "Certified By NAREDCO",
    desc: "National Real Estate Development Council"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-6 bg-[#F6F3F6]">
      <div className="max-w-7xl mx-auto flex items-center flex-col">
        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-[#742E85] mb-16 text-center">
          Why Piinggaksha Is The Perfect Choice?
        </h2>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((item, index) => (
            <div key={index} className="space-y-2">
              {/* Numbering */}
              <h3 className="text-2xl  text-black mb-4 mx-8">{item.id}</h3>
              
              {/* Title */}
              <div className='mx-8'>
              <h4 className="text-2xl text-black leading-tight">
                {item.title}
              </h4>
            </div>  
              {/* Description (only if it exists) */}
              {item.desc && (
                <p className="text-black text-base mx-8">
                  {item.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}