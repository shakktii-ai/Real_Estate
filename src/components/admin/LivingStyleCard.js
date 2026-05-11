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
      className={`w-[270px] min-w-[270px] h-full min-h-[520px] rounded-[26px] border ${style.border} ${style.bg} shadow-[0_8px_24px_rgba(0,0,0,0.12)] px-5 pt-4 pb-5 flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]`}
    >
      {/* Tag */}
      <div
        className={`${style.categoryBg} text-white text-[11px] font-semibold px-3 py-1 rounded-full w-fit mb-5 leading-none`}
      >
        {card.categoryTag} Housing
      </div>

      {/* Heading Group */}
      <div className="flex items-center gap-3 mb-1">
        <img
          src={style.icon}
          alt={card.title}
          className="w-7 h-7 object-contain"
        />
        <h3 className="text-[18px] leading-[22px] font-bold text-black">
          {card.title}
        </h3>
      </div>

      <p className="text-[12px] leading-[18px] text-[#3F3F3F] mt-2 mb-2 font-medium">
        {card.pricingRange}
      </p>

      {/* Description - Added min-h to keep text alignment similar */}
      <p className="text-[12px] leading-[18px] text-[#000000] mb-4 min-h-[36px]">
        {card.description}
      </p>

      {/* Features - flex-grow pushes the image and button down */}
      <div className="space-y-3 mb-5 flex-grow">
        {card.features?.map(
          (feature, i) =>
            feature && (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2
                  size={14}
                  className={`${style.text} mt-[2px] shrink-0`}
                  strokeWidth={2.5}
                />
                <p className="text-[13px] leading-[18px] text-[#222]">
                  {feature}
                </p>
              </div>
            )
        )}
      </div>

      {/* Image Section - Locked height */}
      <div className="rounded-[14px] overflow-hidden h-[110px] w-full mb-5 shrink-0">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Button - mt-auto ensures it stays at the very bottom */}
      <Link href={`/properties?category=${card.categoryTag}`}
        className={`mt-auto h-[46px] w-full rounded-[12px] border ${style.buttonBorder} ${style.text} bg-white font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-white/80 transition-all shadow-sm`}
      >
        View {card.categoryTag} Homes
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}