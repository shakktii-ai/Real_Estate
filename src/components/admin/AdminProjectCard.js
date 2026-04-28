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
    <div className="flex flex-col">
      {/* Admin Action Bar */}
      <div className=" border border-t-0 rounded-b-2xl overflow-hidden shadow-sm">
        <PropertyCard project={project} />
        <div className='flex'>
        <button 
         onClick={() => setEditData(project)}
          className="flex-1 flex  items-center justify-center gap-2 py-3 bg-white hover:bg-gray-50 text-sm font-medium text-black "
        >
          <Edit size={16} /> Edit
        </button>
        <button 
          onClick={() => onDelete(project._id)}
          className="px-4 flex items-center justify-center bg-white hover:bg-red-50 text-red-500"
        >
          <Trash2 size={16} />
        </button>
        </div>
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