// import React from 'react';

// const features = [
//   {
//     id: "01.",
//     title: "No Brokerage | Rock Bottom Prices",
//     desc: "",
//   },
//   {
//     id: "02.",
//     title: "Maharashtra Real Estate Regulatory Authority",
//     desc: "RERA No - A52100026024",
//   },
//   {
//     id: "03.",
//     title: "Certified By NAREDCO",
//     desc: "National Real Estate Development Council",
//   },
//   {
//     id: "04.",
//     title: "9+ Years Of Experience",
//     desc: "",
//   },
//   {
//     id: "05.",
//     title: "Focused Approach",
//     desc: "",
//   },
//   {
//     id: "06.",
//     title: "Award-Winning Team",
//     desc: "",
//   },
// ];

// export default function WhyChooseUs() {
//   return (
//     <section className="py-12 px-6 bg-[#F6F3F6]">
//       <div className="max-w-7xl mx-auto flex items-center flex-col">
//         {/* Main Heading */}
//         <h2 className="text-md md:text-xl font-bold text-[#742E85] mb-4 text-center mb-8">
//           Why Piinggaksha Is The Perfect Choice?
//         </h2>

//         {/* Feature Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
//           {features.map((item, index) => (
//             <div key={index} className="flex gap-4 items-start ">
//               {/* Numbering */}
//               <span className="text-md text-[#000000] shrink-0 leading-none">
//                 {item.id}
//               </span>

//               {/* Content */}
//               <div className="">
//                 <h4 className="text-[14px] text-gray-900 leading-snug">
//                   {item.title}
//                 </h4>
//                 {item.desc && (
//                   <p className="text-xs text-gray-500 font-medium">
//                     {item.desc}
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


import Image from "next/image";

const features = [
  {
    icon: "/Whypiing1.png",
    title: "No Brokerage, Ever",
    desc: "Buy your dream home without paying a single rupee in brokerage. Transparent pricing, always.",
  },
  {
    icon: "/Whypiing2.png",
    title: "AI-Powered Property Search",
    desc: "Our smart AI matches you with the perfect property based on budget, location, and lifestyle in seconds.",
  },
  {
    icon: "/Whypiing3.png",
    title: "100% RERA Verified Projects",
    desc: "Every project we list is verified under RERA. Your investment is always protected.",
  },
  {
    icon: "/Whypiing4.png",
    title: "Free Legal Consultation",
    desc: "Expert legal guidance on RERA, agreements, and builder disputes completely free for our clients.",
  },
  {
    icon: "/Whypiing4.png",
    title: "Hyper-Local Area Specialists",
    desc: "We know South Pune better than anyone. Undri, Kondhwa, Lullanagar, Katraj every lane, every project.",
  },
  {
    icon:"/Whypiing4.png",
    title: "Dedicated Support Team",
    desc: "One relationship manager for the entire journey from search to possession. No runaround.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F6F3F6] py-8 px-5">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-[24px] lg:text-[36px] font-bold text-[#742E85]">
            Why Choose PIINGGAKSHA
          </h2>

          <p className="mt-2 text-gray-600 text-[15px] lg:text-[18px]">
            South Pune's Most Trusted Property Partner
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => {
          

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 px-6 py-4"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#E5097F]/15 flex items-center justify-center mb-5">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>

                {/* Title */}
                <h3 className="text-[20px]  text-black mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[16px] leading-6 text-[#6F6F6F]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}