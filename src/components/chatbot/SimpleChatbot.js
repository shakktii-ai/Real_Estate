'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, MapPin, Building2, IndianRupee, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsWhatsapp } from 'react-icons/bs';
import { useAuth } from '@/lib/context/AuthContext';

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

  const prevUserRef = useRef(undefined);
  const { user } = useAuth();


  const locations = ['Hadapsar', 'NIBM', 'Kharadi', 'Wakad'];
  const priceRanges = ['20-30L', '30-50L', '50-75L', '75L+'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-open chatbot 10 seconds after login
 useEffect(() => {
  if (!user) return;

  const timer = setTimeout(() => {
    setIsOpen(true);

    setMessages((msgs) => {
      if (msgs.length === 0) {
        return [
          {
            id: Date.now(),
            type: "bot",
            content: `Welcome back${user.fullName ? ", " + user.fullName : ""}! What would you like to know today?`,
          },
        ];
      }
      return msgs;
    });
  }, 10000);

  return () => clearTimeout(timer);
}, [user]);




  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type, content) => {
    const id = `${Date.now()}-${messageIdRef.current++}`;
    setMessages((prev) => [...prev, { type, content, id }]);
  };

  const handleStart = () => {
    addMessage('bot', 'Welcome to PIINGGAKSHA! What would you like to know today?');
    setActiveMenu('main');
  };

  const handlePrice = () => {
    setSelectedLocation(null);
    addMessage('user', 'Show me properties by price');
    addMessage('bot', 'Select your preferred budget range:');
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
      addMessage('bot', `Found ${projectsByRange.length} projects for ${range}${locationSuffix}. Select one to explore details:`);
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
    addMessage('bot', 'Select a preferred location:');
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
      addMessage('bot', `Found ${allProjects.length} premium projects. Select one to view specifications:`);
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
      addMessage('bot', `Found ${locationProjects.length} projects in ${location}${suffix}. Select a project:`);
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
    addMessage('bot', 'What details can I find for you next?');
  };

  const handleBackToProjects = () => {
    setActiveMenu('projects');
    addMessage('bot', 'Returning to your matched project selections.');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans sm:bottom-8">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="mb-4"
          >
            {/* Main Chat Window Panel */}
            <div className="w-screen sm:w-[400px] max-w-[calc(100vw-32px)] bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 h-[560px] sm:h-[600px] max-h-[calc(100vh-120px)]">

              {/* Premium Top App Header bar */}
              <div className="bg-gradient-to-r from-[#742E85] to-[#E5097F] p-4 flex items-center justify-between text-white shadow-md z-10">
                <div className="flex items-center gap-2.5">
                  <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-md">
                    <Building2 size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide uppercase">Piinggaksha</h3>

                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-white/10 p-2 text-white/90 hover:bg-white/20 transition-all hover:scale-105"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Central Scrolling Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full text-center p-6"
                  >
                    <div className="max-w-[240px]">
                      <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner text-2xl">
                        👋
                      </div>
                      <h4 className="text-slate-800 font-semibold text-sm mb-1">Let's find your space</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">Select from the smart menus below to filter through our residential portfolios.</p>
                    </div>
                  </motion.div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed break-words shadow-sm ${msg.type === 'bot'
                          ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                          : 'bg-purple-600 text-white rounded-tr-none font-medium'
                          }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bot Action Interaction Layer */}
              <div className="bg-white border-t border-slate-200/80 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">

                {activeMenu === 'main' && (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Price', handler: handlePrice },
                      { label: 'Location', handler: handleLocation },
                      { label: 'Projects', handler: handleProjects }
                    ].map((btn) => (
                      <motion.button
                        key={btn.label}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={btn.handler}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 py-3 px-1 rounded-xl text-xs transition-all shadow-sm flex flex-col items-center justify-center gap-1"
                      >
                        {btn.label}
                      </motion.button>
                    ))}
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
                        className="bg-purple-50/50 hover:bg-purple-50 border border-purple-100 text-purple-700 font-semibold py-2.5 px-2 rounded-xl text-xs transition-all"
                      >
                        {range}
                      </motion.button>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBack}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-2 rounded-xl text-xs col-span-2 transition-all mt-1"
                    >
                      Back to Start
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
                        className="bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold py-2.5 px-2 rounded-xl text-xs transition-all"
                        disabled={loading}
                      >
                        {loc}
                      </motion.button>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBack}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-2 rounded-xl text-xs col-span-2 transition-all mt-1"
                    >
                      Back to Start
                    </motion.button>
                  </div>
                )}

                {activeMenu === 'projects' && (
                  <div className="space-y-2">
                    {projects.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs text-slate-500">
                        No property items found matching selected parameters.
                      </div>
                    ) : (
                      <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {projects.map((project) => (
                          <motion.button
                            key={project._id}
                            whileHover={{ scale: 1.01, x: 2 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleProjectSelect(project._id)}
                            className="w-full text-left bg-white border border-slate-200 hover:border-purple-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-sm transition-all flex flex-col gap-0.5"
                            disabled={loading}
                          >
                            <span className="truncate text-[13px] text-slate-900 font-bold">{project.projectName}</span>
                            <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                              <MapPin size={11} className="shrink-0 text-slate-300" /> {project.location || 'Location Not Specified'}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBack}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs transition-all mt-1"
                    >
                      Main Navigation Menu
                    </motion.button>
                  </div>
                )}

                {activeMenu === 'projectDetail' && selectedProject && (
                  <div className="space-y-3">
                    {/* Professional Project Detail View Container Grid */}
                    <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2.5 text-xs text-slate-600 scrollbar-thin">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2.5">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
                          <Sparkles size={14} className="text-purple-600 shrink-0" />
                          {selectedProject.projectName || selectedProject.slug || 'Project Summary'}
                        </h4>

                        <div className="grid gap-2 text-[11px]">
                          <div className="flex items-center gap-2">
                            <Building2 size={13} className="text-slate-400 shrink-0" />
                            <p><span className="font-medium text-slate-400">Developer:</span> <span className="font-semibold text-slate-700">{selectedProject.builderName || 'N/A'}</span></p>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                            <p>
                              <span className="font-medium text-slate-400">Vicinity:</span>{' '}
                              <span className="font-semibold text-slate-700">
                                {selectedProject.location ||
                                  [selectedProject.address?.area, selectedProject.address?.city].filter(Boolean).join(', ') ||
                                  'Details Restricted'}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <IndianRupee size={13} className="text-slate-400 shrink-0" />
                            <p>
                              <span className="font-medium text-slate-400">Investment Target:</span>{' '}
                              <span className="font-bold text-purple-700">
                                {selectedProject.startingPrice || selectedProject.pricing?.displayPrice || 'On Request'}
                              </span>
                            </p>
                          </div>

                          {selectedProject.configuration && (
                            <div className="flex items-center gap-2">
                              <div className="w-3.5 h-3.5 rounded border border-slate-300 flex items-center justify-center text-[8px] font-extrabold text-slate-400 shrink-0">B</div>
                              <p>
                                <span className="font-medium text-slate-400">Layout Configurations:</span>{' '}
                                <span className="font-semibold text-slate-700">
                                  {Array.isArray(selectedProject.configuration) ? selectedProject.configuration.join(', ') : selectedProject.configuration}
                                </span>
                              </p>
                            </div>
                          )}

                          {selectedProject.reraNumber && (
                            <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 rounded-lg px-2 py-1 mt-1">
                              <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                              <p className="text-emerald-800 text-[10px]">
                                <span className="font-semibold">RERA Registered:</span> {selectedProject.reraNumber}
                              </p>
                            </div>
                          )}

                          {selectedProject.amenities && selectedProject.amenities.length > 0 && (
                            <div className="pt-1.5 border-t border-slate-200/40">
                              <span className="font-medium text-slate-400 block mb-1">Highlight Features:</span>
                              <div className="flex flex-wrap gap-1">
                                {selectedProject.amenities.slice(0, 3).map((amenity, index) => (
                                  <span key={index} className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-medium shadow-2xs">
                                    {amenity}
                                  </span>
                                ))}
                                {selectedProject.amenities.length > 3 && (
                                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                    +{selectedProject.amenities.length - 3} More
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleBackToProjects}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm"
                    >
                      Back to Project Pipeline
                    </motion.button>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Call to Action Widget Switch */}
     <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Chatbot Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && messages.length === 0) {
              handleStart();
            }
          }}
          className="bg-[#2559ff] text-white px-2 py-2 rounded-full hover:cursor-pointer hover:p-3 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all font-semibold text-sm tracking-wide animate-bounce"
        >
          <MessageCircle size={20} />

        </motion.button>

        {/* WhatsApp Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const companyPhoneNumber = "919172400250";

            const message =
              "Share Project Details";

            const encodedMessage = encodeURIComponent(message);

            window.open(
              `https://wa.me/${companyPhoneNumber}?text=${encodedMessage}`,
              "_blank"
            );
          }}
          className="bg-[#1AA34A] hover:bg-[#20ba5a] hover:cursor-pointer hover:p-3 text-white px-2 py-2 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-xl transition-all whitespace-nowrap animate-bounce"
        >
          <BsWhatsapp size={20} />
        </button>
      </div>
    </div>
  );
}