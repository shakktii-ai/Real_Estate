export default function BlogSidebar() {
  const categories = [
    { name: "Real Estate", count: 42 },
    { name: "Buying Guide", count: 28 },
    { name: "Investment Tips", count: 35 },
    { name: "Legal Advice", count: 19 },
    { name: "Market Trends", count: 24 }
  ];

  return (
    <div className="space-y-8">
      {/* Categories List */}
      {/* <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="font-bold mb-5 border-b pb-2">Categories</h4>
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li key={cat.name} className="flex justify-between text-sm group cursor-pointer">
              <span className="text-gray-600 group-hover:text-[#742E85] font-medium">{cat.name}</span>
              <span className="text-gray-400">({cat.count})</span>
            </li>
          ))}
        </ul>
      </div> */}

      {/* Recent Posts */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="font-bold mb-5 border-b pb-2">Recent Post</h4>
        <div className="space-y-6">
          {[1, 2, 3].map((post) => (
            <div key={post} className="flex gap-4 items-center group cursor-pointer">
              <div className="w-16 h-16 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                <div className="w-full h-full bg-gray-200" /> {/* Placeholder for thumbnail */}
              </div>
              <div>
                <h5 className="text-[13px] font-bold leading-tight group-hover:text-[#742E85]"></h5>
                <p className="text-[10px] text-gray-400 mt-1">Mar 15, 2026</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}