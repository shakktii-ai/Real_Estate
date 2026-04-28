"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Edit, Grid2X2Plus, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import AddBlogModal from '@/components/admin/AddBlogModal';
import EditBlogModal from "@/components/admin/EditBlogModal";
export default function AdminBlogManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
const [editBlog, setEditBlog] = useState(null);
  // 1. Fetch Blogs from DB
  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (res.ok) {
        setBlogs(data);
      }
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // 2. Delete Handler
 const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this blog?")) return;

  const toastId = toast.loading("Deleting blog...");

  try {
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error("Delete failed");

    setBlogs((prev) => prev.filter((b) => b._id !== id));

    toast.update(toastId, {
      render: "Blog deleted successfully",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  } catch (error) {
    toast.update(toastId, {
      render: error.message,
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
  }
};

  // 3. Dynamic Stats Calculation
  const stats = [
    { label: "Total Blogs", value: blogs.length, icon: <Edit size={36} className="text-[#742E85]" />, color: "bg-purple-50" },
    { label: "Published", value: blogs.filter(b => b.isPublished).length, icon: <Eye size={36} className="text-[#742E85]" /> },
    { label: "Drafts", value: blogs.filter(b => !b.isPublished).length, icon: <Calendar size={36} className="text-[#742E85]" /> },
    { label: "Categories", value: [...new Set(blogs.map(b => b.category))].length, icon: <Grid2X2Plus size={36} className="text-[#742E85]" /> },
  ];

  if (loading) return <div className="p-8 text-center font-bold">Loading Dashboard...</div>;

  return (
    <div className=" bg-[#F8F9FA] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#742E85] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold"
        >
          Add Blog
        </button>
      </div>
      <AddBlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchBlogs}
      />
      {/* Dynamic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs  text-[#742E85] uppercase mb-1">{stat.label}</p>
              <h2 className="text-2xl font-normal text-[#742E85] font-black">{stat.value}</h2>
            </div>
            <div className={`font-normal rounded-xl ${stat.color}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Dynamic Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[11px] uppercase font-bold text-black">
            <tr>
              <th className="px-6 py-4">Title</th>
             
              <th className="px-6 py-4">Date</th>
            
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <p className="font-bold text-sm text-gray-800">{blog.title}</p>
                  <p className="text-[11px] text-gray-600 line-clamp-1">{blog.description}</p>
                </td>
               
                <td className="px-6 py-5 text-sm text-gray-600">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
              
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setEditBlog(blog)} className="p-2 text-black hover:text-[#742E85]">
                      <Edit size={24} />
                    </button>
                    <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-500 hover:text-red-600">
                      <Trash2 size={24} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <EditBlogModal
  isOpen={!!editBlog}
  blog={editBlog}
  onClose={() => setEditBlog(null)}
  onRefresh={fetchBlogs}
/>
      </div>
    </div>
  );
}