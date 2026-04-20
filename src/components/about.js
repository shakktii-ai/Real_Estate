import Image from "next/image"
export default function About() {
    return (
        <section className="px-6 py-20 lg:px-16">
            <h2 className="text-4xl lg:text-[40px] font-bold text-[#E5097F] mb-12">
                What They <br /> Say About Us
            </h2>
            <div className="relative max-w-6xl mx-auto flex items-center gap-6 ">
                <div className="bg-[#F4F4F4] p-6 rounded-[21px] flex-1 flex flex-col md:flex-row gap-12 items-center border shadow-md ">
                    <div className="w-[362px] h-[259px] rounded-[21px] flex-shrink-0 overflow-hidden relative">
                        <Image
                            src="/rectangle-4854.png"
                            alt="Swapnil Birhamane"
                            fill
                            className="object-cover"
                            sizes="362px"
                        />
                    </div>
                    <div className="flex-1 text-black font-roboto-condensed">
                        <div className="text-[#742E85] text-5xl ">“</div>
                        <p className="text-md leading-relaxed mb-1 ">
                            I highly recommend PIINGGAKSHA for their exceptional service
                            and professionalism. Abhishek Tripathi and his team made my
                            property purchase in Pune, a seamless experience. Their
                            honesty, transparency, and dedication to client satisfaction
                            truly stood out. Thank you, Abhishek and team, for a
                            hassle-free journey!
                        </p>
                        <div className="mb-4 text-yellow-500 text-xl flex gap-1">
                            {"★".repeat(5)}
                        </div>
                        <span className="text-md font-bold text-black uppercase tracking-wider block">
                            by Swapnil Birhamane
                        </span>
                    </div>
                </div>

                <div className="flex text-[#742E85] gap-4">
                    <button className="w-6 h-6 border-2 border-primary-purple rounded-full flex items-center justify-center text-primary-purple hover:cursor-pointer hover:w-8 hover:h-8 transition-all">
                        <svg
                            className="w-6 h-6 rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                    <button className="w-6 h-6 border-2 border-primary-purple rounded-full flex items-center justify-center text-primary-purple hover:cursor-pointer hover:w-8 hover:h-8 transition-all">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    )
}