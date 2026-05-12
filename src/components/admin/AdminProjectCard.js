import { Edit, Trash2 } from 'lucide-react';
import PropertyCard from '../PropertyCard'; // Reuse the card we made earlier
import EditProjectModal from '@/components/admin/EditProjectModal';
import { useState, useEffect } from 'react';
export default function AdminProjectCard({ project, onEdit, onDelete }) {
  const [editData, setEditData] = useState(null);
  const [projects, setProjects] = useState([]);
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
  return (
     <div className="flex flex-col h-full rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
      {/* Main Content: flex-grow ensures this takes up available space */}
      <div className="flex-grow">
        <PropertyCard project={project} />
      </div>

      {/* Action Bar: Pinned to the bottom */}
      <div className="flex border-t border-gray-100 mt-auto">
        <button
          onClick={() => setEditData(project)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-100 transition-colors"
        >
          <Edit size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(project._id)}
          className="px-6 flex items-center justify-center bg-white hover:bg-red-50 text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <EditProjectModal
        isOpen={!!editData}
        project={editData}
        onClose={() => setEditData(null)}
         refreshData={fetchProjects}
      />
    </div>
  );
}