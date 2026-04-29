"use client";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Shield,
  Bell,
  Monitor,
  Smartphone,
  Save,
  MoreVertical,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("admin"); // 'admin' or 'notifications'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewAdmin, setViewAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ fullName: "", email: "", phone: "", role: "", password: "" });
  const [showSubAdminPassword, setShowSubAdminPassword] = useState(false);
  const [showViewPassword, setShowViewPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings", { cache: 'no-store' });
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (res.ok) {
          setSettings(data);
        } else {
          console.error("Settings Fetch Error Status:", res.status);
          toast.error(data.error || "Failed to load settings");
        }
      } catch (parseError) {
        console.error("Failed to parse settings JSON. Response text:", text.substring(0, 100));
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Settings Load Error:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (updates) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        toast.success("Settings updated successfully");
        fetchSettings();
      }
    } catch (error) {
      console.error("Settings Update Error:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#742E85]"></div>
    </div>
  );

  return (
    <div className="min-h-screen -mt-4 lg:-mt-8 -mb-4 lg:-mb-8 -mx-4 lg:-mx-8 p-4 lg:p-8 bg-[#F2EDF3]">
      <div className="mb-8">
        <h1 className="text-[14px] font-roboto font-normal text-[#818181] mb-1">Notification settings</h1>
        <h2 className="text-[28px] font-bold text-black">Settings</h2>
      </div>

      {/* Tab Switcher */}
      <div
        className="flex bg-[#818181] p-1 rounded-[25px] w-[467px] h-[37px] mb-10 items-center shadow-[0px_3px_4px_rgba(0,0,0,0.25)]"
      >
        <button
          onClick={() => setActiveTab("admin")}
          className={`flex-1 flex items-center justify-center gap-2 h-full rounded-[25px] text-[12px] font-bold transition-all ${activeTab === "admin"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-white hover:text-gray-200"
            }`}
        >
          <User size={14} />
          Admin Controls
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex-1 flex items-center justify-center gap-2 h-full rounded-[25px] text-[12px] font-bold transition-all ${activeTab === "notifications"
            ? "bg-white text-gray-900 shadow-md"
            : "text-white hover:text-gray-200"
            }`}
        >
          <Bell size={14} />
          Notifications
        </button>
      </div>

      {activeTab === "admin" ? (
        <div className="w-[1031px] h-[520px] bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-[15px] flex gap-[20px]">
          {/* Add Sub-admin Card */}
          <div className="w-[587px] h-[480px] bg-white rounded-[10px] p-8 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border border-gray-50 flex flex-col justify-between">
            <h3 className="text-[20px] font-roboto font-normal text-black mb-2 tracking-tight">Add Sub-admin</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-roboto font-normal text-black mb-1.5 ml-1">Full Name_</label>
                <input
                  type="text"
                  placeholder="_______ ________ ___________"
                  className="w-full h-[38px] px-4 bg-white border-[0.5px] border-[#BABDC3] rounded-[4px] focus:outline-none focus:border-[#742E85] transition-all text-[12px] font-medium text-gray-800 placeholder:text-[#BABDC3]"
                  value={newAdmin.fullName}
                  onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-roboto font-normal text-black mb-1.5 ml-1">Email ID_</label>
                  <input
                    type="email"
                    placeholder="XXXXXXXXX@gmail.com"
                    className="w-full h-[38px] px-4 bg-white border-[0.5px] border-[#BABDC3] rounded-[4px] focus:outline-none focus:border-[#742E85] transition-all text-[12px] font-medium text-gray-800 placeholder:text-[#BABDC3]"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-roboto font-normal text-black mb-1.5 ml-1">Phone No._</label>
                  <input
                    type="text"
                    placeholder="XXXXXXXXXX"
                    maxLength={10}
                    className="w-full h-[38px] px-4 bg-white border-[0.5px] border-[#BABDC3] rounded-[4px] focus:outline-none focus:border-[#742E85] transition-all text-[12px] font-medium text-gray-800 placeholder:text-[#BABDC3]"
                    value={newAdmin.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setNewAdmin({ ...newAdmin, phone: value });
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-roboto font-normal text-black mb-1.5 ml-1">Password_</label>
                  <div className="relative">
                    <input
                      type={showSubAdminPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full h-[38px] pl-4 pr-10 bg-white border-[0.5px] border-[#BABDC3] rounded-[4px] focus:outline-none focus:border-[#742E85] transition-all text-[12px] font-medium text-gray-800 placeholder:text-[#BABDC3]"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSubAdminPassword(!showSubAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#742E85] transition-colors"
                    >
                      {showSubAdminPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-roboto font-normal text-black mb-1.5 ml-1">Role</label>
                  <div className="relative">
                    <select
                      className="w-full h-[38px] px-4 bg-white border-[0.5px] border-[#BABDC3] rounded-[4px] focus:outline-none focus:border-[#742E85] transition-all text-[12px] font-medium text-gray-800 appearance-none placeholder:text-[#BABDC3]"
                      value={newAdmin.role}
                      onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    >
                      <option value="" disabled>Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Content manager">Content manager</option>
                      <option value="Sales manager">Sales manager</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                      <svg width="12" height="7" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                // Validation Logic
                if (!newAdmin.fullName || !newAdmin.email || !newAdmin.phone || !newAdmin.password || !newAdmin.role) {
                  toast.error("All fields are mandatory");
                  return;
                }

                // Email Validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(newAdmin.email)) {
                  toast.error("Please enter a valid email address");
                  return;
                }

                // Phone Validation (Must be exactly 10 digits)
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(newAdmin.phone)) {
                  toast.error("Phone number must be exactly 10 digits");
                  return;
                }

                handleUpdateSettings({
                  connectedAccounts: [...(settings?.connectedAccounts || []), {
                    name: newAdmin.fullName,
                    email: newAdmin.email,
                    phone: newAdmin.phone,
                    password: newAdmin.password,
                    role: newAdmin.role,
                    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    status: "Active"
                  }]
                });
                setNewAdmin({ fullName: "", email: "", phone: "", password: "", role: "" });
              }}
              disabled={saving}
              className="w-full h-[40px] bg-[#E5097F] text-white rounded-[4px] text-[15px] font-medium font-roboto hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {saving ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

          {/* Current Admin's Card */}
          <div className="w-[401px] h-[480px] bg-white rounded-[10px] p-8 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border border-gray-50 flex flex-col">
            <h3 className="text-[20px] font-roboto font-normal text-black mb-8 tracking-tight">Current Admin's</h3>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {settings?.connectedAccounts?.map((account, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 w-full h-[40px] border border-gray-100 rounded-lg bg-white shadow-sm flex-shrink-0 hover:border-gray-300 transition-colors">
                  <div
                    className="flex items-center gap-2 min-w-0 cursor-pointer group"
                    onClick={() => setViewAdmin(account)}
                  >
                    <img src={account.image} alt={account.name} className="w-8 h-8 rounded-full border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform" />
                    <div className="truncate pr-2">
                      <p className="text-[11px] font-bold text-black leading-none truncate">{account.name}</p>
                      <p className="text-[9px] text-black font-medium leading-none mt-1.5 truncate">{account.email || "admin@example.com"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="px-2 py-1 border border-gray-400 text-black text-[9px] font-normal rounded-full whitespace-nowrap min-w-[60px] text-center">
                      {account.role || "Admin"}
                    </span>
                    <span className="px-3 py-1 bg-[#742E85] text-white text-[9px] font-normal rounded-full whitespace-nowrap min-w-[60px] text-center">
                      Active
                    </span>
                    {idx > 0 && (
                      <button
                        onClick={() => setDeleteConfirm(idx)}
                        className="text-[#FF0000] p-1 border border-gray-200 rounded-md hover:bg-red-50 transition-all flex-shrink-0"
                      >
                        <svg width="10" height="11" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 3.8H2.33333M2.33333 3.8H13M2.33333 3.8V13.6C2.33333 13.9713 2.48083 14.3274 2.74338 14.5899C3.00593 14.8525 3.36203 14.3274 3.73333 15H10.2667C10.638 15 10.9941 14.8525 11.2566 14.5899C11.5192 14.3274 11.6667 13.9713 11.6667 13.6V3.8M4.33333 3.8V2.4C4.33333 2.0287 4.48083 1.6726 4.74338 1.41005C5.00593 1.1475 5.36203 1 5.73333 1H8.26667C8.63797 1 8.99407 1.1475 9.25662 1.41005C9.51917 1.6726 9.66667 2.0287 9.66667 2.4V3.8M5.66667 7.3V11.5M8.33333 7.3V11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Notifications Tab */
        <div className="w-[1031px] space-y-4">
          {/* Email Notifications Card */}
          <div className="bg-white rounded-[10px] p-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border border-gray-50">
            <h3 className="text-[20px] font-roboto font-normal text-black mb-6 tracking-tight">Email Notifications</h3>

            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-[10px] flex items-center justify-between hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gray-100 rounded-[10px] flex items-center justify-center text-[#092F63]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-black">New Booking Alerts</h4>
                    <p className="text-[10px] text-gray-400">Receive email when a new booking is made</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateSettings({
                    notifications: { ...settings.notifications, mail: { ...settings.notifications.mail, newRegister: !settings.notifications?.mail?.newRegister } }
                  })}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings?.notifications?.mail?.newRegister ? 'bg-[#7AFF29]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings?.notifications?.mail?.newRegister ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="p-4 border border-gray-100 rounded-[10px] flex items-center justify-between hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gray-100 rounded-[10px] flex items-center justify-center text-[#092F63]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-black">New Inquiry Alerts</h4>
                    <p className="text-[10px] text-gray-400">Receive email when a new inquiry is submitted</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateSettings({
                    notifications: { ...settings.notifications, mail: { ...settings.notifications.mail, messageMail: !settings.notifications?.mail?.messageMail } }
                  })}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings?.notifications?.mail?.messageMail ? 'bg-[#7AFF29]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings?.notifications?.mail?.messageMail ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* WhatsApp Notifications Card */}
          <div className="bg-white rounded-[10px] p-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border border-gray-50 relative">
            <h3 className="text-[20px] font-roboto font-normal text-black mb-6 tracking-tight">Email Notifications</h3>

            <div className="space-y-4">
              {/* WhatsApp Business API Banner */}
              <div className="p-4 bg-[#E6FFEA] rounded-[10px] border border-[#BFFFC9] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.63 1.435h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-[#075E54]">WhatsApp Business API</h4>
                    <p className="text-[9px] text-[#075E54]/70">Connect your WhatsApp Business account to receive real-time notifications</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Booking Toggle */}
              <div className="p-4 border border-gray-100 rounded-[10px] flex items-center justify-between hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-black">Booking Notifications</h4>
                    <p className="text-[10px] text-gray-400">Get WhatsApp alerts for new bookings</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateSettings({
                    notifications: { ...settings.notifications, bookings: !settings.notifications?.bookings }
                  })}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings?.notifications?.bookings ? 'bg-[#7AFF29]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings?.notifications?.bookings ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* WhatsApp Inquiry Toggle */}
              <div className="p-4 border border-gray-100 rounded-[10px] flex items-center justify-between hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-black">Inquiry Notifications</h4>
                    <p className="text-[10px] text-gray-400">Get WhatsApp alerts for new Inquiry</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateSettings({
                    notifications: { ...settings.notifications, inquiries: !settings.notifications?.inquiries }
                  })}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings?.notifications?.inquiries ? 'bg-[#7AFF29]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings?.notifications?.inquiries ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => handleUpdateSettings({ notifications: settings.notifications })}
                  disabled={saving}
                  className="px-6 py-2 bg-[#E5097F] text-white rounded-[4px] text-[14px] font-bold hover:opacity-90 transition-all"
                >
                  Save Notification Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14M12 17.01L12.01 16.998M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Admin Account</h3>
              <p className="text-gray-500 mb-8">
                Are you sure you want to remove <span className="font-bold text-gray-800">{settings?.connectedAccounts[deleteConfirm]?.name}</span>? This action cannot be undone.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const updatedAccounts = settings.connectedAccounts.filter((_, i) => i !== deleteConfirm);
                    handleUpdateSettings({ connectedAccounts: updatedAccounts });
                    setDeleteConfirm(null);
                  }}
                  className="px-6 py-3 bg-[#FF0000] hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-100 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* View Admin Details Modal */}
      {viewAdmin !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden relative">
            <div className="absolute top-4 right-4 cursor-pointer text-white/80 hover:text-white transition-colors z-10 bg-black/20 p-1.5 rounded-full backdrop-blur-md" onClick={() => setViewAdmin(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>

            <div className="bg-gradient-to-r from-[#742E85] to-[#E5097F] h-28 w-full relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <img src={viewAdmin.image} alt={viewAdmin.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white" />
              </div>
            </div>

            <div className="pt-16 pb-8 px-8 flex flex-col items-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{viewAdmin.name}</h3>
              <span className="px-3 py-1 bg-purple-50 text-[#742E85] text-[11px] font-bold rounded-full mb-6 uppercase tracking-wider">
                {viewAdmin.role || "Admin"}
              </span>

              <div className="w-full space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm mr-4 flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{viewAdmin.email || "admin@example.com"}</p>
                  </div>
                </div>

                {viewAdmin.role !== "Admin" && (
                  <>
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm mr-4 flex-shrink-0">
                        <Smartphone size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Phone Number</p>
                        <p className="text-sm font-medium text-gray-800 truncate">{viewAdmin.phone || "Not Provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm mr-4 flex-shrink-0">
                        <Lock size={18} />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Password</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {showViewPassword ? viewAdmin.password || "No Password" : "••••••••"}
                          </p>
                          <button
                            onClick={() => setShowViewPassword(!showViewPassword)}
                            className="text-gray-400 hover:text-[#742E85] transition-colors"
                          >
                            {showViewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm mr-4 flex-shrink-0">
                    <Shield size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-green-600/70 font-bold uppercase tracking-wider mb-0.5">Account Status</p>
                    <p className="text-sm font-bold text-green-600">{viewAdmin.status || "Active"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
