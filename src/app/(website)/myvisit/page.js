"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Calendar, Clock, CalendarCheck2 } from "lucide-react";

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("siteVisit"); // "siteVisit" or "virtualTour"
  const [data, setData] = useState({ siteVisit: [], virtualTour: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch both endpoints concurrently
          const [res1, res2] = await Promise.all([
            fetch(`/api/sitevisit?userId=${user.uid}`),
            fetch(`/api/virtualTour?userId=${user.uid}`),
          ]);

          const siteVisitData = await res1.json();
          const virtualTourData = await res2.json();

          setData({ siteVisit: siteVisitData, virtualTour: virtualTourData });
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const currentBookings = data[activeTab];

  if (loading) return <div className="p-10 text-center">Loading your bookings...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-[#742E85] mb-8">My Bookings</h1>

      {/* Tabs Switcher */}
      <div className="bg-gray-100 p-1 rounded-full flex mb-8 w-fit shadow-inner">
        <button
          onClick={() => setActiveTab("siteVisit")}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === "siteVisit" ? "bg-white text-[#742E85] shadow-sm" : "text-gray-500 hover:text-black"
            }`}
        >
          Site Visit Bookings
        </button>
        <button
          onClick={() => setActiveTab("virtualTour")}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === "virtualTour" ? "bg-white text-[#742E85] shadow-sm" : "text-gray-500 hover:text-black"
            }`}
        >
          Virtual Tours
        </button>
      </div>

      {currentBookings.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="text-black mb-4 text-5xl flex items-center justify-center">
            <CalendarCheck2 size={48} />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">No {activeTab === 'siteVisit' ? 'site visits' : 'virtual tours'} yet</h2>
          <p className="text-gray-500 mt-2">Book your first {activeTab === 'siteVisit' ? 'site visit' : 'virtual tour'} to explore properties</p>
          <a href="/properties" className="inline-block mt-6 px-8 py-3 bg-[#742E85] text-white rounded-xl font-bold">
            Explore Projects
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Property</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Time</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                 <th className="px-6 py-4 text-sm font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-black">
                    {booking.propertyId?.projectName || "Unknown Property"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} /> {booking.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} /> {booking.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                      booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                      {booking.status}
                    </span>
                  </td>
                  {activeTab === "virtualTour" && <td>
                    {(booking.status === "confirmed" || booking.status === "rescheduled") && (
                      <div className="flex gap-2">
                        {booking.meetingLink && (
                          <a
                            href={booking.meetingLink}
                            target="_blank"
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Join
                          </a>
                        )}


                      </div>
                    )}
                    {booking.status === "pending" && (
                      <div className="text-sm text-yellow-600 font-medium">
                        Awaiting Confirmation
                      </div>
                    )}
                     {booking.status === "cancelled" && (
                      <div className="text-sm text-red-600 font-medium">
                        Visit Cancelled.
                      </div>
                    )}
                  </td>
                  }
                   {activeTab === "siteVisit" && <td>
                    {(booking.status === "confirmed" || booking.status === "rescheduled") && (
                      <div className="text-sm text-green-600 font-medium">
                        Booking Confirmed.
                      </div>
                    )}
                    {booking.status === "pending" && (
                      <div className="text-sm text-yellow-600 font-medium">
                        Awaiting Confirmation
                      </div>
                    )}
                     {booking.status === "cancelled" && (
                      <div className="text-sm text-red-600 font-medium">
                        Visit Cancelled.
                      </div>
                    )}
                  </td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}