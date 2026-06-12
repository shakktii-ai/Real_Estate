"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "@/lib/context/AuthContext";
const Footer = () => {
  const { user } = useAuth();
  return (
    <footer className="bg-footer-gradient py-4 px-4 lg:px-4 text-black relative">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-10">
    {/* Brand / Logo + Address block - stays full width on mobile */}
    <div className="lg:col-span-1 flex flex-col items-center">
      <div className="mb-2 relative w-[158px] h-[80px]">
        <Image
          src="/piinggaksha.png"
          alt="PIINGGAKSHA REALTY"
          fill
          className="object-contain"
          sizes="158px"
        />
      </div>
      <p className="text-[10px] md:text-[10px] leading-relaxed uppercase text-center lg:text-left">
        ILESEUM CO-WORKING SPACE, GANGA GLITZ, KAD NAGAR, UNDRI, PUNE,
        MAHARASHTRA 411060
      </p>
    </div>

    {/* Mobile Wrapper: Combines the remaining 4 sections into a 2-column grid row on mobile, passes through seamlessly on desktop */}
    <div className="grid grid-cols-2 gap-2 md:contents col-span-1 md:col-span-1 lg:col-span-4">
      {/* Quick Links */}
      <div>
        <h3 className="text-[12px] md:text-[14px] font-bold text-[#742E85] mb-1">
          Quick Links
        </h3>
        <ul className="space-y-0.5 text-[10px] md:text-[12px]">
          <li>
            <Link href="/" className="hover:text-[#E61E8C]">
              Home
            </Link>
          </li>
          <li>
            <Link href="/properties" className="hover:text-[#E61E8C]">
              Explore Properties
            </Link>
          </li>
          <li>
            <Link href="/emi" className="hover:text-[#E61E8C]">
              EMI Calculator
            </Link>
          </li>
          <li>
            <Link href="/blogs" className="hover:text-[#E61E8C]">
              Blogs
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/referrals" className="hover:text-[#E61E8C]">
                Referrals
              </Link>
            </li>
          )}
          <li>
            <Link href="/about" className="hover:text-[#E61E8C]">
              About Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h3 className="text-[12px] md:text-[14px] font-bold text-[#742E85] mb-1">
          Legal
        </h3>
        <ul className="space-y-0.5 text-[10px] md:text-[12px]">
          <li>
            <Link href="/terms" className="hover:text-[#E61E8C]">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:text-[#E61E8C]">
              Privacy Policy
            </Link>
          </li>
        </ul>
      </div>

      {/* Property Types */}
      <div>
        <h3 className="text-[12px] md:text-[14px] font-bold text-[#742E85] mb-1">
          Property
        </h3>
        <ul className="space-y-0.5 text-[10px] md:text-[12px]">
          <li>Affordable</li>
          <li>Premium</li>
          <li>Luxury</li>
          <li>Holiday</li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-[12px] md:text-[14px] font-bold text-[#742E85]">
          Contact Us
        </h3>
        <ul className="space-y-0.5 text-[10px] md:text-[12px]">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.405 5.405l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            9284429197
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.405 5.405l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            9284570188
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.405 5.405l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            020-49001704
          </li>
          <li className="flex items-center gap-2 underline">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=info@piinggaksha.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E61E8C] transition-colors"
            >
              info@piinggaksha.com
            </a>
          </li>
        </ul>
        {/* Social Media Icons */}
        <div className="flex gap-4 mt-2">
          <a
            href="#"
            className="w-6 h-6 rounded-full border border-[#742E85] flex items-center justify-center text-[#742E85] hover:bg-[#742E85] hover:text-white transition-all shadow-sm"
          >
            <FaFacebookF size={12} />
          </a>
          <a
            href="#"
            className="w-6 h-6 rounded-full border border-[#742E85] flex items-center justify-center text-[#742E85] hover:bg-[#742E85] hover:text-white transition-all shadow-sm"
          >
            <FaInstagram size={12} />
          </a>
          <a
            href="#"
            className="w-6 h-6 rounded-full border border-[#742E85] flex items-center justify-center text-[#742E85] hover:bg-[#742E85] hover:text-white transition-all shadow-sm"
          >
            <FaWhatsapp size={12} />
          </a>
        </div>
      </div>
    </div>
  </div>

  {/* Copyright / Bottom Bar */}
  <div className="mt-1 pt-2 border-t border-zinc-400 text-center font-inter text-xs md:text-sm lg:text-[12px]">
    <p className="font-bold">© 2026 PIINGGAKSHA. All rights reserved. | RERA Registration Pending</p>
    <p className="mt-1 text-black text-[8px] md:text-[10px]">
      All projects displayed are RERA registered. Please verify RERA details before making any decision.
    </p>
  </div>
</footer>
  );
};

export default Footer;
