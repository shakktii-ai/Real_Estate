"use client";
import React, { useEffect, useState } from "react";
import { UserRound, Home, Calendar, Hourglass, Plus, Eye } from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    bookings: 0,
    Tourbooking: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
   const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCharts = async () => {
      try {
        const res = await fetch("/api/dashboard/chart");
        const data = await res.json();
        setChartData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
    fetchCharts();
  }, [isMounted]);


  if (!isMounted) {
    return <div className="p-4 md:p-8 md:ml-64">Loading Dashboard...</div>;
  }

  const statCards = [
    { id: "users", label: "Total Users", value: stats.users, icon: <UserRound /> },
    { id: "projects", label: "Total Projects", value: stats.projects, icon: <Home /> },
    { id: "bookings", label: "Site Visit", value: stats.bookings, icon: <Calendar /> },
    { id: "tours", label: "Virtual Tour", value: stats.Tourbooking, icon: <Hourglass /> },
  ];

  return (
    <div className=" bg-[#F8F9FA]  min-h-screen  transition-all duration-300">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-2 text-black">
        <Home className="bg-gradient-to-b from-[#E5097F] to-[#742E85] p-1 rounded text-white" size={24} />
        Dashboard
      </h1>

      {/* Metric Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {statCards.map((stat) => (
          <div
            key={stat.id}
            className="relative p-5 sm:p-6 rounded-3xl text-white overflow-hidden shadow-lg"
            style={{ background: "linear-gradient(135deg, #E5097F 0%, #F472B6 100%)" }}
          >
            <div className="relative z-10">
              <p className="text-xs sm:text-sm opacity-90">{stat.label}</p>
              <h2 className="text-3xl sm:text-4xl font-bold my-1 sm:my-2">
                {stat.value.toLocaleString()}
              </h2>
            </div>
            {/* Decorative circles */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white opacity-20 rounded-full" />
            <div className="absolute top-5 right-5 opacity-80">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-8 sm:mb-10">
        <h3 className="font-bold mb-4 text-black">Quick Actions</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/admin/projects" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border rounded-xl font-bold text-sm text-black hover:bg-gray-50">
              <Plus size={18} /> Add Project
            </button>
          </Link>
          <Link href="/admin/blogs" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border rounded-xl font-bold text-sm text-black hover:bg-gray-50">
              <Plus size={18} /> Add Blogs
            </button>
          </Link>
          <Link href="/admin/calenderandbooking" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border rounded-xl font-bold text-sm text-black hover:bg-gray-50">
              <Eye size={18} /> View Bookings
            </button>
          </Link>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm h-72 sm:h-80">
          <h4 className="text-sm font-bold text-gray-400 mb-4">User Registrations</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#E5097F" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm h-72 sm:h-80">
          <h4 className="text-sm font-bold text-gray-400 mb-4">Booking Trends</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="siteVisits" fill="#742E85" />
              <Bar dataKey="tours" fill="#F472B6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}