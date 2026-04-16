"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ScanLine } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "" },
    { name: "Explore Properties", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: "EMI Calculator", href: "/emi" },
    { name: "Referrals", href: "/referrals" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b sticky top-0 z-50 text-[#742E85]">
      <div className="flex items-center gap-10">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">Logo</div>

        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[14px] font-medium pb-1 transition-all ${
                  isActive
                    ? "text-[#742E85] border-b-2 border-[#E5097F]"
                    : "text-[#742E85]/70 hover:text-[#742E85]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
         <button className="bg-[#742E85] text-white text-[14px] px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#652674] transition-colors">
          Contact Us
        </button>
        <button className="p-2 text-gray-500 hover:text-[#742E85] transition-colors">
          <Bell size={20} />
        </button>

        <button className="p-2 text-gray-500 hover:text-[#742E85] transition-colors">
          <ScanLine size={20} />
        </button>

       
      </div>
    </nav>
  );
};

export default Navbar;