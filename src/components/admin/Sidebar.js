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
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-300 shadow-md p-4 h-full hidden md:block">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.link;
          return (
            <Link key={item.name} href={item.link} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${isActive ? "bg-[#703081] text-white" : "text-gray-500 hover:bg-gray-50"}`}>
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}