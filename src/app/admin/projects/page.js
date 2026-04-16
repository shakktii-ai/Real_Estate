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
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if(confirm("Are you sure?")) {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Projects Management, <span className="font-normal text-gray-400 text-sm">Manage all your property projects</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white p-2 rounded-full shadow-sm pr-4">
              <img src="/admin-avatar.jpg" className="w-8 h-8 rounded-full" alt="Admin" />
              <div className="text-xs">
                <p className="font-bold">John Doe</p>
                <p className="text-gray-400 text-[10px]">Admin</p>
              </div>
            </div>
            <Bell className="text-gray-400" size={20} />
          </div>
        </header>

        {/* Search & Add New Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Projects Management</h2>
        <button 
  onClick={() => setIsModalOpen(true)}
  className="bg-[#703081] text-white px-6 py-2 rounded-lg flex items-center gap-2"
>
  <Plus size={18} /> Add New Card
</button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-purple-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="border rounded-lg px-4 py-2 bg-gray-50 text-sm font-medium">
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
    </div>
  );
}