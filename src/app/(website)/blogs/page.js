"use client";
import React, { useState, useEffect } from 'react';
import BlogCard from '@/components/BlogCard';
import Sidebar from '@/components/BlogSidebar';
import { Phone, Search, Loader2, ArrowLeft, Calendar, User } from 'lucide-react';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // NEW: State to track which blog is currently being read
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    let result = blogs;
    if (searchQuery) {
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredBlogs(result);
  }, [searchQuery, blogs]);

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-roboto text-black">
      <header className="max-w-7xl mx-auto p-6 px-6">
        <h1 className="text-xl md:text-4xl font-bold text-[#742E85]">
          {selectedBlog ? "Article Details" : "Real Estate Insights & Blogs"}
        </h1>
        <p className="text-black mt-2">
          {selectedBlog ? `Reading: ${selectedBlog.title}` : "Stay informed about the latest developments in Wakad real estate market"}
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Blog Posts Column */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-[#742E85]" size={40} />
            </div>
          ) : selectedBlog ? (
            /* --- FULL BLOG VIEW --- */
            <article className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
              <button 
                onClick={() => setSelectedBlog(null)}
                className="flex items-center gap-2 text-[#742E85] font-bold mb-6 hover:gap-3 transition-all"
              >
                <ArrowLeft size={20} /> Back to all blogs
              </button>
              
              <img 
                src={selectedBlog.image} 
                alt={selectedBlog.title} 
                className="w-full h-[400px] object-cover rounded-2xl mb-8"
              />
              
              <div className="flex gap-6 mb-6 text-gray-400 text-sm font-medium">
                <span className="flex items-center gap-2"><Calendar size={16}/> {new Date(selectedBlog.createdAt).toLocaleDateString("en-IN")}</span>
                <span className="flex items-center gap-2 text-[#742E85] font-bold tracking-wide uppercase text-[10px] bg-purple-50 px-3 py-1 rounded-lg">{selectedBlog.category}</span>
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
                {selectedBlog.title}
              </h2>

              <div className="prose prose-purple max-w-none text-gray-600 leading-relaxed space-y-4">
                {/* Rendering content - split by new lines for basic formatting */}
                {selectedBlog.description.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </article>
          ) : (
            /* --- GRID VIEW --- */
            filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredBlogs.map((blog) => (
                  <div key={blog._id} onClick={() => setSelectedBlog(blog)} className="cursor-pointer">
                    <BlogCard
                      title={blog.title}
                      image={blog.image}
                      date={new Date(blog.createdAt).toLocaleDateString("en-IN")}
                      description={
                        blog.description?.length > 120
                          ? blog.description.slice(0, 120) + "..."
                          : blog.description
                      }
                      // Note: Ensure your BlogCard component calls a function 
                      // or just wraps the content so the click works
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
                <p className="text-gray-500 font-medium">No blogs found.</p>
              </div>
            )
          )}
        </div>

        {/* Sidebar Column (Stays constant) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-4">Search Blog</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Property Insights..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedBlog(null); // Return to list view when searching
                }}
                className="w-full bg-[#F8F9FA] border-none rounded-xl py-3 px-4 pr-10 text-sm focus:ring-2 focus:ring-[#742E85]"
              />
              <div className="absolute right-2 top-2 bg-[#742E85] rounded p-2 text-white">
                <Search size={20} />
              </div>
            </div>
          </div>

          {/* Recent Posts - Click to view in place */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold mb-5 border-b pb-2">Recent Posts</h4>
            <div className="space-y-6">
              {blogs.slice(0, 3).map((post) => (
                <div
                  key={post._id}
                  onClick={() => {
                    setSelectedBlog(post);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex gap-4 items-center group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold leading-tight group-hover:text-[#742E85] transition-colors line-clamp-2">
                      {post.title}
                    </h5>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promo Card */}
          <div className="bg-gradient-to-tl from-[#742E85] to-[#E5097F] p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <h3 className="text-xl font-bold mb-4 leading-tight">Looking to Buy Your Dream Home?</h3>
            <p className="text-sm opacity-90 mb-6 font-light">Get expert guidance.</p>
            <button className="bg-white text-black w-full py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
              <Phone className='w-4 h-4' /> Get Free Consultation
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}