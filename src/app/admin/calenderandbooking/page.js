"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Calendar, Clock, CalendarCheck2, LocateIcon, Video, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import AcceptTourModal from "@/components/AcceptTourModal";
import RescheduleModal from "@/components/RescheduleModal";
export default function MyBookingsPage() {
    const [activeTab, setActiveTab] = useState("siteVisit"); // "siteVisit" or "virtualTour"
    const [data, setData] = useState({ siteVisit: [], virtualTour: [] });
    const [loading, setLoading] = useState(true);
    const [selectedTour, setSelectedTour] = useState(null);
    const [rescheduleTour, setRescheduleTour] = useState(null);

    const fetchData = async () => {
        try {
            const [res1, res2] = await Promise.all([
                fetch("/api/sitevisit"),
                fetch("/api/virtualTour"),
            ]);

            const siteVisitData = await res1.json();
            const virtualTourData = await res2.json();

            setData({
                siteVisit: siteVisitData,
                virtualTour: virtualTourData,
            });
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleCancel = async (id) => {
        try {
            const url =
                activeTab === "virtualTour"
                    ? `/api/virtualTour/${id}`
                    : `/api/sitevisit/${id}`;

            await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "cancelled",
                }),
            });

            toast.success(
                activeTab === "virtualTour"
                    ? "Tour cancelled"
                    : "Site visit cancelled"
            );

            fetchData();
        } catch (error) {
            toast.error("Failed to cancel");
        }
    };
    const handleSiteVisitAccept = async (id) => {
        try {
            await fetch(`/api/sitevisit/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "confirmed",
                }),
            });

            toast.success("Site visit confirmed");

            // refresh data (better than reload)
            fetchData(); // OR your existing refresh function
        } catch (error) {
            toast.error("Failed to confirm site visit");
        }
    };
    const currentBookings = data[activeTab];
    // Calculate total pending across both arrays
    const totalPending =
        data.siteVisit.filter(v => v.status === 'pending').length +
        data.virtualTour.filter(v => v.status === 'pending').length;
    const stats = [
        {
            label: "Site Visits",
            count: data.siteVisit.length,
            icon: <MapPin className="text-[#E5097F] " size={36} />
        },
        {
            label: "Virtual Tours",
            count: data.virtualTour.length,
            icon: <Video className="text-[#E5097F]" size={36} />
        },
        {
            label: "Pending Visits",
            count: totalPending,
            icon: <Clock className="text-[#E5097F]" size={36} /> // Using a different color for urgency
        },

    ];
    if (loading) return <div className="p-10 text-center">Loading your bookings...</div>;

    return (
        <div className="max-w-6xl  bg-white min-h-screen">
            <h1 className="text-3xl font-bold text-[#742E85] mb-8">Calendar and Bookings</h1>




            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-md shadow-md bg-white">
                        <span>
                            <h3 className="text-[12px] font-semibold text-[#E5097F]">{stat.label}</h3>
                            <p className="text-[24px] font-bold text-[#E5097F]">{stat.count}</p>
                        </span>
                        {stat.icon}
                    </div>
                ))}
            </div>
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
                                <th className="px-6 py-4 text-sm font-bold text-gray-700">User</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700">Contact</th>
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
                                    <td className="px-2 py-4">
                                        <div className="text-sm font-medium text-black">
                                            {booking.userId?.fullName || "N/A"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {booking.userId?.email || ""}
                                        </div>
                                    </td>

                                    {/* Displaying Contact */}
                                    <td className="px-2 py-4 text-sm text-gray-600">
                                        {booking.userId?.phone || "N/A"}
                                    </td>
                                    <td className="px-2 py-4 font-medium text-sm text-black">
                                        {booking.propertyId?.projectName || "Unknown Property"}
                                    </td>
                                    <td className="px-2 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            {booking.date}
                                        </div>
                                    </td>
                                    <td className="px-2 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            {booking.time}
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
                                    <td className="px-4 py-3">
                                        {booking.status === "pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (activeTab === "virtualTour") {
                                                            setSelectedTour(booking); // modal
                                                        } else {
                                                            handleSiteVisitAccept(booking._id); // direct update
                                                        }
                                                    }}
                                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                                >
                                                    Accept
                                                </button>

                                                <button
                                                    onClick={() => handleCancel(booking._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                                >
                                                    Reject
                                                </button>

                                                {/* <button
                                                    onClick={() => setRescheduleTour(booking)}
                                                    className="border px-3 py-1 rounded"
                                                >
                                                    Reschedule
                                                </button> */}
                                            </div>
                                        )}

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

                                                {/* <button
                                                    onClick={() => setRescheduleTour(booking)}
                                                    className="border px-3 py-1 rounded"
                                                >
                                                    Reschedule
                                                </button> */}

                                                {/* <button
                                                    onClick={() => handleReject(booking._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                                >
                                                    Cancel
                                                </button> */}
                                            </div>
                                        )}

                                       
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedTour && activeTab === "virtualTour" && (
                <AcceptTourModal
                    isOpen={!!selectedTour}
                    tour={selectedTour}
                    onClose={() => setSelectedTour(null)}
                    onRefresh={fetchData}
                />
            )}
            {rescheduleTour && (
                <RescheduleModal
                    isOpen={!!rescheduleTour}
                    tour={rescheduleTour}
                    onClose={() => setRescheduleTour(null)}
                    onRefresh={() => window.location.reload()}
                />
            )}
        </div>
    );
}