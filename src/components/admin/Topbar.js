"use client";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const pageConfigs = {
    "/admin": { title: "Welcome", subtitle: "To Dashboard Overview" },
    "/admin/users": { title: "Users & Registrations, ", subtitle: "Manage and view all user registrations" },
    "/admin/home": { title: "Homepage Management,", subtitle: "Customize your homepage content and appearance" },
    "/admin/projects": { title: "Projects Management,", subtitle: "Manage all your property projects" },
    "/admin/calenderandbooking": { title: "Calendar & Bookings,", subtitle: "Manage site visits and virtual tour bookings" },
    "/admin/blogs": { title: "Blog Management,", subtitle: "Create and manage blog posts" },
    "/admin/contact": { title: "Contact & Inquiries,", subtitle: "Manage customer inquiries and messages" },
    "/admin/setting": { title: "Settings,", subtitle: "Manage your admin panel settings and preferences" }
};

export default function Header() {
    const pathname = usePathname();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const formatTimeAgo = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("/api/notifications?role=admin");
                const data = await res.json();
                setNotifications(data);
            } catch (error) {
                console.error("Notification fetch error", error);
            }
        };
        fetchNotifications();
    }, []);

    // Outside click listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle clicking a notification
    const handleNotificationClick = async (id) => {
        // 1. Optimistic Update: Change UI immediately
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );

        // 2. Database Update
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

    // Filter by isRead (from your model)
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const current = pageConfigs[pathname] || { title: "Dashboard", subtitle: "Welcome back" };

    return (
        <header className="h-20 w-full bg-white border-b border-gray-200 shadow-md flex items-center justify-between px-8 z-50 fixed top-0">
            <div className="flex items-center gap-8 ml-12">
                <img src="/piinggaksha.png" alt="Logo" className="h-18 w-auto object-contain " />
                <div className="ml-24">
                    <h1 className="text-xl font-bold text-black">{current.title}</h1>
                    <p className="text-sm text-gray-500">{current.subtitle}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <img src="/admin-avatar.jpg" className="w-10 h-10 rounded-full" alt="Admin" />
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setOpen(!open)} className="relative p-2">
                        <Bell className="text-gray-600" size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50 max-h-[70vh] overflow-y-auto ">
                            <div className="p-3 border-b font-bold text-[#742E85]">Notifications</div>
                            {notifications.length === 0 ? (
                                <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => handleNotificationClick(n._id)}
                                        className={`p-3 border rounded m-2 hover:bg-gray-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-[#F3E8FF] shadow-md' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-semibold text-black">{n.title}</p>

                                            {/* Timestamp Display */}
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                {formatTimeAgo(n.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">{n.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}