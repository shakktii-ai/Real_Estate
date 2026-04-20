"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    projectName: "",
    budget: "",
    configuration: "",
    message: "",
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfigChange = (config) => {
    setFormData((prev) => ({ ...prev, configuration: config }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Message sent successfully!" });
        setFormData({
          fullName: "",
          phoneNumber: "",
          projectName: "",
          budget: "",
          configuration: "",
          message: "",
        });
      } else {
        setStatus({ type: "error", message: data.error || "Something went wrong." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Failed to connect to the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F3F3] font-roboto-condensed text-black">
    

      <main>
        {/* Header Section */}
        <section className="py-16 text-center bg-[#F4F3F3]">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[40px] font-bold text-[#742E85] uppercase tracking-wide"
          >
            CONTACT US
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[18px] text-gray-600 italic"
          >
            We're here to help you find your dream home
          </motion.p>
        </section>

        <div>
          <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Get In Touch */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-10"
          >
            <h2 className="text-[32px] font-bold text-black border-b-4 border-[#E61E8C] w-fit pb-2">Get In Touch</h2>
            
            <div className="space-y-8">
              {/* Call Us */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5F5] flex items-center justify-center text-[#742E85] flex-shrink-0">
                  <FaPhoneAlt size={20} />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold">Call us</h3>
                  <p className="text-[16px] text-gray-700">+ 91 9284429197</p>
                  <p className="text-[16px] text-gray-700">+ 91 9284570188</p>
                  <p className="text-[16px] text-gray-700">020-49001704</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5F5] flex items-center justify-center text-[#742E85] flex-shrink-0">
                  <FaEnvelope size={20} />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold">Email</h3>
                  <p className="text-[16px] text-gray-700">info@piinggaksha.com</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5F5] flex items-center justify-center text-[#742E85] flex-shrink-0">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold">Location</h3>
                  <p className="text-[16px] text-gray-700 uppercase leading-relaxed max-w-[400px]">
                    ILESEUM CO-WORKING SPACE, GANGA GLITZ, KAD NAGAR, UNDRI, PUNE, MAHARASHTRA 411060
                  </p>
                </div>
              </div>

              {/* Business House */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5F5] flex items-center justify-center text-[#742E85] flex-shrink-0">
                  <FaClock size={20} />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold">Business House</h3>
                  <p className="text-[16px] text-gray-700">Monday - Saturday: 10:00 AM - 7:00 PM</p>
                  <p className="text-[16px] text-gray-700">Sunday: 11:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-6">
              {[
                { icon: FaFacebookF, color: "blue" },
                { icon: FaInstagram, color: "pink" },
                { icon: FaWhatsapp, color: "green" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#742E85] hover:text-white transition-all shadow-sm"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Send a Message Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div 
              style={{
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
                borderRadius: "29px",
              }}
              className="bg-white p-8 md:p-12 w-full max-w-[679px] mx-auto min-h-[648px]"
            >
              <h2 className="text-[32px] font-medium text-center mb-10">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium">Full Name *</label>
                    <input 
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-gray-200 rounded-lg outline-none focus:border-[#742E85] transition-all"
                    />
                  </div>
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium">Phone Number *</label>
                    <input 
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-gray-200 rounded-lg outline-none focus:border-[#742E85] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Name */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium">Project name *</label>
                    <select 
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-gray-200 rounded-lg outline-none focus:border-[#742E85] transition-all text-gray-600"
                    >
                      <option value="">Select Project</option>
                      {projects.map((p) => (
                        <option key={p._id} value={p.projectName}>{p.projectName}</option>
                      ))}
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                  {/* Budget */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium">Budget *</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#F8F8F8] border border-gray-200 rounded-lg outline-none focus:border-[#742E85] transition-all text-gray-600"
                    >
                      <option value="">Select Budget</option>
                      <option value="Below 50L">Below 50L</option>
                      <option value="50L - 1Cr">50L - 1Cr</option>
                      <option value="1Cr - 1.5Cr">1Cr - 1.5Cr</option>
                      <option value="Above 1.5Cr">Above 1.5Cr</option>
                    </select>
                  </div>
                </div>

                {/* Configuration */}
                <div className="space-y-3">
                  <label className="text-[14px] font-medium block">Configuration *</label>
                  <div className="flex flex-wrap gap-2">
                    {["1 BHK", "1.5 BHK", "2 BHK", "2.5 BHK", "3 BHK", "3.5 BHK", "4 BHK", "4.5 BHK", "5 BHK", "5.5 BHK"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleConfigChange(item)}
                        className={`px-4 py-2 rounded-md border text-[13px] font-medium transition ${
                          formData.configuration === item
                            ? "bg-[#E61E8C] text-white border-[#E61E8C]"
                            : "bg-white text-black border-gray-300 hover:border-[#742E85]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[14px] font-medium">Message *</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Describe your requirement..."
                    rows={4}
                    className="w-full px-4 py-3 bg-[#F8F8F8] border border-gray-200 rounded-lg outline-none focus:border-[#742E85] transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-[#742E85] text-white px-10 py-3 rounded-lg text-[16px] font-bold hover:bg-[#652674] transition-all disabled:opacity-50 shadow-md"
                  >
                    {loading ? "Sending..." : "Submit"}
                  </button>
                </div>

                {/* Status Message */}
                {status.message && (
                  <p className={`text-center text-[14px] font-medium ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </section>

        {/* Find Us On Map Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-[32px] font-bold mb-8">Find Us On Map</h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full h-[424px] rounded-xl overflow-hidden shadow-lg border border-gray-100"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3785.123456789!2d73.912345!3d18.456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI3JzI0LjQiTiA3M8KwNTQnNDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            title="Piinggaksha Office Location"
          />
        </motion.div>
      </section>
    </div>
  </main>

   
    </div>
  );
}
