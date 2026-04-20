"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, FileText, CheckCircle, Clock, Layers } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import AddBlogModal from '@/components/admin/AddBlogModal';
export default function AdminBlogManagement() {
 const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
    
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Blog deleted");
        setBlogs(blogs.filter(blog => blog._id !== id));
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // 3. Dynamic Stats Calculation
  const stats = [
    { label: "Total Blogs", value: blogs.length, icon: <FileText className="text-purple-600" />, color: "bg-purple-50" },
    { label: "Published", value: blogs.filter(b => b.isPublished).length, icon: <CheckCircle className="text-green-600" />, color: "bg-green-50" },
    { label: "Drafts", value: blogs.filter(b => !b.isPublished).length, icon: <Clock className="text-orange-600" />, color: "bg-orange-50" },
    { label: "Categories", value: [...new Set(blogs.map(b => b.category))].length, icon: <Layers className="text-blue-600" />, color: "bg-blue-50" },
  ];

  if (loading) return <div className="p-8 text-center font-bold">Loading Dashboard...</div>;

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen md:ml-64">
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
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">{stat.label}</p>
              <h2 className="text-2xl font-black">{stat.value}</h2>
            </div>
            <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Dynamic Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[11px] uppercase font-bold text-gray-400">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <p className="font-bold text-sm text-gray-800">{blog.title}</p>
                  <p className="text-[11px] text-gray-400 line-clamp-1">{blog.excerpt}</p>
                </td>
                <td className="px-6 py-5 text-xs font-bold text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">{blog.category}</span>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-5">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                    blog.isPublished ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                    <Link href={`/admin/blogs/edit/${blog._id}`} className="p-2 text-gray-400 hover:text-[#742E85]">
                      <Edit3 size={16} />
                    </Link>
                    <button onClick={() => handleDelete(blog._id)} className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}