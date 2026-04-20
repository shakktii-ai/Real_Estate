import React from 'react';
import { Users, Home, Calendar, Hourglass, Plus, FileText, Star, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "2,543", trend: "+12.5%", icon: <Users /> },
    { label: "Total Projects", value: "48", trend: "+8.2%", icon: <Home /> },
    { label: "Active Bookings", value: "127", trend: "+23.2%", icon: <Calendar /> },
    { label: "Pending Requests", value: "19", trend: "+5.5%", icon: <Hourglass /> },
  ];

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Home className="text-[#D81B60]" /> Dashboard
      </h1>

      {/* 1. Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gradient-to-br from-[#FF4081] to-[#D81B60] p-6 rounded-3xl text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <p className="text-sm font-medium opacity-90">{stat.label}</p>
              <h2 className="text-3xl font-black my-2">{stat.value}</h2>
              <p className="text-[10px] font-bold">{stat.trend} from last month</p>
            </div>
            <div className="absolute right-[-10px] top-[-10px] opacity-20 transform scale-[2.5]">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-10">
        <h3 className="font-bold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3F51B5] text-white rounded-xl font-bold text-sm">
            <Plus size={18} /> Add Project
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50">
            <Plus size={18} /> Add Blogs
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50">
            <Plus size={18} /> Add Testimonial
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50">
            <Eye size={18} /> View Today's Bookings
          </button>
        </div>
      </div>
      
      {/* 3. Charts Section (Placeholder for your Registration/Booking Trends) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80">
          <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">User Registrations (Monthly)</h4>
          {/* Integrate Recharts or Chart.js here */}
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80">
          <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Booking Trends</h4>
        </div>
      </div>
    </div>
  );
}