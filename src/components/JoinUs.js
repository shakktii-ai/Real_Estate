import Link from "next/link";

export default function GrowBusinessSection() {
  return (
    <section className="py-8 lg:py-12 px-5">
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h2 className="text-[30px] sm:text-[34px] lg:text-[36px] font-bold leading-tight text-[#742E85]">
              Grow Your Real Estate
              <br />
              Business With Us
            </h2>

            <p className="text-[15px] mt-5 text-black leading-6 max-w-[500px] mx-auto lg:mx-0">
              Join PIINGGAKSHA's growing network of brokers and independent
              agents. Get access to premium projects, transparent commissions
              and dedicated support — everything you need to close more deals.
            </p>

            <Link
              href="http://pingaksha.leadpluss.com/ChannelPartnerEnquiryFormForBroker/Abhishek5413"
              target="_blank"
              className="mt-6 inline-flex w-full sm:w-[280px] lg:w-[500px] h-12 items-center justify-center rounded-xl bg-[#E5097F] text-white font-semibold shadow-lg hover:bg-[#d10873] transition"
            >
              Work With Us
            </Link>
          </div>

          {/* Right */}
          <div className="order-1 lg:order-2">
            <img
              src="/joinus.png"
              alt="Grow with PIINGGAKSHA"
              className="w-full h-[220px] sm:h-[280px] lg:h-[320px] object-cover rounded-2xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
}