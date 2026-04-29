"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminContent({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage) {
        return (
            <div className="min-h-screen bg-[#F2EDF3]">
                {children}
            </div>
        );
    }

    return (
        <>
            <Topbar />
            <div className="flex flex-1 mt-20 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </>
    );
}
