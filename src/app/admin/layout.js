import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import "../globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "@/lib/context/AuthContext";
import { Bell } from "lucide-react";
import Link from "next/link";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto-condensed",
});

export const metadata = {
  title: "Real Estate",
  description: "",
};
import AdminContent from "@/components/admin/AdminContent";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col h-screen overflow-hidden">
        <AuthProvider>
          <AdminContent>
            {children}
          </AdminContent>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
            toastClassName="!rounded-xl !shadow-lg !text-sm !font-medium"
            bodyClassName="!p-3"
          />
        </AuthProvider>
      </body>
    </html>
  );
}