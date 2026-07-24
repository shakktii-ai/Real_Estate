'use client';



import { useState, useRef, useEffect } from 'react';

import Image from 'next/image';

import { X, Building2, SendHorizonal, MapPin, IndianRupee, ShieldCheck, Sparkles, Phone } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/lib/context/AuthContext';
import { BsWhatsapp } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import LiveAgentPopup from '../LiveAgentPopup';


export default function SimpleChatbot() {

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([]);

  const [inputValue, setInputValue] = useState('');

  const [loading, setLoading] = useState(false);

  const [conversationStep, setConversationStep] = useState('start');

  const [leadData, setLeadData] = useState({

    name: '',

    phone: '',

    propertyType: '',

    basicDetails: '',

  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [activeMenu, setActiveMenu] = useState('main');

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);

  const messagesEndRef = useRef(null);

  const messageIdRef = useRef(0);

  const { user } = useAuth();

  const router = useRouter();
  const [showLiveAgent, setShowLiveAgent] = useState(false);
  const openChatbotPanel = () => {
    setIsOpen(true);

    if (messages.length === 0) {
      addMessage('bot', 'Welcome to Piinggaksha! May I know your name?');
      setConversationStep('name');
    }
  };



  useEffect(() => {

    scrollToBottom();

  }, [messages]);



  useEffect(() => {
    const handleOpenChatbot = () => {
      openChatbotPanel();
    };

    window.addEventListener('open-chatbot', handleOpenChatbot);

    return () => {
      window.removeEventListener('open-chatbot', handleOpenChatbot);
    };
  }, [messages.length]);

  useEffect(() => {

    if (!user) return;



    const timer = setTimeout(() => {

      setIsOpen(true);



      setMessages((msgs) => {

        if (msgs.length === 0) {

          return [

            {

              id: Date.now(),

              type: 'bot',

              content: `Welcome back${user.fullName ? `, ${user.fullName}` : ''}! I can help you find the right property. Please share your name to get started.`,

            },

          ];

        }

        return msgs;

      });



      setConversationStep('name');

    }, 10000);



    return () => clearTimeout(timer);

  }, [user]);



  const locations = ['Hadapsar', 'NIBM', 'Kharadi', 'Wakad'];

  const priceRanges = ['20-30L', '30-50L', '50-75L', '75L+'];



  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  };



  const addMessage = (type, content) => {

    const id = `${Date.now()}-${messageIdRef.current++}`;

    setMessages((prev) => [...prev, { type, content, id }]);

  };



  const normalizePropertyType = (value) => {

    const trimmed = value.trim().toLowerCase();

    if (!trimmed) return '';

    if (trimmed.includes('residential')) return 'Residential';

    if (trimmed.includes('commercial') || trimmed.includes('office') || trimmed.includes('shop')) return 'Commercial';

    if (trimmed.includes('Plots') || trimmed.includes('plots') || trimmed.includes('plot')) return 'Plot';

    return '';

  };



  // const getPromptForStep = () => {

  //   switch (conversationStep) {

  //     case 'name':

  //       return 'Please share your name.';

  //     case 'phone':

  //       return 'Please share your mobile number.';

  //     case 'propertyType':

  //       return 'What are you looking for? Apartment, Villa, or Commercial?';

  //     case 'details':

  //       return 'Share a few basic details about your requirement.';

  //     default:

  //       return 'Tell us how we can help you.';

  //   }

  // };



  const handleStart = () => {

    if (messages.length > 0) return;

    addMessage('bot', 'Welcome to Piinggaksha! May I know your name?');

    setConversationStep('name');

  };



  const handleSendMessage = async (event) => {

    event.preventDefault();



    const trimmedValue = inputValue.trim();

    if (!trimmedValue || loading) return;



    addMessage('user', trimmedValue);

    setInputValue('');

    setLoading(true);



    try {

      if (conversationStep === 'name') {

        const updatedLead = { ...leadData, name: trimmedValue };

        setLeadData(updatedLead);

        setConversationStep('phone');

        addMessage('bot', `Thanks, ${trimmedValue}! Please enter your mobile number.`);

        return;

      }



      if (conversationStep === 'phone') {

        if (!/^[6-9]\d{9}$/.test(trimmedValue)) {

          addMessage('bot', 'Please enter a valid mobile number with 10 digits.');

          return;

        }



        const updatedLead = { ...leadData, phone: trimmedValue };

        setLeadData(updatedLead);

        setConversationStep('propertyType');

        addMessage('bot', 'What type of property are you looking for?\n\n- Residential\n- Plot\n- Commercial');

        return;

      }



      if (conversationStep === 'propertyType') {

        const propertyType = normalizePropertyType(trimmedValue);



        if (!propertyType) {

          addMessage('bot', 'Please reply with Residential, Plot, or Commercial.');

          return;

        }



        const updatedLead = { ...leadData, propertyType };

        setLeadData(updatedLead);

        setConversationStep('details');

        addMessage('bot', 'Please share your requirement (location, budget, etc.).');

        return;

      }



      if (conversationStep === 'details') {

        const finalLeadData = {

          ...leadData,

          basicDetails: trimmedValue,

        };



        setLeadData(finalLeadData);



        const response = await fetch('/api/chatbot/leads', {

          method: 'POST',

          headers: { 'Content-Type': 'application/json' },

          body: JSON.stringify({

            name: finalLeadData.name,

            phone: finalLeadData.phone,

            propertyType: finalLeadData.propertyType,

            basicDetails: finalLeadData.basicDetails,

            message: trimmedValue,

          }),

        });



        const data = await response.json();



        if (!response.ok) {

          throw new Error(data?.error || 'Unable to save your request');

        }



        setConversationStep('complete');

        setIsSubmitted(true);

        setActiveMenu('main');

        addMessage(

          'bot',

          <>

            <p>✅ Thank you!</p>



            <p className="mt-2">

              Our property expert will contact you soon.

            </p>



            <div className="mt-3 flex items-center gap-2">

              <Phone size={16} className="text-[#25D366]" /> <span>+91 92844 29197</span>

            </div>



            <div className="flex items-center gap-2">

              <BsWhatsapp size={16} className="text-[#25D366]" />



              <span>+91 91724 00250</span>

            </div>



            <p className="mt-3">

              Meanwhile, feel free to explore our available properties below.

            </p>

          </>

        );
      }

    } catch (error) {

      console.error('Chatbot lead submission failed:', error);

      addMessage('bot', 'Sorry, something went wrong while saving your request. Please try again.');

    } finally {

      setLoading(false);

    }

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



  const handleLocation = () => {

    addMessage('user', 'Show me properties by location');

    addMessage('bot', 'Select a preferred location:');

    setActiveMenu('location');

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

      addMessage('bot', 'Unable to load projects. Please try again.');

      console.error('Error:', error);

    } finally {

      setLoading(false);

    }

  };



  const handleBack = () => {

    setActiveMenu('main');

    addMessage('bot', 'What would you like to explore next?');

  };



  const handleBackToProjects = () => {

    setActiveMenu('projects');

    addMessage('bot', 'Returning to your matched project selections.');

  };



  return (

    <div className="fixed bottom-6 right-6 z-[50] font-sans sm:bottom-8">

      <AnimatePresence mode="wait">

        {isOpen && (

          <motion.div

            key="chat"

            initial={{ opacity: 0, scale: 0.92, y: 15 }}

            animate={{ opacity: 1, scale: 1, y: 0 }}

            exit={{ opacity: 0, scale: 0.92, y: 15 }}

            transition={{ type: "spring", damping: 24, stiffness: 220 }}

            className="fixed bottom-32 right-4 sm:bottom-36 sm:right-6 z-[999999]"

          >

            {/* Main Chat Window Panel */}

            <div className="w-screen sm:w-[300px] max-w-[calc(100vw-32px)] bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden  h-[560px] sm:h-[400px] max-h-[calc(100vh-120px)]">



              {/* Premium Top App Header bar */}

              <div className="bg-[#742e85] p-4 flex items-center justify-between text-white shadow-md z-10">

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

              <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-">

                {messages.length === 0 ? (

                  <motion.div

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    className="flex items-center justify-center h-full text-center p-4"

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

                        className={`max-w-[85%] px-2 py-2.5 rounded-2xl text-[12px] leading-relaxed break-words whitespace-pre-line shadow-sm ${msg.type === 'bot'

                          ? 'bg-white text-black rounded-tl-none border border-slate-100'

                          : 'bg-[#742e85] text-white rounded-tr-none font-medium'

                          }`}

                      >

                        {msg.content}

                      </div>

                    </motion.div>

                  ))

                )}

                {loading && (

                  <div className="flex justify-start">

                    <div className="bg-white border border-slate-100 rounded-full  px-2 py-2 shadow-sm flex items-center gap-1.5">

                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />

                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />

                      <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" />

                    </div>

                  </div>

                )}

                <div ref={messagesEndRef} />

              </div>



              {/* Bot Action Interaction Layer */}

              <div className="bg-white border-t border-slate-200/80 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">

                {!isSubmitted ? (

                  <form onSubmit={handleSendMessage} className="space-y-2">

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1">

                      {/* <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">

                        {getPromptForStep()}

                      </p> */}

                      <div className="mt-1 flex items-center gap-2">

                        <input

                          value={inputValue}

                          onChange={(event) => setInputValue(event.target.value)}

                          placeholder={

                            conversationStep === "name"

                              ? "Enter your name"



                              : conversationStep === "phone"

                                ? "Enter your mobile number"



                                : conversationStep === "propertyType"

                                  ? "Residential / Plot / Commercial"



                                  : "Share your requirement..."

                          }

                          className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"

                          disabled={loading}

                        />

                        <button

                          type="submit"

                          disabled={loading}

                          className="rounded-xl bg-[#742e85] p-2 text-white transition-all hover:bg-[#5f2470] disabled:cursor-not-allowed disabled:opacity-70"

                        >

                          <SendHorizonal size={16} />

                        </button>

                      </div>

                    </div>

                    {/* <p className="text-[10px] text-slate-500">

                      We will save your details and connect you with our team shortly.

                    </p> */}

                  </form>

                ) : (

                  <div className="space-y-3">

                    {activeMenu === 'main' && (

                      <div className="grid grid-cols-3 gap-2">

                        {[

                          { label: 'Price', handler: handlePrice },

                          { label: 'Location', handler: handleLocation },

                          { label: 'Projects', handler: handleProjects },

                        ].map((btn) => (

                          <motion.button

                            key={btn.label}

                            whileHover={{ scale: 1.02, y: -1 }}

                            whileTap={{ scale: 0.98 }}

                            onClick={btn.handler}

                            className="rounded-xl border border-[#742e85] bg-white px-2 py-3 text-xs font-semibold text-black shadow-sm transition-all hover:bg-[#742e85]/5"

                          >

                            {btn.label}

                          </motion.button>

                        ))}

                      </div>

                    )}



                    {activeMenu === 'price' && (

                      <div className="grid grid-cols-2 gap-1">

                        {priceRanges.map((range) => (

                          <motion.button

                            key={range}

                            whileHover={{ scale: 1.02 }}

                            whileTap={{ scale: 0.98 }}

                            onClick={() => handlePriceSelect(range)}

                            className="rounded-xl border border-purple-100 bg-purple-50/50 px-2 py-2 text-[10px] font-semibold text-black transition-all hover:bg-purple-50"

                          >

                            {range}

                          </motion.button>

                        ))}

                        <motion.button

                          whileHover={{ scale: 1.02 }}

                          whileTap={{ scale: 0.98 }}

                          onClick={handleBack}

                          className="col-span-2 w-full rounded-xl border border-slate-200 px-2 py-2.5 text-xs font-semibold text-slate-800 transition-all hover:bg-slate-100"

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

                            className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-2 py-2.5 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-50"

                            disabled={loading}

                          >

                            {loc}

                          </motion.button>

                        ))}

                        <motion.button

                          whileHover={{ scale: 1.02 }}

                          whileTap={{ scale: 0.98 }}

                          onClick={handleBack}

                          className="col-span-2 mt-1 rounded-xl bg-slate-100 px-2 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-200"

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

                          <div className="max-h-[180px] space-y-2 overflow-y-auto pr-1">

                            {projects.map((project) => (

                              <motion.button

                                key={project._id}

                                whileHover={{ scale: 1.01, x: 2 }}

                                whileTap={{ scale: 0.99 }}

                                onClick={() => handleProjectSelect(project._id)}

                                className="flex w-full flex-col gap-0.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 shadow-sm transition-all hover:border-purple-300"

                                disabled={loading}

                              >

                                <span className="truncate text-[13px] font-bold text-slate-900">{project.projectName}</span>

                                <span className="flex items-center gap-1 text-[11px] font-normal text-slate-400">

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

                          className="mt-1 w-full rounded-xl bg-slate-100 px-2 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200"

                        >

                          Main Navigation Menu

                        </motion.button>

                      </div>

                    )}



                    {activeMenu === 'projectDetail' && selectedProject && (

                      <div className="space-y-3">

                        <div className="max-h-[220px] space-y-2.5 overflow-y-auto pr-1 text-xs text-slate-600">

                          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2.5">

                            <h4 className="flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5 text-sm font-bold text-slate-900">

                              <Sparkles size={14} className="shrink-0 text-purple-600" />

                              {selectedProject.projectName || selectedProject.slug || 'Project Summary'}

                            </h4>



                            <div className="grid gap-2 text-[11px]">

                              <div className="flex items-center gap-2">

                                <Building2 size={13} className="shrink-0 text-slate-400" />

                                <p><span className="font-medium text-slate-400">Developer:</span> <span className="font-semibold text-slate-700">{selectedProject.builderName || 'N/A'}</span></p>

                              </div>



                              <div className="flex items-start gap-2">

                                <MapPin size={13} className="mt-0.5 shrink-0 text-slate-400" />

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

                                <IndianRupee size={13} className="shrink-0 text-slate-400" />

                                <p>

                                  <span className="font-medium text-slate-400">Investment Target:</span>{' '}

                                  <span className="font-bold text-purple-700">

                                    {selectedProject.startingPrice || selectedProject.pricing?.displayPrice || 'On Request'}

                                  </span>

                                </p>

                              </div>



                              {selectedProject.configuration && (

                                <div className="flex items-center gap-2">

                                  <div className="flex h-3.5 w-3.5 items-center justify-center rounded border border-slate-300 text-[8px] font-extrabold text-slate-400 shrink-0">B</div>

                                  <p>

                                    <span className="font-medium text-slate-400">Layout Configurations:</span>{' '}

                                    <span className="font-semibold text-slate-700">

                                      {Array.isArray(selectedProject.configuration) ? selectedProject.configuration.join(', ') : selectedProject.configuration}

                                    </span>

                                  </p>

                                </div>

                              )}



                              {selectedProject.reraNumber && (

                                <div className="mt-1 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/50 px-2 py-1">

                                  <ShieldCheck size={13} className="shrink-0 text-emerald-600" />

                                  <p className="text-[10px] text-emerald-800">

                                    <span className="font-semibold">RERA Registered:</span> {selectedProject.reraNumber}

                                  </p>

                                </div>

                              )}

                            </div>

                          </div>

                        </div>



                        <div className="flex w-full gap-2">

                          <motion.button

                            whileHover={{ scale: 1.01 }}

                            whileTap={{ scale: 0.99 }}

                            onClick={handleBackToProjects}

                            className="flex-1 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800"

                          >

                            Back to Projects

                          </motion.button>



                          <motion.button

                            whileHover={{ scale: 1.01 }}

                            whileTap={{ scale: 0.99 }}

                            onClick={() => {

                              const productRouteParam = selectedProject.slug || selectedProject._id;



                              if (productRouteParam) {

                                router.push(`/properties/${productRouteParam}`);

                              } else {

                                alert('Project page link is currently under maintenance.');

                              }

                            }}

                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:from-purple-700 hover:to-indigo-700"

                          >

                            <span className="truncate">View Project</span>

                          </motion.button>

                        </div>

                      </div>

                    )}

                  </div>

                )}

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>



      {/* Floating Call to Action Widget Switch */}

      <div className="fixed bottom-0 right-4 z-[60] flex flex-col items-end gap-2 sm:bottom-2 sm:right-6">   <motion.button

        whileHover={{ scale: 1.03 }}

        whileTap={{ scale: 0.97 }}

        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            return;
          }

          openChatbotPanel();
        }}

        className="w-[240px] rounded-[18px] bg-gradient-to-r from-[#742E85] to-[#E5097F] border border-white shadow-md shadow-white py-2 px-2 flex items-center gap-3 text-left transition-transform hover:scale-[1.01] hover:cursor-pointer mr-0 lg:mr-0"

      >
        <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center flex-shrink-0 bg-black/54">
          <Image
            src="/chatbot.png"
            alt="Ping AI"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-white text-[15px] font-semibold leading-tight tracking-tight mb-1">
            Ping AI
          </h2>
          <p className="text-white  text-[11px] lg:text-[10px] font-medium leading-tight">
            Find the Right HomeFaster
          </p>
        </div>
      </motion.button>
        <div className="flex items-center justify-end gap-2 w-full mb-2 mt-4">
          <button
            onClick={() => setShowLiveAgent(true)}
            className="animate-bounce bg-[#E5097F] ml-12 mr-0 hover:bg-[#c8006e] text-white text-[12px] lg:text-[10px] font-medium px-4 py-2 rounded-full shadow-md shadow-black/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Phone size={13} className="text-white" />
            <span>Call Now: 9284429197</span>
          </button>

          {/* WhatsApp Button */}

          <button

            type="button"

            onClick={(e) => {

              e.preventDefault();
              const companyPhoneNumber = "919172400250";
              const message = "Share Project Details";
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
       <LiveAgentPopup
  open={showLiveAgent}
  delay={20000}
  phoneNumbers={[
    {
      number: "9284429197",
      color: "green",
    },
    {
      number: "9529249230",
      color: "yellow",
    },
  ]}
  onCallbackSubmit={async (data) => {
    await fetch("/api/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setShowLiveAgent(false);
  }}
/>
      </div>

    </div>

  );

} 