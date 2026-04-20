"use client";
import { useState } from 'react';
import { Star, X } from 'lucide-react';

export default function AddReviewModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    customerName: '', reviewText: '', rating: 5, googleLink: '', 
    showOnHomepage: false, showOnAboutUs: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/reviews', { method: 'POST', body: JSON.stringify(formData) });
    onRefresh();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
        <div className="flex justify-between items-center mb-4 text-black">
          <h2 className="text-xl font-bold">Add New Google Review</h2>
          <button onClick={onClose}><X size={20}/></button>
        </div>

        <input placeholder="Customer Name" className="w-full p-3 border rounded-xl text-black placeholder-gray-400" onChange={e => setFormData({...formData, customerName: e.target.value})} />
        <textarea placeholder="Review Text" className="w-full p-3 border rounded-xl text-black placeholder-gray-400" rows="3" onChange={e => setFormData({...formData, reviewText: e.target.value})} />
        
        {/* Star Rating Logic */}
        <div className="flex gap-2">
          {[1,2,3,4,5].map(star => (
            <Star key={star} className={`cursor-pointer ${formData.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} onClick={() => setFormData({...formData, rating: star})} />
          ))}
        </div>

        <input placeholder="Google Link" className="w-full p-3 border rounded-xl text-black placeholder-gray-400" onChange={e => setFormData({...formData, googleLink: e.target.value})} />
        
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-black placeholder-gray-400"><input type="checkbox" onChange={e => setFormData({...formData, showOnHomepage: e.target.checked})} /> Show on Homepage</label>
          <label className="flex items-center gap-2 text-black placeholder-gray-400"><input type="checkbox" onChange={e => setFormData({...formData, showOnAboutUs: e.target.checked})} /> Show on About Us</label>
        </div>

        <button className="w-full bg-[#742E85] text-white py-4 rounded-xl font-bold hover:opacity-90">Add Google Reviews</button>
      </form>
    </div>
  );
}