"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AdminProjectCard from '@/components/admin/AdminProjectCard';
import { Search, Plus, Bell } from 'lucide-react';
import AddProjectModal from '@/components/admin/AddProjectModal';
export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Backend Integration: Fetch projects on load
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteConfirm;
    await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    setProjects(projects.filter(p => p._id !== id));
    setDeleteConfirm({ show: false, id: null });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex">


      <main className="flex-1 ">
        {/* Search & Add New Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-[#742E85] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#5f256d] transition"
          >
            <Plus size={18} />
            Add New Project
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-1 focus:ring-purple-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="border rounded-lg px-4 py-2 bg-gray-50 text-black  text-sm font-medium">
            <option>All Locations</option>
          </select>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects
            .filter(p => p.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((project) => (
              <AdminProjectCard
                key={project._id}
                project={project}
                onDelete={handleDelete}
              />
            ))
          }
        </div>
        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refreshData={fetchProjects}
        />
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Search size={32} className="text-red-500" /> {/* Placeholder icon */}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 text-black">Confirm Delete</h3>
                <p className="text-gray-500">
                  Are you sure you want to delete this project? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full pt-2">
                <button
                  onClick={() => setDeleteConfirm({ show: false, id: null })}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}