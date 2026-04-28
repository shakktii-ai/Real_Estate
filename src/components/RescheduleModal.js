"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
export default function RescheduleModal({ isOpen, tour, onClose, onRefresh }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetLink,setMeetingLink] = useState("");
  const handleSubmit = async () => {
    if (!date || !time) {
      toast.error("Select date & time");
      return;
    }

    await fetch(`/api/virtualTour/${tour._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "rescheduled",
        date,
        time,
        meetLink
      }),
    });

    toast.success("Tour rescheduled");
    onRefresh();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center text-black">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
      <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Reschedule</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <input type="date" onChange={(e) => setDate(e.target.value)} className="w-full mb-3 border p-2 rounded" />
        <input type="time" onChange={(e) => setTime(e.target.value)} className="w-full mb-4 border p-2 rounded" />
         <input type="text" placeholder="Enter Meet Link" onChange={(e) => setMeetingLink(e.target.value)} className="w-full mb-4 border p-2 rounded" />

        <button onClick={handleSubmit} className="w-full bg-[#742E85] text-white py-2 rounded">
          Save
        </button>
      </div>
    </div>
  );
}