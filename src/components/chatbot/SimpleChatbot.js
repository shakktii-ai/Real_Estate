'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SimpleChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeMenu, setActiveMenu] = useState('main');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(0);

  const locations = ['Hadapsar', 'NIBM', 'Kharadi', 'Wakad'];
  const priceRanges = ['20-30L', '30-50L', '50-75L', '75L+'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type, content) => {
    const id = `${Date.now()}-${messageIdRef.current++}`;
    setMessages((prev) => [...prev, { type, content, id }]);
  };

  const handleStart = () => {
    addMessage('bot', 'Welcome to PIINGGAKSHA! What would you like to know?');
    setActiveMenu('main');
  };

  const handlePrice = () => {
    setSelectedLocation(null);
    addMessage('user', 'Show me properties by price');
    addMessage('bot', 'Select your budget range:');
    setActiveMenu('price');
  };

  const handlePriceSelect = async (range) => {
    addMessage('user', `Budget: ${range}`);
    setSelectedPriceRange(range);
    setLoading(true);
    try {
      const projectsByRange = await fetchProjects(selectedLocation, range);
      setProjects(projectsByRange);
      const locationSuffix = selectedLocation ? ` in ${selectedLocation}` : '';
      addMessage('bot', `Found ${projectsByRange.length} projects for ${range}${locationSuffix}. Select one:`);
      setActiveMenu('projects');
    } catch (error) {
      addMessage('bot', 'Error loading projects. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocation = async () => {
    addMessage('user', 'Show me properties by location');
    addMessage('bot', 'Select a location:');
    setActiveMenu('location');
  };

  const normalizeProjectList = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.projects && Array.isArray(data.projects)) return data.projects;
    return [];
  };

  const parsePriceToLakhs = (value) => {
    if (!value) return NaN;
    const text = value.toString().replace(/[,₹\s]/g, '').toLowerCase();
    const match = text.match(/([\d.]+)/);
    if (!match) return NaN;
    const number = parseFloat(match[1]);
    if (text.includes('cr') || text.includes('crore')) return number * 100;
    if (text.includes('k')) return number / 100;
    return number;
  };

  const getProjectPriceLakhs = (project) => {
    const priceDropValue = project?.priceDrop?.newPrice || project?.priceDrop?.oldPrice;
    if (priceDropValue > 0) {
      return priceDropValue / 100000;
    }

    const displayPrice = project?.pricing?.displayPrice || project?.startingPrice;
    if (!displayPrice) return NaN;

    const splitRange = displayPrice.toString().split(/[-–]/).map((value) => value.trim());
    const prices = splitRange.map((value) => parsePriceToLakhs(value)).filter((v) => !Number.isNaN(v));
    if (prices.length === 0) return NaN;
    return Math.min(...prices);
  };

  const projectMatchesPriceRange = (project, rangeLabel) => {
    if (!rangeLabel) return true;
    const rangeText = rangeLabel.replace(/\s+/g, '').toLowerCase();
    let min = 0;
    let max = Infinity;
    if (rangeText.endsWith('l+')) {
      min = parseFloat(rangeText.replace('l+', '')) || 0;
    } else {
      const [from, to] = rangeText.replace('l', '').split('-');
      min = parseFloat(from) || 0;
      max = parseFloat(to) || Infinity;
    }
    const price = getProjectPriceLakhs(project);
    return !Number.isNaN(price) && price >= min && price <= max;
  };

  const filterProjectsByPrice = (projectsList, rangeLabel) => {
    if (!rangeLabel) return projectsList;
    return projectsList.filter((project) => projectMatchesPriceRange(project, rangeLabel));
  };

  const fetchProjects = async (location, priceRange) => {
    const query = location ? `?location=${encodeURIComponent(location)}` : '';
    const response = await fetch(`/api/chatbot/projects${query}`);
    const data = await response.json();
    if (!response.ok || data?.error) {
      throw new Error(data?.error || 'Failed to load projects');
    }
    const allProjects = normalizeProjectList(data);
    return priceRange ? filterProjectsByPrice(allProjects, priceRange) : allProjects;
  };

  const handleProjects = async () => {
    addMessage('user', 'Show me all projects');
    setLoading(true);
    try {
      const response = await fetch('/api/chatbot/projects');
      const data = await response.json();
      if (!response.ok || data?.error) {
        throw new Error(data?.error || 'Failed to load projects');
      }
      const allProjects = normalizeProjectList(data);
      setProjects(allProjects);
      addMessage('bot', `Found ${allProjects.length} projects. Select one to view details:`);
      setActiveMenu('projects');
    } catch (error) {
      addMessage('bot', 'Error loading projects. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (location) => {
    addMessage('user', `Projects in ${location}`);
    setSelectedLocation(location);
    setLoading(true);
    try {
      const locationProjects = await fetchProjects(location, selectedPriceRange);
      setProjects(locationProjects);
      const suffix = selectedPriceRange ? ` in ${selectedPriceRange}` : '';
      addMessage('bot', `Found ${locationProjects.length} projects in ${location}${suffix}. Select one:`);
      setActiveMenu('projects');
    } catch (error) {
      addMessage('bot', 'Error loading projects. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = async (projectId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chatbot/project-details?id=${encodeURIComponent(projectId)}`);
      const data = await response.json();
      if (!response.ok || data?.error || Object.keys(data).length === 0) {
        throw new Error(data?.error || 'Project details unavailable');
      }
      const project = data;
      setSelectedProject(project);
      addMessage('user', `Details for ${project.projectName || project.slug || 'project'}`);
      setActiveMenu('projectDetail');
    } catch (error) {
      addMessage('bot', 'Error loading project details.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveMenu('main');
    addMessage('bot', 'What would you like to know?');
  };

  const handleBackToProjects = () => {
    setActiveMenu('projects');
    addMessage('bot', 'Returning to project list.');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans sm:bottom-8">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            {/* Chat Window */}
            <div className="w-screen sm:w-[420px] max-w-[calc(100vw-36px)] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 h-[520px] sm:h-[620px] max-h-[calc(100vh-140px)]">
              <div className="relative  flex items-end justify-between gap-3 shadow-sm">
                {/* <div>
                  <p className="text-sm font-semibold text-slate-900">Dynamic Realty</p>
                  <p className="text-[13px] text-slate-500">Real Estate Assistant</p>
                </div> */}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3">
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full text-center"
                  >
                    <div>
                      <div className="text-3xl sm:text-4xl mb-2">👋</div>
                      <p className="text-gray-600 text-sm">Start a conversation</p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-3 rounded-3xl text-sm leading-relaxed break-words shadow-sm ${msg.type === 'bot'
                              ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                              : 'bg-purple-600 text-white rounded-tr-none'
                            }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-3xl px-4 py-3 shadow-sm">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce delay-100" />
                        <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Actions - Responsive Grid */}
              <div className="bg-white border-t border-slate-200 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-700">Choose an action</div>
                {activeMenu === 'main' && (
                  <div className="flex flex-wrap gap-3 justify-between">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePrice}
                      className="min-w-[110px] flex-1 bg-slate-900 text-black border b bg-white font-semibold py-3 rounded-2xl text-sm  transition-all"
                    >
                      Price
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLocation}
                      className="min-w-[110px] flex-1 text-black bg-white border b font-semibold py-3 rounded-2xl text-sm  transition-all"
                    >
                      Location
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProjects}
                      className="min-w-[110px] flex-1 bg-white text-black border b font-semibold py-3 rounded-2xl text-sm transition-all"
                    >
                      Projects
                    </motion.button>
                  </div>
                )}

                {activeMenu === 'price' && (
                  <div className="grid grid-cols-2 gap-2">
                    {priceRanges.map((range) => (
                      <motion.button
                        key={range}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePriceSelect(range)}
                        className="bg-blue-50 border border-blue-300 text-blue-700 font-medium py-2 px-2 rounded-lg text-xs hover:bg-blue-100 transition-all"
                      >
                        {range}
                      </motion.button>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBack}
                      className="bg-gray-200 text-gray-700 font-medium py-2 px-2 rounded-lg text-xs col-span-2 hover:bg-gray-300 transition-all"
                    >
                      Back
                    </motion.button>
                  </div>
                )}

                {activeMenu === 'location' && (
                  <div className="grid grid-cols-2 gap-2">
                    {locations.map((loc) => (
                      <motion.button
                        key={loc}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLocationSelect(loc)}
                        className="bg-green-50 border border-green-300 text-green-700 font-medium py-2 px-2 rounded-lg text-xs hover:bg-green-100 transition-all"
                        disabled={loading}
                      >
                        {loc}
                      </motion.button>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBack}
                      className="bg-gray-200 text-gray-700 font-medium py-2 px-2 rounded-lg text-xs col-span-2 hover:bg-gray-300 transition-all"
                    >
                      Back
                    </motion.button>
                  </div>
                )}

                {activeMenu === 'projects' && (
                  <div className="space-y-3">
                    {projects.length === 0 ? (
                      <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                        No projects available for this selection.
                      </div>
                    ) : (
                      <div className="max-h-[260px] overflow-y-auto space-y-3 pr-1">
                        {projects.map((project) => (
                          <motion.button
                            key={project._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleProjectSelect(project._id)}
                            className="w-full text-left bg-white border border-slate-200 rounded-3xl px-4 py-3 text-sm font-medium text-slate-900 shadow-sm hover:border-slate-300 transition-all"
                            disabled={loading}
                          >
                            {project.projectName}
                            <p className="mt-1 text-xs text-slate-500">{project.location || 'Location unavailable'}</p>
                          </motion.button>
                        ))}
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBack}
                      className="w-full bg-slate-100 text-slate-700 font-semibold py-3 rounded-2xl text-sm hover:bg-slate-200 transition-all"
                    >
                      ⬅️ Back
                    </motion.button>
                  </div>
                )}

                {activeMenu === 'projectDetail' && selectedProject && (
                  <div className="space-y-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-700">
                      <h3 className="font-semibold text-slate-900 mb-3 text-base">{selectedProject.projectName || selectedProject.slug || 'Project Details'}</h3>
                      <div className="space-y-2">
                        <p><span className="font-semibold">Builder:</span> {selectedProject.builderName || 'Unavailable'}</p>
                        <p><span className="font-semibold">Location:</span> {
                          selectedProject.location ||
                          [selectedProject.address?.area, selectedProject.address?.city].filter(Boolean).join(', ') ||
                          'Unknown location'
                        }</p>
                        <p><span className="font-semibold">Starting Price:</span> {
                          selectedProject.startingPrice || selectedProject.pricing?.displayPrice || 'Not available'
                        }</p>
                        {selectedProject.configuration && (
                          <p><span className="font-semibold">Config:</span> {Array.isArray(selectedProject.configuration) ? selectedProject.configuration.join(', ') : selectedProject.configuration}</p>
                        )}
                        {selectedProject.reraNumber && (
                          <p><span className="font-semibold">RERA:</span> {selectedProject.reraNumber}</p>
                        )}
                        {selectedProject.amenities && selectedProject.amenities.length > 0 && (
                          <p><span className="font-semibold">Amenities:</span> {selectedProject.amenities.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBackToProjects}
                      className="w-full bg-slate-100 text-slate-800 font-semibold py-3 rounded-2xl text-sm hover:bg-slate-200 transition-all"
                    >
                      ⬅️ Back to Projects
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      handleStart();
    }
  }}
  className="bg-gradient-to-r from-[#742E85] to-[#E5097F] text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-lg"
>
  <MessageCircle size={18} />
  Chat Now
</motion.button>
    </div>
  );
}
