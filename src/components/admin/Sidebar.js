"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Home,
  ClipboardList,
  Calendar,
  BookOpen,
  MessageSquare,
  Settings,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard Overview", icon: LayoutDashboard, link: "/admin" },
  { name: "Users & Registrations", icon: Users, link: "/admin/users" },
  { name: "Homepage Management", icon: Home, link: "/admin/home" },
  { name: "Projects Management", icon: ClipboardList, link: "/admin/projects" },
  { name: "Calendar & Bookings", icon: Calendar, link: "/admin/calenderandbooking" },
  { name: "Blogs", icon: BookOpen, link: "/admin/blogs" },
  { name: "Contact & Inquiries", icon: MessageSquare, link: "/admin/contact" },
  { name: "Settings", icon: Settings, link: "/admin/settings" },
];

// components/admin/Sidebar.js
export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-white border-r border-gray-200 shadow-xl p-4 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block md:shadow-md h-full
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.link;
            return (
              <Link 
                key={item.name} 
                href={item.link} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive 
                    ? "bg-[#742E85] text-white shadow-lg shadow-purple-200" 
                    : "text-gray-500 hover:bg-purple-50 hover:text-[#742E85]"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}