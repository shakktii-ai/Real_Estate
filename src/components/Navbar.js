"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AuthModal from "../components/AuthModal";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Bell, Heart, LogOut, Phone, User, Menu, X } from "lucide-react";


const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Properties", href: "/properties" },
    { name: "Blogs", href: "/blogs" },
    { name: "EMI Calculator", href: "/emi" },
    { name: "About Us", href: "/about" },
    ...(user ? [{ name: "Referrals", href: "/referrals" }] : []),
  ];

  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/wishlist/get?userId=${user.uid}`);
        const data = await res.json();
        setWishlistCount(data.length);
      } catch (error) { console.error("Failed to fetch wishlist count", error); }
    };
    fetchWishlistCount();
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/notifications?role=user&userId=${user.uid}`);
        const data = await res.json();
        setNotifications(data);
      } catch (error) { console.error("Failed to fetch notifications", error); }
    };
    fetchNotifications();
  }, [user]);
  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleNotificationClick = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMobileMenuOpen(false);
      router.replace("/");
    } catch (error) { console.error("Error signing out: ", error); }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="flex items-center justify-between px-1 py-1 bg-white sticky top-0 z-50 text-[#742E85] shadow-sm">

      {/* LEFT: Burger (Mobile) & Logo */}
      <div className="flex items-center gap-2">
        {/* Burger Button - Mobile Only */}
        <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link href="/" className="flex items-center">
          <div className="relative w-[100px] h-[50px] md:h-[100px] shrink-0 ml-0 md:ml-12">
            <img src="/piinggaksha.png" alt="Logo" className="object-contain w-full h-full" />
          </div>
        </Link>
      </div>

      {/* CENTER: Desktop Nav Links */}
      <div className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-md font-medium pb-1 transition-all ${pathname === link.href ? "text-[#742E85] border-b-2 border-[#E5097F]" : "hover:text-[#E5097F]"}`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3">

        {/* Contact Us (Desktop Only) */}
        <Link href="/contact" className="hidden md:flex bg-[#742E85] text-white px-4 py-2 rounded-lg items-center gap-2 hover:bg-[#652674]">
          <Phone size={18} /> Contact
        </Link>

        {user ? (
          <>
            {/* Notification Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setOpen(!open)} className="relative p-2 text-black hover:text-[#742E85]">
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{unreadCount}</span>}
              </button>
              {open && (
                <div className="absolute right-0 md:right-0 mt-2 w-[220px] md:w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-[70vh] overflow-y-auto">
                  <div className="p-3 border-b font-bold text-[#742E85] sticky top-0 bg-white">Notifications</div>
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 text-center">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n._id)}
                        className={`p-3 border m-2 rounded hover:bg-gray-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-purple-100 ' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-semibold text-black">{n.title}</p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                            {formatTimeAgo(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>

            {/* Wishlist */}
            <Link href='/wishlist' className="relative p-2 text-black hover:text-[#742E85]">
              <Heart size={20} />
              {wishlistCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{wishlistCount}</span>}
            </Link>

            {/* User Profile & Logout (Desktop hidden on mobile to save space if needed, or keep both) */}
            <Link href="/profile" className="hidden md:flex text-black"><User size={20} /></Link>
            <button onClick={handleLogout} className="hidden md:flex text-black hover:cursor-pointer"><LogOut size={20} /></button>
          </>
        ) : (
          <button onClick={() => setShowModal(true)} className="bg-[#E5097F] text-white px-4 py-2 rounded-lg">SignUp</button>
        )}
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white  flex flex-col p-4 shadow-xl md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="py-3 font-medium">
              {link.name}
            </Link>
          ))}
          <Link href="/contact" onClick={()=>setIsMobileMenuOpen(false)} className="py-3  font-medium text-[#742E85]">Contact Us</Link>
          {/* <Link href="/profile" onClick={()=>setIsMobileMenuOpen(false)} className="py-3  font-medium text-[#742E85]">My Profile</Link> */}
          <button onClick={handleLogout} className="text-left py-3 text-red-600 font-bold">Logout</button>
        </div>
      )}

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </nav>
  );
};

export default Navbar;