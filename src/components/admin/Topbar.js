// "use client";
// import { usePathname } from "next/navigation";
// import { Bell } from "lucide-react";
// import { useEffect, useState, useRef } from "react";

// const pageConfigs = {
//     "/admin": { title: "Welcome", subtitle: "To Dashboard Overview" },
//     "/admin/users": { title: "Users & Registrations, ", subtitle: "Manage and view all user registrations" },
//     "/admin/home": { title: "Homepage Management,", subtitle: "Customize your homepage content and appearance" },
//     "/admin/projects": { title: "Projects Management,", subtitle: "Manage all your property projects" },
//     "/admin/calenderandbooking": { title: "Calendar & Bookings,", subtitle: "Manage site visits and virtual tour bookings" },
//     "/admin/blogs": { title: "Blog Management,", subtitle: "Create and manage blog posts" },
//     "/admin/contact": { title: "Contact & Inquiries,", subtitle: "Manage customer inquiries and messages" },
//     "/admin/settings": { title: "Settings,", subtitle: "Manage your admin panel settings and preferences" }
// };

// export default function Header() {
//     const pathname = usePathname();
//     const [notifications, setNotifications] = useState([]);
//     const [open, setOpen] = useState(false);
//     const dropdownRef = useRef(null);
//     const formatTimeAgo = (date) => {
//         const now = new Date();
//         const past = new Date(date);
//         const diffInSeconds = Math.floor((now - past) / 1000);

//         if (diffInSeconds < 60) return "Just now";
//         if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
//         if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
//         return `${Math.floor(diffInSeconds / 86400)} days ago`;
//     };
//     useEffect(() => {
//         const fetchNotifications = async () => {
//             try {
//                 const res = await fetch("/api/notifications?role=admin");
//                 const data = await res.json();
//                 setNotifications(data);
//             } catch (error) {
//                 console.error("Notification fetch error", error);
//             }
//         };
//         fetchNotifications();
//     }, []);

//     // Outside click listener
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     // Handle clicking a notification
//     const handleNotificationClick = async (id) => {
//         // 1. Optimistic Update: Change UI immediately
//         setNotifications((prev) =>
//             prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
//         );

//         // 2. Database Update
//         try {
//             await fetch(`/api/notifications/${id}`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ isRead: true }),
//             });
//         } catch (error) {
//             console.error("Failed to mark as read", error);
//         }
//     };

//     // Filter by isRead (from your model)
//     const unreadCount = notifications.filter((n) => !n.isRead).length;
//     const current = pageConfigs[pathname] || { title: "Dashboard", subtitle: "Welcome back" };

//     return (
//         <header className="h-20 w-full bg-white border-b border-gray-200 shadow-md flex items-center justify-between px-8 z-50 fixed top-0">
//             <div className="flex items-center gap-8 ml-12">
//                 <img src="/piinggaksha.png" alt="Logo" className="h-18 w-auto object-contain " />
//                 <div className="ml-24">
//                     <h1 className="text-xl font-bold text-black">{current.title}</h1>
//                     <p className="text-sm text-gray-500">{current.subtitle}</p>
//                 </div>
//             </div>

//             <div className="flex items-center gap-6">
//                 <div className="flex items-center gap-3">
//                     <img src="/admin-avatar.jpg" className="w-10 h-10 rounded-full" alt="Admin" />
//                 </div>

//                 <div className="relative" ref={dropdownRef}>
//                     <button onClick={() => setOpen(!open)} className="relative p-2">
//                         <Bell className="text-gray-600" size={22} />
//                         {unreadCount > 0 && (
//                             <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
//                                 {unreadCount}
//                             </span>
//                         )}
//                     </button>

//                     {open && (
//                         <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-50 max-h-[70vh] overflow-y-auto ">
//                             <div className="p-3 border-b font-bold text-[#742E85]">Notifications</div>
//                             {notifications.length === 0 ? (
//                                 <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
//                             ) : (
//                                 notifications.map((n) => (
//                                     <div
//                                         key={n._id}
//                                         onClick={() => handleNotificationClick(n._id)}
//                                         className={`p-3 border rounded m-2 hover:bg-gray-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-[#F3E8FF] shadow-md' : ''}`}
//                                     >
//                                         <div className="flex justify-between items-start">
//                                             <p className="text-sm font-semibold text-black">{n.title}</p>

//                                             {/* Timestamp Display */}
//                                             <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
//                                                 {formatTimeAgo(n.createdAt)}
//                                             </span>
//                                         </div>
//                                         <p className="text-xs text-gray-500">{n.message}</p>
//                                     </div>
//                                 ))
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// }

"use client";
import { usePathname } from "next/navigation";
import { Bell, Settings, LogOut, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const pageConfigs = {
    "/admin": { title: "Welcome", subtitle: "To Dashboard Overview" },
    "/admin/users": { title: "Users & Registrations, ", subtitle: "Manage and view all user registrations" },
    "/admin/home": { title: "Homepage Management,", subtitle: "Customize your homepage content and appearance" },
    "/admin/projects": { title: "Projects Management,", subtitle: "Manage all your property projects" },
    "/admin/calenderandbooking": { title: "Calendar & Bookings,", subtitle: "Manage site visits and virtual tour bookings" },
    "/admin/blogs": { title: "Blog Management,", subtitle: "Create and manage blog posts" },
    "/admin/contact": { title: "Contact & Inquiries,", subtitle: "Manage customer inquiries and messages" },
    "/admin/settings": { title: "Settings,", subtitle: "Manage your admin panel settings and preferences" }
};

export default function Header() {
    const pathname = usePathname();
    const [notifications, setNotifications] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState({ name: "Admin User", role: "Admin" });
    const dropdownRef = useRef(null);
    const profileRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("adminUser");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing stored user", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminUser");
        router.push("/admin/login");
    };
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
                setNotifOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
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

            <div className="flex items-center gap-4">
                {/* Notifications Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <Bell className="text-gray-600" size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-2xl shadow-xl z-50 max-h-[70vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b font-bold text-[#742E85] flex justify-between items-center">
                                <span>Notifications</span>
                                <span className="text-[10px] bg-purple-100 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                            </div>
                            {notifications.length === 0 ? (
                                <p className="p-8 text-sm text-gray-500 text-center">No notifications yet</p>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => {
                                            handleNotificationClick(n._id);
                                            setNotifOpen(false);
                                        }}
                                        className={`p-4 border-b last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${!n.isRead ? 'bg-purple-50/50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-bold text-gray-900">{n.title}</p>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                {formatTimeAgo(n.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-gray-200 mx-2"></div>

                {/* Profile Section */}
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 p-1 pr-3 hover:bg-gray-50 rounded-2xl transition-all"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 leading-none">{user.name || "John Doe"}</p>
                            <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider font-medium">{user.role || "Admin"}</p>
                        </div>
                        <div className="relative">
                            {user.profileImage ? (
                                <img 
                                    src={user.profileImage} 
                                    className="w-10 h-10 rounded-full border-2 border-purple-100 object-cover" 
                                    alt="Admin" 
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full border-2 border-purple-100 bg-[#742E85] flex items-center justify-center text-white font-bold text-sm">
                                    {user.name ? user.name.charAt(0).toUpperCase() : "A"}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b bg-gray-50/50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account</p>
                                <p className="text-xs font-medium text-gray-600 truncate">{user.email || "admin@example.com"}</p>
                            </div>
                            
                            <div className="p-2">
                                <button 
                                    onClick={() => {
                                        router.push("/admin/settings");
                                        setProfileOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#742E85] rounded-xl transition-all"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <Settings size={18} />
                                    </div>
                                    <span className="font-semibold">Settings</span>
                                </button>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all mt-1"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                        <LogOut size={18} />
                                    </div>
                                    <span className="font-semibold">Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}