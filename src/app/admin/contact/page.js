"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, 
  Eye, 
  Check, 
  Trash2, 
  MessageSquare, 
  Mail, 
  MailOpen, 
  Calendar,
  X,
  Phone,
  User,
  Building2,
  Clock
} from "lucide-react";
import { toast } from "react-toastify";

export default function ContactInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Fetch inquiries
  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/contact", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setInquiries(data);
      }
    } catch (error) {
      console.error("Load Inquiries Error:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Handle status update
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
        cache: 'no-store'
      });
      if (res.ok) {
        toast.success(`Status updated to ${status}`);
        fetchInquiries();
        // Update selected inquiry if open
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status });
        }
      }
    } catch (error) {
      console.error("Update Status Error:", error);
      toast.error("Failed to update status");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Inquiry deleted");
        setInquiries(inquiries.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Delete Inquiry Error:", error);
      toast.error("Failed to delete inquiry");
    }
  };

  // Stats calculation
  const stats = {
    total: inquiries.length,
    unread: inquiries.filter((i) => i.status !== "Read").length,
    read: inquiries.filter((i) => i.status === "Read").length,
    today: inquiries.filter((i) => {
      const today = new Date().toISOString().split("T")[0];
      const createdDate = new Date(i.createdAt).toISOString().split("T")[0];
      return today === createdDate;
    }).length,
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((i) =>
    (i.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.message || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#742E85]"></div>
    </div>
  );

  return (
    <div className="min-h-screen -mt-4 lg:-mt-8 -mb-4 lg:-mb-8 -mx-4 lg:-mx-8 p-4 lg:p-8 bg-[#F2EDF3]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Contact & Inquiries</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Inquiries */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-red-600 font-bold text-sm mb-1">Total Inquiries</p>
            <h2 className="text-4xl font-bold text-gray-800">{stats.total}</h2>
          </div>
          <div className="p-3 bg-red-50 rounded-xl">
            <MessageSquare className="text-red-600" size={28} />
          </div>
        </div>

        {/* Unread */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-red-600 font-bold text-sm mb-1">Unread</p>
            <h2 className="text-4xl font-bold text-gray-800">{stats.unread}</h2>
          </div>
          <div className="p-3 bg-red-50 rounded-xl">
            <Mail className="text-red-600" size={28} />
          </div>
        </div>

        {/* Read */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-red-600 font-bold text-sm mb-1">Read</p>
            <h2 className="text-4xl font-bold text-gray-800">{stats.read}</h2>
          </div>
          <div className="p-3 bg-red-50 rounded-xl">
            <MailOpen className="text-red-600" size={28} />
          </div>
        </div>

        {/* Today */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-red-600 font-bold text-sm mb-1">Today</p>
            <h2 className="text-4xl font-bold text-gray-800">{stats.today}</h2>
          </div>
          <div className="p-3 bg-red-50 rounded-xl">
            <Calendar className="text-red-600" size={28} />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
            <input
              type="text"
              placeholder="Search inquiries by name, email, or message..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#742E85]/20 focus:border-[#742E85] transition-all placeholder:text-gray-600 font-medium text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">All Inquiries ({filteredInquiries.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[11px] uppercase font-bold text-gray-600">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInquiries.map((item) => (
                <tr key={item._id} className={`hover:bg-gray-50/50 transition-colors ${item.status !== 'Read' ? 'bg-[#F9F6FA]' : ''}`}>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.status !== 'Read' ? 'bg-[#742E85]' : 'bg-transparent'}`}></div>
                      <span className="font-bold text-sm text-gray-800">{item.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1 text-[11px] text-gray-600 font-medium lowercase mb-1">
                      <Mail size={12} className="text-gray-400" />
                      <span className="cursor-pointer hover:underline">{item.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                      <Phone size={12} className="text-gray-400" />
                      <span>{item.phoneNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-700 shadow-sm">
                      {item.projectName}
                    </span>
                  </td>
                  <td className="px-6 py-5 min-w-[200px]">
                    <p className="text-[12px] text-gray-800 line-clamp-1">{item.message}</p>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-[12px] text-gray-800">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full ${
                      item.status !== "Read" 
                        ? "bg-black text-white" 
                        : "bg-[#EEEEEE] text-gray-800"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-4">
                      <button 
                        onClick={() => {
                          setSelectedInquiry(item);
                          if (item.status !== 'Read') {
                            updateStatus(item._id, "Read");
                          }
                        }}
                        className="text-gray-600 hover:text-[#742E85] transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <div className="w-6">
                        {item.status !== 'Read' ? (
                          <button 
                            onClick={() => updateStatus(item._id, "Read")}
                            className="text-green-500 hover:text-green-600 transition-colors"
                            title="Mark as Read"
                          >
                            <Check size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateStatus(item._id, "Unread")}
                            className="text-orange-500 hover:text-orange-600 transition-colors"
                            title="Mark as Unread"
                          >
                            <Mail size={18} />
                          </button>
                        )}
                      </div>

                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Inquiry Details</h2>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg"><User size={18} className="text-[#742E85]" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Full Name</p>
                      <p className="text-gray-800 font-bold">{selectedInquiry.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg"><Mail size={18} className="text-blue-500" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Email Address</p>
                      <p className="text-gray-800 font-bold">{selectedInquiry.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg"><Phone size={18} className="text-green-500" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Phone Number</p>
                      <p className="text-gray-800 font-bold">{selectedInquiry.phoneNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg"><Building2 size={18} className="text-orange-500" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Interested Project</p>
                      <p className="text-gray-800 font-bold">{selectedInquiry.projectName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg"><Clock size={18} className="text-gray-700" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Submission Date</p>
                      <p className="text-gray-800 font-bold">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg"><div className={`w-3 h-3 rounded-full mt-1 ${selectedInquiry.status !== 'Read' ? 'bg-black' : 'bg-gray-400'}`}></div></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Status</p>
                      <p className="text-gray-800 font-bold">{selectedInquiry.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Message</p>
                <div className="bg-gray-50 p-4 rounded-2xl text-gray-700 text-sm leading-relaxed min-h-[100px]">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => updateStatus(selectedInquiry._id, "Read")}
                disabled={selectedInquiry.status === "Read"}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  selectedInquiry.status === 'Read' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                Mark as Read
              </button>
              <button 
                onClick={() => updateStatus(selectedInquiry._id, "Unread")}
                disabled={selectedInquiry.status === "Unread"}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  selectedInquiry.status === 'Unread' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#E5097F] text-white hover:opacity-90'
                }`}
              >
                Mark as Unread
              </button>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
