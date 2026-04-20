import React from 'react';
import { ShieldCheck, MonitorPlay, CheckCircle } from 'lucide-react';



export default function WhyChooseUs() {
    return (
        <section className="bg-white overflow-hidden my-8">
            {/* Grid fix: lg:grid-cols-12 */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12">

                {/* Left Side */}
                <div className="lg:col-span-7 space-y-2 relative bg-gradient-to-bl from-[#FAE6FF] to-[#742E85] text-white flex flex-col justify-center px-8 md:px-14 lg:px-6 pt-2 pb-32 lg:rounded-r-[500px] overflow-hidden max-h-[800px]">
                    <div className="relative z-10 max-w-md">
                        <h2 className="text-5xl md:text-6xl font-black leading-[0.95] mb-6">
                            WHY <br /> CHOOSE US
                        </h2>
                        <p className="text-lg md:text-[28px] leading-[1.35] text-white/90 font-normal">
                            We provide verified listings with transparent information to help you make informed decisions.
                        </p>
                    </div>

                    <img
                        src="/Why.png"
                        alt="Cityscape"
                        className="absolute bottom-0 left-0 w-full object-cover opacity-80"
                    />
                </div>

                {/* Right Side */}
                <div className="lg:col-span-5 px-8 md:px-14 lg:px-12 py-16 flex flex-col justify-center space-y-24">

                    <div

                        className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                    >
                        <div className={`flex items-center shrink-0 -ml-45 z-10`}>
                            {/* Icon background updated to purple to match theme */}
                            <div className="w-24 h-24 rounded-full bg-[#ffffff] shadow-[0_10px_20px_rgba(116,46,133,0.2)] flex items-center justify-center">
                                <img src='/nobrokerage.png' alt='brokerage' className="w-24 h-24 text-white" />
                            </div>
                            {/* Connector line */}
                            <div className="hidden sm:block w-12 h-[2px] bg-black ml-4" />
                        </div>

                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-bold text-[#111] mb-3">
                                No Brokerage. Free Property Consultation.
                            </h3>
                            <p className="text-[#666] text-sm leading-relaxed max-w-sm">
                                Buy your dream home without paying brokerage. Get expert guidance, project comparison, and personalized property recommendations completely free.
                            </p>
                        </div>
                    </div>
                    <div

                        className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                    >
                        <div className={`flex items-center shrink-0 -ml-24 z-10`}>
                            {/* Icon background updated to purple to match theme */}
                            <div className="w-24 h-24 rounded-full bg-[#ffffff] shadow-[0_10px_20px_rgba(116,46,133,0.2)] flex items-center justify-center">
                                <img src='/virtualtour.png' className="w-24 h-24 text-white" />
                            </div>
                            {/* Connector line */}
                            <div className="hidden sm:block w-12 h-[2px] bg-black ml-4" />
                        </div>

                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-bold text-[#111] mb-3">
                                Virtual Tours & Transparent Bottom-Line Pricing
                            </h3>
                            <p className="text-[#666] text-sm leading-relaxed max-w-sm">
                               Explore projects through virtual presentations and 3D visualization. Know the final price upfront with complete cost transparency—no hidden charges.</p>
                        </div>
                    </div>
                    <div

                        className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                    >
                        <div className={`flex items-center shrink-0 -ml-36 z-10`}>
                            {/* Icon background updated to purple to match theme */}
                            <div className="w-24 h-24 rounded-full bg-[#ffffff] shadow-[0_10px_20px_rgba(116,46,133,0.2)] flex items-center justify-center">
                                <img src='/trusted.png' className="w-24 h-24 text-white" />
                            </div>
                            {/* Connector line */}
                            <div className="hidden sm:block w-12 h-[2px] bg-black ml-4" />
                        </div>

                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-bold text-[#111] mb-3">
                                100% Trusted Platform with End-to-End Support
                            </h3>
                            <p className="text-[#666] text-sm leading-relaxed max-w-sm">
                               From property discovery to site visits, negotiation, and booking—we provide complete assistance with verified projects and reliable support at every step.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}