"use client";

import { useEffect, useState } from "react";
import { X, Phone, PhoneCall } from "lucide-react";
import { toast } from "react-toastify";

export default function LiveAgentPopup({
  delay = 15000,
  phoneNumbers = [
    { number: "9284429197", color: "green" },
    { number: "9529249230", color: "yellow" },
  ],
  onCallbackSubmit,
  open=false
}) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });
useEffect(() => {
  if (open) {
    setShow(true);
  }
}, [open]);
  useEffect(() => {
    // Don't show again during this browser session
    // if (sessionStorage.getItem("liveAgentPopupShown")) return;

    const hour = new Date().getHours();

    // Show only between 9 AM and 8 PM
    if (hour < 9 || hour >= 20) return;

    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem("liveAgentPopupShown", "true");
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone) {
      toast.error("Please fill all fields");
      return;
    }

    if (onCallbackSubmit) {
      await onCallbackSubmit(form);
    } else {
      console.log(form);
    }

    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
  <div className="absolute right-4 bottom-6 md:right-6 md:bottom-8 pointer-events-auto">
      <div className="w-[350px] max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#00A11B] to-[#60D669] text-white p-4 relative">
          <button
            onClick={() => setShow(false)}
            className="absolute right-4 top-4 hover:cursor-pointer"
          >
            <X size={20} />
          </button>

          <h2 className="font-semibold text-[18px] flex items-center gap-2 ml-4">
            • Live Agent Available!
          </h2>

          <p className="text-[14px] mt-2">
            Our real estate experts are online right<br/> now – 9 AM to 8 PM
          </p>
        </div>

        {/* Body */}
        <div className="p-5">

          {phoneNumbers.map((phone, index) => (
            <a
              key={phone.number}
              href={`tel:+91${phone.number}`}
              className={`mb-3 flex items-center justify-center gap-2 rounded-xl py-2 text-white font-medium transition text-[16px]
                ${
                  phone.color === "green"
                    ? "bg-[#02B11F] hover:bg-green-700"
                    : "bg-[#FBBC05] hover:bg-yellow-500"
                }`}
            >
              {/* <Phone size={18} /> */}
              Connect Now - {phone.number}
            </a>
          ))}

          <p className="text-[#6F6F6F] text-[14px] mt-4 mb-2">
            Or request a callback:
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border border-[#969393] rounded-lg px-4 py-2 mb-3 outline-none focus:border-gray-700"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full border border-[#969393] rounded-lg px-4 py-2 mb-3 outline-none focus:border-gray-700"
            />

            <button
              type="submit"
              className="w-full bg-[#7B2D8F] hover:bg-[#6B247C] text-white text-[16px] font-medium py-3 rounded-xl transition"
            >
              {/* <PhoneCall className="inline mr-2" size={18} /> */}
              Request Callback
            </button>
          </form>

        </div>
      </div>
    </div>
    </div>
  );
}