"use client";
import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldAlert, Scale, ArrowLeft } from 'lucide-react';

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-[#742E85] p-8 text-white">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Privacy Policy
                    </h1>
                          </div>

                <div className="p-8 md:p-12 space-y-10">

                    {/* Quick Summary Box */}


                    {/* Section 1: Accuracy and Verification */}
                    <section>

                        <div className="text-gray-600 leading-relaxed space-y-4 border-l-2  border-gray-100 pl-6">
                            <p>
                                Piinggaksha.com endeavors to prevent misrepresentation, fraud, illegal, and unlawful activities by users but does not guarantee the accuracy, correctness, or reliability of information/content on the site. </p>
                            <p>
                                Users are expected to verify the accuracy of information provided by other users and should not consider it as advice from Piinggaksha.com. Legal consultation is advised before acting upon any such information.  </p>
                            <p>Use of Piinggaksha.com is at the user’s sole risk, and the service comes with no warranties. Liability is strictly limited, and remedies are restricted by agreement.</p>
                            <p>Piinggaksha.com is not liable for verifying the authenticity of content posted by users, including property details, opinions, etc. It only serves as a platform for communication between property seekers, providers, and related services.</p>
                            <p>Piinggaksha.com does not guarantee users’ financial capabilities or ensure compliance between property parties. It is not responsible for inaccurate content or technical issues associated with the service.</p>
                            <p>Piinggaksha.com assumes no responsibility for errors, interruptions, or unauthorized access to user communications. Piinggaksha.com is not liable for any loss or damage resulting from the use of its service or content posted on the site.</p>
                        
                        </div>
                    </section>




                </div>

                {/* Footer */}

            </div>
        </div>
    );
}