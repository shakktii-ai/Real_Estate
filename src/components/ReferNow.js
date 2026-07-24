import Link from "next/link";

const steps = [
  "Refer a friend or family member",
  "They visit & book a project with us",
  "You receive up to ₹50,000*",
];

export default function ReferEarnSection() {
  return (
    <section className="py-8 lg:py-14 px-5 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left */}
          <div className="order-2 lg:order-1 text-left lg:text-left">

            <p className="text-black text-sm font-medium">
              Refer & Earn
            </p>

            <h2 className="mt-2 text-[30px] sm:text-[34px] lg:text-[42px] font-bold leading-tight text-[#742E85]">
              Earn Up to
              <br />
              <span className="text-[#E5097F]">₹50,000*</span>
              <span className="text-[#742E85]"> per Referral!</span>
            </h2>

            <p className="mt-4 text-black text-[15px] lg:text-[16px] leading-6 max-w-xl mx-auto lg:mx-0">
              Know someone looking for a home in Pune? Refer them to
              PIINGGAKSHA and earn a reward for every successful deal.
              It's that simple!
            </p>

            {/* Steps */}
            <div className="mt-6 space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center justify-start lg:justify-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E5097F]/20 text-black text-sm flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>

                  <p className="text-[15px] text-black">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/referrals"
              className="mt-8 inline-flex w-full sm:w-[320px] md:w-[500px] h-14 rounded-xl bg-[#E5097F] text-white font-semibold items-center justify-center shadow-lg hover:bg-[#d10873] transition"
            >
              Refer Now & Earn
            </Link>

          </div>

          {/* Right */}
          <div className="order-1 lg:order-2">
            <img
              src="/referImg.png"
              alt="Refer & Earn"
              className="w-full h-[220px] sm:h-[300px] lg:h-[380px] object-cover rounded-2xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
}