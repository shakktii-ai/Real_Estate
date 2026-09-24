import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/Navbar"; // 1. Import your Navbar
import { AuthProvider } from "@/lib/context/AuthContext";
import Footer from "@/components/Footer";
import SimpleChatbot from "@/components/chatbot/SimpleChatbot";

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
  title: "Piinggaksha",
  description: "Zero Brokerage | Zero Fees | Zero Hidden Charges",
  icons: {
    icon: "/piinggaksha.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${robotoCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-roboto bg-white">
        {/* 2. Navbar sits here to stay visible on all pages */}
        <AuthProvider>
          <Navbar />

          {/* 3. The main content will render inside this tag */}
          <main className="flex-grow min-h-screen">
            {children}

          </main>
          <Footer />
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
          <SimpleChatbot />

        </AuthProvider>
        {/* Meta Pixel Code */}
<Script id="meta-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '2215930345994159');
    fbq('track', 'PageView');
  `}
</Script>

<noscript>
  <img
    height="1"
    width="1"
    style={{ display: "none" }}
    src="https://www.facebook.com/tr?id=2215930345994159&ev=PageView&noscript=1"
    alt=""
  />
</noscript>
         <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8WZE3BFXH5"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-8WZE3BFXH5');
          `}
        </Script>
      </body>
    </html>
  );
}