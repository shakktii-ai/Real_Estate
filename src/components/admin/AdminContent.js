"use client";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useEffect, useState } from "react";

export default function AdminContent({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/admin/login";
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Skip auth check if we are on the login page
        if (isLoginPage) {
            setIsCheckingAuth(false);
            return;
        }

        const adminUser = localStorage.getItem("adminUser");
        if (!adminUser) {
            router.replace("/admin/login");
        } else {
            setIsCheckingAuth(false);
        }
    }, [pathname, router, isLoginPage]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (isCheckingAuth && !isLoginPage) {
        return (
            <div className="min-h-screen bg-[#F2EDF3] flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-[#742E85]/30 border-t-[#E5097F] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isLoginPage) {
        return (
            <div className="min-h-screen bg-[#F2EDF3]">
                {children}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Topbar toggleSidebar={toggleSidebar} />
            <div className="flex flex-1 mt-20 overflow-hidden relative">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
