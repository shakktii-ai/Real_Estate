import { ArrowRight } from 'lucide-react';

// Added onClick to the props
export default function BlogCard({ title, image, category, date, description, onClick }) {
  return (
    <div 
      onClick={onClick} // Makes the whole card clickable
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group h-full cursor-pointer flex flex-col"
    >
      <div className="h-52 overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {category && (
          <span className="absolute bottom-4 left-4 bg-purple-50 text-[#742E85] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            {category}
          </span>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-3 leading-snug group-hover:text-[#742E85] transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-6 flex-grow">
          {description}
        </p>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
          <span className="text-gray-400 text-[11px] font-medium">{date}</span>
          
          {/* Replaced Link with a div/span to prevent page navigation */}
          <span className="text-[#1976D2] text-[11px] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Read More <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}