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
  open = false,
  onClose
}) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });
  useEffect(() => {
    setShow(open);
  }, [open]);
  // useEffect(() => {
  //   // Don't show again during this browser session
  //   // if (sessionStorage.getItem("liveAgentPopupShown")) return;

  //   const hour = new Date().getHours();

  //   // Show only between 9 AM and 8 PM
  //   if (hour < 9 || hour >= 20) return;

  //   const timer = setTimeout(() => {
  //     setShow(true);
  //     // sessionStorage.setItem("liveAgentPopupShown", "true");
  //   }, delay);

  //   return () => clearTimeout(timer);
  // }, [delay]);

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
    onClose?.();
  };

  if (!show) return null;

  return (
   <div className="fixed inset-0 z-[999] pointer-events-none">
  <div className="absolute bottom-30 right-5 pointer-events-auto">
  <div className="w-full max-w-[340px] overflow-hidden rounded-[26px] bg-white shadow-2xl">

    {/* Header */}
    <div className="relative bg-gradient-to-r from-[#00A11B] to-[#60D669] px-4 py-5 text-white">

      <button
        onClick={() => {
          setShow(false);
          onClose?.();
        }}
        className="absolute right-4 top-4 rounded-full p-1 hover:bg-white/15 hover:cursor-pointer transition"
      >
        <X size={20} />
      </button>

      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <Phone size={12} />
        </div>

        <div>
          <h2 className="text-[15px] font-semibold">
            Live Agent Available!
          </h2>

          <p className="mt-1 text-[12px] text-white/95 leading-5 mr-6">
            Our real estate experts are online <br/>right now –
            
            9 AM to 8 PM
          </p>
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="px-5 py-2">

      <div className="mb-1 flex items-center justify-center rounded-full bg-[#F3FFF5] py-2 text-[12px] font-medium text-[#009318]">
        • No Spam Calls • Free Service
      </div>

      {phoneNumbers.map((phone) => (
        <a
          key={phone.number}
          href={`tel:+91${phone.number}`}
          className={`mb-3 flex items-center justify-center gap-3 rounded-2xl py-3 text-[17px] font-semibold text-white transition-all hover:scale-[1.02]
          ${
            phone.color === "green"
              ? "bg-[#02B11F] hover:bg-[#009318]"
              : "bg-[#FBBC05] hover:bg-[#E6A800]"
          }`}
        >
          <Phone size={18} />
          {phone.number}
        </a>
      ))}

    </div>

  </div>
</div>
</div>
  );
}