'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Eye } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ChatbotLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? '/api/chatbot/leads' 
        : `/api/chatbot/leads?status=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this lead?')) {
      try {
        await fetch(`/api/chatbot/leads/${id}`, {
          method: 'DELETE',
        });
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Phone', 'Email', 'Budget', 'Location', 'Status', 'Date'],
      ...leads.map((lead) => [
        lead.name,
        lead.phone,
        lead.email || '',
        lead.budget || '',
        lead.preferredLocation || '',
        lead.status,
        new Date(lead.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${Date.now()}.csv`;
    a.click();
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4 sm:p-8"
    >
      <motion.div variants={fadeInUp} className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              📋 Chatbot Leads
            </h1>
            <p className="text-gray-600 mt-2">
              {leads.length} leads collected
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-medium whitespace-nowrap"
          >
            <Download size={20} />
            Export CSV
          </motion.button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'new', 'contacted', 'qualified', 'converted'].map(
            (status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            )
          )}
        </div>

        {/* Leads Table - Responsive */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No leads found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">
                      Contact
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                      Location
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <motion.tr
                      key={lead._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">
                        {lead.name}
                        <div className="sm:hidden text-xs text-gray-600 mt-1">
                          {lead.phone}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 hidden sm:table-cell">
                        {lead.phone}
                        {lead.email && (
                          <div className="text-xs text-gray-500">{lead.email}</div>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 hidden md:table-cell">
                        {lead.preferredLocation || '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            lead.status === 'converted'
                              ? 'bg-green-100 text-green-700'
                              : lead.status === 'qualified'
                                ? 'bg-blue-100 text-blue-700'
                                : lead.status === 'contacted'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(lead._id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete lead"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        {leads.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-600 text-sm">New</p>
              <p className="text-2xl font-bold text-blue-600">
                {leads.filter((l) => l.status === 'new').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-gray-600 text-sm">Contacted</p>
              <p className="text-2xl font-bold text-yellow-600">
                {leads.filter((l) => l.status === 'contacted').length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-gray-600 text-sm">Qualified</p>
              <p className="text-2xl font-bold text-purple-600">
                {leads.filter((l) => l.status === 'qualified').length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-gray-600 text-sm">Converted</p>
              <p className="text-2xl font-bold text-green-600">
                {leads.filter((l) => l.status === 'converted').length}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
