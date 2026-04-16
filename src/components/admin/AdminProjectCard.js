import { Edit3, Trash2 } from 'lucide-react';
import PropertyCard from '../PropertyCard'; // Reuse the card we made earlier

export default function AdminProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="flex flex-col">
      {/* Reusing the public card UI for consistency */}
      <PropertyCard project={project} />
      
      {/* Admin Action Bar */}
      <div className="flex border border-t-0 rounded-b-2xl overflow-hidden shadow-sm">
        <button 
          onClick={() => onEdit(project)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-50 text-sm font-medium border-r"
        >
          <Edit3 size={16} /> Edit
        </button>
        <button 
          onClick={() => onDelete(project._id)}
          className="px-4 flex items-center justify-center bg-white hover:bg-red-50 text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}