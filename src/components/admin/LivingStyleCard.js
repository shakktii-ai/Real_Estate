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
    <div
      className={`w-[270px] min-w-[270px] rounded-[26px] border ${style.border} ${style.bg} shadow-[0_8px_24px_rgba(0,0,0,0.12)] px-5 pt-4 pb-3 flex flex-col`}
    >
      {/* Tag */}
      <div
        className={`${style.categoryBg} text-white text-[11px] font-semibold px-3 py-1 rounded-full w-fit mb-5 leading-none`}
      >
        {card.categoryTag} Housing
      </div>

      {/* Heading */}
      <div className="flex items-center gap-3 mb-1">
        <img
          src={style.icon}
          alt={card.title}
          className="w-7 h-7 object-contain "
        />

        <div>
          <h3 className="text-[18px] leading-[22px] font-semibold text-black">
            {card.title}
          </h3>

          
        </div>
      </div>
<p className="text-[12px] leading-[18px] text-[#3F3F3F] mt-2 mb-2">
            {card.pricingRange}
          </p>
      {/* Description */}
      <p className="text-[12px] leading-[18px] text-[#000000]  mb-4">
        {card.description}
      </p>

      {/* Features */}
      <div className="space-y-3 mb-5 flex-1">
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

      {/* Image */}
      <div className="rounded-[14px] overflow-hidden h-[110px] mt-2 mb-4">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Button */}
      <Link href={`/properties?category=${card.categoryTag}`}
        className={`mt-auto h-[44px] rounded-[12px] border ${style.buttonBorder} ${style.text} bg-white font-semibold text-[13px] flex items-center justify-center gap-2 hover:scale-[1.01] transition-all`}
      >
        View {card.categoryTag} Homes
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}