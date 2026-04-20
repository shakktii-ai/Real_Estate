import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import "../globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/Navbar"; // 1. Import your Navbar
import Sidebar from "@/components/admin/Sidebar";

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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${robotoCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-roboto bg-white">
        {/* 2. Navbar sits here to stay visible on all pages */}
        
<Sidebar/>
        {/* 3. The main content will render inside this tag */}
        <main className="flex-grow">
          {children}
        </main>

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
      </body>
    </html>
  );
}