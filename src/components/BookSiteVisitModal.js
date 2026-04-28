"use client";

import { useState } from "react";
import {
  X,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Clock3,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
const TIME_SLOTS = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "5:00 PM - 6:00 PM",
];

export default function BookSiteVisitModal({
  propertyId,
  propertyName = "Grand Villa Residency",
  onClose,
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    propertyId,
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
  });

  const handleNextFromStep2 = () => {
    if (!formData.date) {
      toast.error("Please select visit date");
      return;
    }

    if (!formData.time) {
      toast.error("Please select time slot");
      return;
    }

    setStep(3);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (formData.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

  if (!/^\d{10}$/.test(formData.phone)) {
  toast.error("Please enter valid 10 digit phone number");
  return;
}

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      
const auth = getAuth();
  const user = auth.currentUser;
setLoading(true);
  const bookingPayload = {
    ...formData,
    userId: user.uid, // Sending the unique user ID
    userEmail: user.email // Optional: helpful for admin reference
  };
      const res = await fetch("/api/sitevisit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to book visit");
      }

      toast.success("Site visit booked successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl relative p-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-black hover:text-[#742E85]"
        >
          <X size={24} />
        </button>

        <h2 className="text-md leading-none font-bold text-black mb-6">
          Book Site Visit
        </h2>

        {/* <p className="text-sm text-gray-500 mt-1 mb-6">{propertyName}</p> */}

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((item, index) => (
            <div key={item} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step > item
                    ? "bg-[#E5097F] text-white"
                    : step === item
                    ? "bg-[#E5097F] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {step > item ? <CheckCircle2 size={20} /> : item}
              </div>

              {index !== 2 && (
                <div
                  className={`w-16 h-[2px] ${
                    step > item ? "bg-[#E5097F]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h3 className="text-[#742E85] text-xl font-bold mb-4">
              How It Works
            </h3>

            <div className="space-y-5 mb-8">
              {[
                {
                  title: "Select Property & Schedule",
                  desc: "Choose your preferred property, date, and time",
                },
                {
                  title: "Get Confirmation Details",
                  desc: "Receive confirmation via SMS/Email/WhatsApp",
                },
                {
                  title: "Visit the Property",
                  desc: "Meet the agent and explore the property",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#2F66F6] text-white text-xs flex items-center justify-center shrink-0 mt-1">
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="font-semibold text-black text-sm">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#742E85] hover:bg-[#5f256d] text-white py-3 rounded-lg font-medium"
            >
              Next
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                  <Calendar size={16} />
                  Select Date *
                </label>

                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-black outline-none focus:border-[#742E85]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                  <Clock3 size={16} />
                  Select Time Slot *
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, time: slot })
                      }
                      className={`border rounded-lg px-3 py-2 text-xs transition ${
                        formData.time === slot
                          ? "bg-[#742E85] text-white border-[#742E85]"
                          : "border-gray-300 text-black hover:border-[#742E85]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/2 border border-gray-300 py-3 rounded-lg text-black flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                Back
              </button>

              <button
                onClick={handleNextFromStep2}
                className="w-1/2 bg-[#742E85] hover:bg-[#5f256d] text-white py-3 rounded-lg font-medium"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-black block mb-2">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black block mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  maxLength={10}
                  placeholder="+91 xxxxx xxxxx"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-black block mb-2">
                  Email (Optional)
                </label>

                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none text-black"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/2 border border-gray-300 py-3 rounded-lg text-black flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} />
                Back
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-1/2 py-3 rounded-lg font-medium text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#742E85] hover:bg-[#5f256d]"
                }`}
              >
                {loading ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}