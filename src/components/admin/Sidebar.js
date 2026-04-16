import { 
  LayoutDashboard, Users, Home, ClipboardList, 
  Calendar, BookOpen, MessageSquare, Settings 
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard Overview', icon: <LayoutDashboard size={18}/> },
  { name: 'Users & Registrations', icon: <Users size={18}/> },
  { name: 'Homepage Management', icon: <Home size={18}/> },
  { name: 'Living Style Cards', icon: <ClipboardList size={18}/> },
  { name: 'Projects Management', icon: <ClipboardList size={18}/>, active: true },
  { name: 'Calendar & Bookings', icon: <Calendar size={18}/> },
  { name: 'Blogs', icon: <BookOpen size={18}/> },
  { name: 'Contact & Inquiries', icon: <MessageSquare size={18}/> },
  { name: 'Settings', icon: <Settings size={18}/> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 p-4 fixed left-0 top-0">
      <div className="mb-8 px-4">
        <div className="w-32 h-10 bg-blue-600 rounded"></div> {/* Logo */}
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              item.active 
              ? 'bg-[#703081] text-white' 
              : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}