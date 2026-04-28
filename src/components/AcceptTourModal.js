"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function AcceptTourModal({ isOpen, onClose, tour, onRefresh }) {
  const [meetLink, setMeetLink] = useState("");

  const handleSubmit = async () => {
  if (!meetLink.trim()) {
    toast.error("Meet link required");
    return;
  }

  try {
    const res = await fetch(`/api/virtualTour/${tour._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "confirmed",
        meetLink: meetLink.trim(), // ✅ trim added
      }),
    });

    const data = await res.json();

    console.log("Response:", data);

    toast.success("Tour confirmed");
    onRefresh();
    onClose();
  } catch (error) {
    toast.error("Something went wrong");
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Add Meet Link</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <input
          placeholder="Enter Google Meet / Zoom Link"
          className="w-full border p-3 rounded-lg mb-4"
          value={meetLink}
          onChange={(e) => setMeetLink(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-[#742E85] text-white py-3 rounded-lg"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}