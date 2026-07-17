import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LivingStyleCard({ card, onEdit, onDelete }) {
  const colorMap = {
    blue: {
      bg: "bg-[#EEF4FF]",
      text: "text-[#2754F5]",
      border: "border-[#CFE0FF]",
      categoryBg: "bg-[#2754F5]",
      buttonBorder: "border-[#2754F5]",
      icon: "/affordable.png",
    },
    green: {
      bg: "bg-[#EAFBF1]",
      text: "text-[#1FA55B]",
      border: "border-[#C9EFD8]",
      categoryBg: "bg-[#1FA55B]",
      buttonBorder: "border-[#1FA55B]",
      icon: "/comfort.png",
    },
    yellow: {
      bg: "bg-[#FFF8E8]",
      text: "text-[#F28A1B]",
      border: "border-[#F5DEC2]",
      categoryBg: "bg-[#F28A1B]",
      buttonBorder: "border-[#F28A1B]",
      icon: "/elite.png",
    },
    teal: {
      bg: "bg-[#E9FBFF]",
      text: "text-[#28AFC5]",
      border: "border-[#C9EEF4]",
      categoryBg: "bg-[#1DA2B3]",
      buttonBorder: "border-[#28AFC5]",
      icon: "/relax.png",
    },
  };

  const style = colorMap[card.cardColor] || colorMap.blue;

  return (
    /* Added h-full and min-h-[520px] to ensure vertical consistency */
    <div
      className={`w-[260px] min-w-[220px] h-full min-h-[420px] rounded-[22px] border ${style.border} ${style.bg}  px-4 pt-3 pb-4 flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]`}
    >
      {/* Tag */}
      <div
        className={`${style.categoryBg} text-white text-[10px] font-semibold px-2.5 py-[3px] rounded-full w-fit mb-3 leading-none`}
      >
        {card.categoryTag} Housing
      </div>

      {/* Heading Group */}
      <div className="flex items-center gap-2 mb-1">
        <img
          src={style.icon}
          alt={card.title}
          className="w-5 h-5 object-contain"
        />
        <h3 className="text-[14px] leading-[18px] font-bold text-black">
          {card.title}
        </h3>
      </div>

      <p className="text-[11px] leading-[16px] text-[#3F3F3F] mt-1.5 mb-1.5 font-medium">
        {card.pricingRange}
      </p>

      {/* Description */}
      <p className="text-[11px] leading-[16px] text-[#000000] mb-3 min-h-[32px]">
        {card.description}
      </p>

      {/* Features - flex-grow pushes the image and button down */}
      <div className="space-y-2 mb-3 flex-grow">
        {card.features?.map(
          (feature, i) =>
            feature && (
              <div key={i} className="flex items-start gap-1.5">
                <CheckCircle2
                  size={12}
                  className={`${style.text} mt-[2px] shrink-0`}
                  strokeWidth={2.5}
                />
                <p className="text-[11px] leading-[15px] text-[#222]">
                  {feature}
                </p>
              </div>
            )
        )}
      </div>

      {/* Image Section - Locked height */}
      <div className="rounded-[10px] overflow-hidden h-[85px] w-full mb-3 shrink-0">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Button - mt-auto ensures it stays at the very bottom */}
      <Link
        href={`/properties?category=${card.categoryTag}${card.categoryTag === 'Luxury' ? '&budget=440' : ''}`}
        className={`mt-auto h-[36px] w-full rounded-[10px] border ${style.buttonBorder} ${style.text} bg-white font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-white/80 transition-all shadow-sm`}
      >
        View {card.categoryTag} Homes
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}