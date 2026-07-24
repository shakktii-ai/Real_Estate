"use client";

import { useEffect, useState } from "react";
import { X, PhoneCall } from "lucide-react";

export default function CallNowPopup({
  phone = "+919284429197",
  delay = 20000, // 20 sec
  title = "Need Help Choosing a Home?",
  description = "Talk to our property expert and get instant assistance with zero brokerage.",
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show again during this browser session
    // if (sessionStorage.getItem("callPopupShown")) return;

    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem("callPopupShown", "true");
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

        <button
          onClick={() => setShow(false)}
          className="absolute right-4 top-4"
        >
          <X size={22} />
        </button>

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <PhoneCall className="text-green-600" size={30} />
        </div>

        <h2 className="text-center text-2xl font-bold">
          {title}
        </h2>

        <p className="mt-3 text-center text-gray-600">
          {description}
        </p>

        <a
          href={`tel:${phone}`}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          <PhoneCall size={18} className="mr-2" />
          Call Now
        </a>

        <button
          onClick={() => setShow(false)}
          className="mt-3 w-full rounded-xl border py-3 font-medium"
        >
          Continue Browsing
        </button>

      </div>
    </div>
  );
}