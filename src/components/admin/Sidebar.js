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
  { name: "Users & Registrations", icon: Users, link: "/admin/user" },
  { name: "Homepage Management", icon: Home, link: "/admin/home" },
  { name: "Living Style Cards", icon: ClipboardList, link: "/admin/stylecard" },
  { name: "Projects Management", icon: ClipboardList, link: "/admin/projects" },
  { name: "Calendar & Bookings", icon: Calendar, link: "/admin/calendar" },
  { name: "Blogs", icon: BookOpen, link: "/admin/blogs" },
  { name: "Contact & Inquiries", icon: MessageSquare, link: "/admin/contact" },
  { name: "Settings", icon: Settings, link: "/admin/settings" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-4 flex items-center justify-between">
        <img
          src="/piinggaksha.png"
          alt="Logo"
          className="h-8 object-contain"
        />

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md border border-gray-200 text-[#703081]"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 p-4 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-64`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-2">
          <Link href="/" className="flex items-center">
            <img
              src="/piinggaksha.png"
              alt="Logo"
              className="h-10 object-contain"
            />
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 overflow-y-auto h-[calc(100vh-100px)] pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.link;

            return (
              <Link
                key={item.name}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#703081] text-white shadow-md shadow-purple-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#703081]"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-white" : "text-gray-400"}
                />
                <span className="text-[14px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}