"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AuthModal from "../components/AuthModal";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Bell, LogOut, Phone, ScanLine, User, User2Icon } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Properties", href: "/properties" },
    { name: "Blogs", href: "/blogs" },
    { name: "EMI Calculator", href: "/emi" },
    { name: "Referrals", href: "/referrals" },
    { name: "About Us", href: "/about" },
  ];
  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/user/profile/${user.uid}`);
        const data = await res.json();

        setProfileCompleted(data.profileCompleted);
      } catch (error) {
        console.error("Failed to fetch profile status", error);
      }
    };

    checkProfileStatus();
  }, [user]);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload(); // Refresh to clear React state
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <nav className="flex items-center justify-between px-2 py-2 bg-white sticky top-0 z-50 text-[#742E85]">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 px-8 py-2">
          <div className="relative w-[38px] h-[38px] sm:w-[44px] sm:h-[44px] md:w-[120px] md:h-[90px] shrink-0">
            <img
              src="/piinggaksha.png"
              alt="MockMingle Logo"

              className="object-contain"
            />
          </div>
        </Link>
        <div className="hidden md:flex gap-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-md font-medium pb-1 transition-all ${isActive
                  ? "text-[#742E85] border-b-2 border-[#E5097F]"
                  : "text-[#742E85] hover:text-[#742E85]"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
       <Link href='/contact'> <button className="bg-[#742E85] text-white text-lg px-6 py-2 rounded-lg  flex items-center gap-2 hover:bg-[#652674] hover:cursor-pointer transition-colors">
          <Phone size={20} />Contact Us
        </button>
        </Link>
        {user ? (
          <>
            <button className="p-2 text-black hover:text-[#742E85] transition-colors hover:cursor-pointer">
              <Bell size={20} />
            </button>
            <Link href='/profile'>
              <button className="p-2  hover:text-[#742E85] transition-colors hover:cursor-pointer">
                <img
                  src="/profile.png"
                  alt="MockMingle Logo"

                  className="object-contain text-black"
                />

              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="text-black hover:cursor-pointer"
            >
              <LogOut />
            </button>
          </>
        ) : (
          <button onClick={() => setShowModal(true)} className="bg-[#E5097F] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:cursor-pointer">
            SignUp
          </button>
        )}




      </div>
      {showModal && (
        <AuthModal
          onClose={() => {
            setShowModal(false);
            setProfileCompleted(true);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;