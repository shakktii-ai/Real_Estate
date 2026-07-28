'use client';

import { useState, useRef, useEffect, useEffectEvent } from 'react';
import { X, SendHorizontal, MapPin, IndianRupee, ShieldCheck, Sparkles, Phone, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsWhatsapp } from 'react-icons/bs';
import LiveAgentPopup from '../LiveAgentPopup';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';

const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm12.01-21.867c-5.409 0-9.809 4.403-9.811 9.816-.001 1.956.51 3.864 1.48 5.549l.162.279-1.01 3.693 3.78-.991.272.162a9.782 9.782 0 0 0 5.127 1.442c5.412 0 9.814-4.403 9.817-9.816.002-2.614-1.012-5.074-2.863-6.928a9.72 9.72 0 0 0-6.974-2.855zm5.373 13.04c-.294-.148-1.743-.86-2.012-.958-.267-.098-.463-.148-.659.148-.196.295-.76.958-.931 1.155-.172.196-.344.221-.638.074-.294-.148-1.243-.458-2.37-1.464-.878-.782-1.47-1.747-1.642-2.043-.172-.295-.018-.455.129-.601.132-.132.294-.344.441-.516.148-.172.196-.295.294-.492.099-.196.05-.369-.024-.516-.074-.148-.659-1.591-.902-2.176-.237-.57-.479-.492-.659-.501-.171-.008-.368-.01-.565-.01-.196 0-.515.074-.784.369-.269.295-1.03 1.008-1.03 2.46 0 1.451 1.054 2.854 1.201 3.051.148.196 2.077 3.172 5.031 4.453.703.305 1.252.487 1.68.623.707.225 1.35.193 1.859.117.568-.086 1.743-.712 1.989-1.401.245-.688.245-1.278.172-1.401-.074-.122-.269-.196-.563-.344z" />
  </svg>
);

const useRouter = () => {
  return {
    push: (path) => {
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
    }
  };
};

const CHAT_QUESTIONNAIRE_STEPS = [
  {
    id: 'configuration',
    type: 'options',
    question: "Which home are you looking for?",
    options: ['2 BHK / 2.5 BHK', '3 BHK / 3.5 BHK', '4 BHK / Villa / Jodi Flat', '4.5 BHK+']
  },
  {
    id: 'budget',
    type: 'options',
    question: "What is your budget?",
    options: ['₹65L – ₹80L', '₹80L – ₹1.20Cr', '₹1.20Cr – ₹1.75Cr', '₹1.75Cr+']
  },
  {
    id: 'preferredLocation',
    type: 'options',
    question: "Preferred Location",
    options: ['NIBM / Mohammadwadi', 'Undri / Handewadi', 'Kondhwa / Hadapsar', 'Open to Suggestions']
  },
  {
    id: 'possession',
    type: 'options',
    question: "Possession Timeline",
    options: ['Within 1 Year', '2–3 Years', '3–4 Years', 'Flexible']
  },
  {
    id: 'purchasePurpose',
    type: 'options',
    question: "Purpose of Purchase",
    options: ['Self Use', 'Investment', 'Both', 'First Home']
  },
  {
    id: 'visitedProject',
    type: 'options',
    question: "Have you visited any project?",
    options: ['Yes', 'No', 'Looking for Recommendations', 'Already Shortlisted Projects']
  },
  {
    id: 'projectName',
    type: 'input',
    question: "Please enter the project name.",
    placeholder: "Enter project name..."
  },
  {
    id: 'siteVisit',
    type: 'options',
    question: "When would you like to schedule your FREE Site Visit?",
    options: ['Today', 'Tomorrow', 'This Weekend', 'Talk to an Expert First']
  },
  {
    id: 'name',
    type: 'input',
    question: "Great!\n\nPlease share your Full Name.",
    placeholder: "Enter your name"
  },
  {
    id: 'phone',
    type: 'input',
    question: "Please share your Mobile Number.",
    placeholder: "Enter your mobile number",
    validate: (val) => /^[6-9]\d{9}$/.test(val),
    errorMsg: "Please enter a valid mobile number with 10 digits."
  }
];

export default function SimpleChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [showLiveAgent, setShowLiveAgent] = useState(false);
  const [leadData, setLeadData] = useState({
    configuration: '',
    budget: '',
    preferredLocation: '',
    possession: '',
    purchasePurpose: '',
    visitedProject: '',
    projectName: '',
    siteVisit: '',
    name: '',
    phone: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeMenu, setActiveMenu] = useState('main');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(0);
  const hasLoadedHistoryRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const { user } = useAuth();
  const router = useRouter();

  const locations = ['Hadapsar', 'NIBM', 'Kharadi', 'Wakad'];
  const priceRanges = ['20-30L', '30-50L', '50-75L', '75L+'];

  const handleAutoOpenChatbot = useEffectEvent(() => {
    openChatbotPanel();
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user || !hasLoadedHistoryRef.current) return;
    const timer = setTimeout(() => {
      handleAutoOpenChatbot();
    }, 10000);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const loadConversation = async () => {
      if (!user?.uid) {
        hasLoadedHistoryRef.current = true;
        return;
      }

      try {
        const response = await fetch('/api/chatbot/history', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load chat history');
        }

        const conversation = data?.conversation;
        if (!isMounted || !conversation) {
          hasLoadedHistoryRef.current = true;
          return;
        }

        setIsOpen(Array.isArray(conversation.messages) && conversation.messages.length > 0);
        setMessages(Array.isArray(conversation.messages) ? conversation.messages : []);
        setCurrentStepIndex(typeof conversation.currentStepIndex === 'number' ? conversation.currentStepIndex : -1);
        setLeadData((prev) => ({
          ...prev,
          ...(conversation.leadData || {}),
        }));
        setIsSubmitted(Boolean(conversation.isSubmitted));
        setActiveMenu(conversation.activeMenu || 'main');
        setSelectedLocation(conversation.selectedLocation || null);
        setSelectedPriceRange(conversation.selectedPriceRange || null);
        setProjects(Array.isArray(conversation.projects) ? conversation.projects : []);
        setSelectedProject(conversation.selectedProject || null);
      } catch (error) {
        console.error('Failed to restore chatbot history:', error);
      } finally {
        hasLoadedHistoryRef.current = true;
      }
    };

    hasLoadedHistoryRef.current = false;
    loadConversation();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || !hasLoadedHistoryRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch('/api/chatbot/history', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages,
            currentStepIndex,
            leadData,
            isSubmitted,
            activeMenu,
            selectedLocation,
            selectedPriceRange,
            projects,
            selectedProject,
          }),
        });
      } catch (error) {
        console.error('Failed to save chatbot history:', error);
      }
    }, 400);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    user?.uid,
    messages,
    currentStepIndex,
    leadData,
    isSubmitted,
    activeMenu,
    selectedLocation,
    selectedPriceRange,
    projects,
    selectedProject,
  ]);

  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < CHAT_QUESTIONNAIRE_STEPS.length) {
      const step = CHAT_QUESTIONNAIRE_STEPS[currentStepIndex];
      const lastMessage = messages[messages.length - 1];
      const shouldAppendQuestion =
        !lastMessage ||
        lastMessage.type !== 'bot' ||
        lastMessage.content !== step.question;

      if (shouldAppendQuestion) {
        addMessage('bot', step.question);
      }
    }
  }, [currentStepIndex, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type, content, variant = 'text') => {
    const id = `${Date.now()}-${messageIdRef.current++}`;
    setMessages((prev) => [...prev, { type, content, id, variant }]);
  };

  const addLeadSuccessMessage = () => {
    addMessage(
      'bot',
      'Thank you! Our property expert will contact you soon.',
      'leadSuccess'
    );
  };

  const openChatbotPanel = () => {
    setIsOpen(true);
    setMessages((msgs) => {
      if (msgs.length === 0) {
        return [
          {
            id: Date.now(),
            type: 'bot',
            content: "Hi! I'm your AI Property Assistant. I help you find the perfect home in South Pune without spam calls or multiple brokers. What are you looking for today?",
          },
        ];
      }
      return msgs;
    });
    if (currentStepIndex === -1) {
      setCurrentStepIndex(0);
    }
  };

  const moveToNextQuestionStep = (currentDataState) => {
    const currentStep = CHAT_QUESTIONNAIRE_STEPS[currentStepIndex];
    if (!currentStep) return;

    let nextIndex = currentStepIndex + 1;

    if (currentStep.id === 'visitedProject') {
      const selection = currentDataState.visitedProject;
      if (selection !== 'Yes' && selection !== 'Already Shortlisted Projects') {
        nextIndex = CHAT_QUESTIONNAIRE_STEPS.findIndex(s => s.id === 'siteVisit');
      }
    }

    if (nextIndex < CHAT_QUESTIONNAIRE_STEPS.length && nextIndex !== -1) {
      setCurrentStepIndex(nextIndex);
    } else {
      dispatchLeadFormPayload(currentDataState);
    }
  };

  const handleOptionSelect = (optionValue) => {
    if (loading || isSubmitted) return;

    const currentStep = CHAT_QUESTIONNAIRE_STEPS[currentStepIndex];
    if (!currentStep) return;

    addMessage('user', optionValue);

    const updatedLeadData = {
      ...leadData,
      [currentStep.id]: optionValue
    };

    setLeadData(updatedLeadData);
    moveToNextQuestionStep(updatedLeadData);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedValue = inputValue.trim();
    if (!trimmedValue || loading) return;

    const currentStep = CHAT_QUESTIONNAIRE_STEPS[currentStepIndex];
    if (!currentStep) return;

    if (currentStep.validate && !currentStep.validate(trimmedValue)) {
      addMessage('user', trimmedValue);
      setInputValue('');
      addMessage('bot', currentStep.errorMsg || 'Invalid value provided. Please try again.');
      return;
    }

    addMessage('user', trimmedValue);
    setInputValue('');

    const updatedLeadData = {
      ...leadData,
      [currentStep.id]: trimmedValue
    };

    setLeadData(updatedLeadData);
    moveToNextQuestionStep(updatedLeadData);
  };

  const dispatchLeadFormPayload = async (finalLeadData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chatbot/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalLeadData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to save your request');
      }

      setIsSubmitted(true);
      setActiveMenu('main');
      addLeadSuccessMessage();
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

  const currentStep = currentStepIndex >= 0 && currentStepIndex < CHAT_QUESTIONNAIRE_STEPS.length
    ? CHAT_QUESTIONNAIRE_STEPS[currentStepIndex]
    : null;

  const renderMessageContent = (msg) => {
    if (msg.variant === 'leadSuccess') {
      return (
        <>
          <p>Thank you!</p>
          <p className="mt-2">Our property expert will contact you soon.</p>
          <div className="mt-3 flex items-center gap-2">
            <Phone size={16} className="text-[#25D366]" /> <span>+91 92844 29197</span>
          </div>
          <div className="flex items-center gap-2">
            <WhatsAppIcon size={16} className="text-[#25D366]" />
            <span>+91 91724 00250</span>
          </div>
          <p className="mt-3">Meanwhile, feel free to explore our available properties below.</p>
        </>
      );
    }

    return msg.content;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans sm:bottom-25">
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
            <div className="relative z-[70] w-screen sm:w-[320px] max-w-[calc(100vw-32px)] bg-[#f4f4f7] rounded-3xl shadow-2xl flex flex-col overflow-hidden h-[580px] sm:h-[400px] max-h-[calc(100vh-120px)] border border-slate-200">

              {/* Exact Header matching Screenshot */}
              <div className="bg-gradient-to-br from-[#742E85] to-[#E5097F] p-4 text-white shadow-md relative">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3.5 right-4 text-white/90 hover:text-white transition-all text-lg font-light cursor-pointer"
                >
                  <X size={20} />
                </button>

                {/* Header Top Title Section */}
                <div className="flex items-start gap-3 pr-6">
                  <div className="w-10 h-10 rounded-full border border-white/60 flex items-center justify-center shrink-0 bg-[#742E85] backdrop-blur-xs">
                    <Image
                      src="/chatbot.png"
                      alt="Ping AI"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight text-white leading-snug">
                      Find the Right Home Faster
                    </h3>
                    <p className="text-[11px] font-normal text-whie flex items-center gap-1 mt-0.5">
                      <Sparkles size={11} className="text-purple-200" />
                      AI Property Assistant - Online Now
                    </p>
                  </div>
                </div>

                {/* Badges Container */}
                <div className="grid grid-cols-2 items-center gap-1.5 mt-1 pt-1">
                  <span className="bg-white/20 backdrop-blur-md rounded-full px-2 py-1 text-[10px] font-medium text-white flex items-center gap-1">
                    🤖 AI Powered
                  </span>
                  <span className="bg-white/20 backdrop-blur-md rounded-full px-2 py-1 text-[10px] font-medium text-white flex items-center gap-1">
                    💬 Instant Answers
                  </span>
                  <span className="bg-white/20 backdrop-blur-md rounded-full px-2 py-1 text-[10px] font-medium text-white flex items-center gap-1">
                    📞 No Spam Calls
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-[#f4f4f7]">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2 ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                  >
                    {/* Bot Avatar Icon next to message */}
                    {msg.type === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#742E85] to-[#E5097F] flex items-center justify-center  shrink-0 mt-1">
                        <Image
                          src="/chatbot.png"
                          alt="Ping AI"
                          width={13}
                          height={13}
                          className="object-contain"
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] px-3.5 py-3 rounded-2xl text-[12px] leading-relaxed break-words whitespace-pre-line shadow-xs ${msg.type === 'bot'
                          ? 'bg-white text-slate-800 rounded-tl-xs border border-slate-100 font-medium'
                          : 'bg-[#80147B] text-white rounded-tr-xs font-medium'
                        }`}
                    >
                      {renderMessageContent(msg)}
                    </div>
                  </motion.div>
                ))}

                {/* Option Buttons */}
                {currentStep && currentStep.type === 'options' && !loading && !isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-1.5 pl-8 max-w-[90%]"
                  >
                    {currentStep.options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        className="w-full text-left bg-white hover:bg-purple-50/80 text-slate-800 font-medium text-[11px] py-2 px-3 rounded-xl border border-slate-200 transition-all shadow-xs cursor-pointer"
                      >
                        • {option}
                      </button>
                    ))}
                  </motion.div>
                )}

                {loading && (
                  <div className="flex justify-start pl-8">
                    <div className="bg-white border border-slate-100 rounded-full px-3 py-2 shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer Input Controls */}
              <div className="bg-white border-t border-slate-200 p-3 shadow-xs">
                {!isSubmitted ? (
                  currentStep && currentStep.type === 'input' ? (
                    <form onSubmit={handleSendMessage} className="space-y-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1">
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                            placeholder={currentStep.placeholder || "Enter details..."}
                            className="flex-1 bg-transparent text-xs text-black outline-hidden placeholder:text-black"
                            disabled={loading}
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-[#80147B] p-2 text-white transition-all hover:bg-[#681064] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                          >
                            <SendHorizontal size={14} />
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center text-xs text-black py-1 italic">
                      Please select an option above to continue...
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    {activeMenu === 'main' && (
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Price', handler: handlePrice },
                          { label: 'Location', handler: handleLocation },
                          { label: 'Projects', handler: handleProjects },
                        ].map((btn) => (
                          <motion.button
                            key={btn.label}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={btn.handler}
                            className="rounded-xl border border-[#80147B] bg-white px-2 py-2 text-xs font-semibold text-black shadow-xs transition-all hover:bg-[#80147B]/5 cursor-pointer"
                          >
                            {btn.label}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {activeMenu === 'price' && (
                      <div className="grid grid-cols-2 gap-1.5">
                        {priceRanges.map((range) => (
                          <motion.button
                            key={range}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePriceSelect(range)}
                            className="rounded-xl border border-purple-100 bg-purple-50/50 px-2 py-2 text-[10px] font-semibold text-black transition-all hover:bg-purple-50 cursor-pointer"
                          >
                            {range}
                          </motion.button>
                        ))}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleBack}
                          className="col-span-2 w-full rounded-xl border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-800 transition-all hover:bg-slate-100 cursor-pointer"
                        >
                          Back to Start
                        </motion.button>
                      </div>
                    )}

                    {activeMenu === 'location' && (
                      <div className="grid grid-cols-2 gap-1.5">
                        {locations.map((loc) => (
                          <motion.button
                            key={loc}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLocationSelect(loc)}
                            className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-2 py-2 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-50 cursor-pointer"
                            disabled={loading}
                          >
                            {loc}
                          </motion.button>
                        ))}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleBack}
                          className="col-span-2 mt-1 rounded-xl bg-slate-100 px-2 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-200 cursor-pointer"
                        >
                          Back to Start
                        </motion.button>
                      </div>
                    )}

                    {activeMenu === 'projects' && (
                      <div className="space-y-2">
                        {projects.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3 text-center text-xs text-slate-500">
                            No property items found matching selected parameters.
                          </div>
                        ) : (
                          <div className="max-h-[160px] space-y-2 overflow-y-auto pr-1">
                            {projects.map((project) => (
                              <motion.button
                                key={project._id}
                                whileHover={{ scale: 1.01, x: 2 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => handleProjectSelect(project._id)}
                                className="flex w-full flex-col gap-0.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-800 shadow-xs transition-all hover:border-purple-300 cursor-pointer"
                                disabled={loading}
                              >
                                <span className="truncate text-[12px] font-bold text-slate-900">{project.projectName}</span>
                                <span className="flex items-center gap-1 text-[10px] font-normal text-slate-400">
                                  <MapPin size={10} className="shrink-0 text-slate-300" /> {project.location || 'Location Not Specified'}
                                </span>
                              </motion.button>
                            ))}
                          </div>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleBack}
                          className="w-full rounded-xl bg-slate-100 px-2 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200 cursor-pointer"
                        >
                          Main Navigation Menu
                        </motion.button>
                      </div>
                    )}

                    {activeMenu === 'projectDetail' && selectedProject && (
                      <div className="space-y-2">
                        <div className="max-h-[180px] space-y-2 overflow-y-auto pr-1 text-xs text-slate-600">
                          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                            <h4 className="flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5 text-xs font-bold text-slate-900">
                              <Sparkles size={13} className="shrink-0 text-purple-600" />
                              {selectedProject.projectName || selectedProject.slug || 'Project Summary'}
                            </h4>

                            <div className="grid gap-1.5 text-[11px]">
                              <div className="flex items-center gap-2">
                                <MapPin size={12} className="shrink-0 text-slate-400" />
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
                                <IndianRupee size={12} className="shrink-0 text-slate-400" />
                                <p>
                                  <span className="font-medium text-slate-400">Investment Target:</span>{' '}
                                  <span className="font-bold text-purple-700">
                                    {selectedProject.startingPrice || selectedProject.pricing?.displayPrice || 'On Request'}
                                  </span>
                                </p>
                              </div>

                              {selectedProject.reraNumber && (
                                <div className="mt-1 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/50 px-2 py-1">
                                  <ShieldCheck size={12} className="shrink-0 text-emerald-600" />
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
                            className="flex-1 rounded-xl bg-slate-900 px-2.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 cursor-pointer"
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
                              }
                            }}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:from-purple-700 hover:to-indigo-700 cursor-pointer"
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

      {/* Floating CTA Widget */}
      <div className="fixed bottom-0 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-2 sm:right-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
              return;
            }
            openChatbotPanel();
          }}
          className="w-[240px] rounded-[18px] bg-gradient-to-r from-[#80147B] to-[#C41484] border border-white shadow-md shadow-white py-2 px-2 flex items-center gap-3 text-left transition-transform hover:scale-[1.01] hover:cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center flex-shrink-0 bg-black/40">
            <Image
              src="/chatbot.png"
              alt="Ping AI"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-white text-[15px] font-semibold leading-tight tracking-tight mb-0.5">
              Ping AI
            </h2>
            <p className="text-white text-[10px] font-medium leading-tight">
              Find the Right Home Faster
            </p>
          </div>
        </motion.button>

        <div className="flex items-center justify-end gap-2 w-full mb-2 mt-2">
          <button
            onClick={() => setShowLiveAgent(true)}
            className="animate-bounce bg-[#E5097F] hover:bg-[#c8006e] text-white text-[10px] font-medium px-3.5 py-2 rounded-full shadow-md shadow-black/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Phone size={12} className="text-white" />
            <span>Call Now: 9284429197</span>
          </button>

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
            className="bg-[#1AA34A] hover:bg-[#20ba5a] text-white p-2 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-xl transition-all whitespace-nowrap animate-bounce cursor-pointer"
          >
            <BsWhatsapp size={18} />
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
