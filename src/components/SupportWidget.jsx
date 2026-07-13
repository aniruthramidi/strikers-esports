import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Mail, User, CheckCircle2, 
  MessageCircle, Sparkles, Home, Users, ShoppingBag 
} from 'lucide-react';
import { AdminContext } from '../features/admin/AdminContext';

export default function SupportWidget() {
  const { rostersState, staffState, homepageSettings, addContactMessage } = useContext(AdminContext);
  const navigate = useNavigate();

  // Responsive Check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Widget States
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Radial/Stack action menu
  const [isChatOpen, setIsChatOpen] = useState(false); // AI Chatbot modal
  const [isContactOpen, setIsContactOpen] = useState(false); // Separate Messaging modal
  const [showChatOnboarding, setShowChatOnboarding] = useState(true); // Chat onboarding guide

  // Timeout Refs for memory leak optimization (ponytail: prevent memory leaks on unmount)
  const chatTimeoutRef = useRef(null);
  const suggestTimeoutRef = useRef(null);
  const suggestBotTimeoutRef = useRef(null);
  const contactTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
      if (suggestTimeoutRef.current) clearTimeout(suggestTimeoutRef.current);
      if (suggestBotTimeoutRef.current) clearTimeout(suggestBotTimeoutRef.current);
      if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
    };
  }, []);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hi! I am the Strikers Esports Assistant. Ask me anything about our rosters, staff, stats, merch, or official social links!', time: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  // QA AI Logic based on context data
  const generateBotResponse = (input) => {
    const text = input.toLowerCase();

    // 1. Socials & Official links (checks first to handle "socials" precisely)
    if (
      text.includes('social') ||
      text.includes('link') ||
      text.includes('instagram') ||
      text.includes('insta') ||
      text.includes('youtube') ||
      text.includes('yt') ||
      text.includes('discord') ||
      text.includes('follow') ||
      text.includes('facebook') ||
      text.includes('twitter')
    ) {
      return {
        text: "Here are Strikers Esports' official social channels and community links! Follow and join our community:",
        html: `<div class="space-y-2 mt-2 font-sans">
          <div class="flex items-center justify-between bg-black/40 border border-white/5 p-2 rounded-xl">
            <span class="text-xs text-red-500 font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> YouTube
            </span>
            <a href="https://youtube.com/@Str1kersEsports" target="_blank" rel="noopener noreferrer" class="text-[9px] uppercase font-black tracking-wider bg-white text-black px-2.5 py-1 rounded-lg hover:bg-neutral-200 transition-colors">Subscribe</a>
          </div>
          <div class="flex items-center justify-between bg-black/40 border border-white/5 p-2 rounded-xl">
            <span class="text-xs text-pink-500 font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span> Instagram
            </span>
            <a href="https://instagram.com/strikersesports.gg" target="_blank" rel="noopener noreferrer" class="text-[9px] uppercase font-black tracking-wider bg-white text-black px-2.5 py-1 rounded-lg hover:bg-neutral-200 transition-colors">Follow</a>
          </div>
          <div class="flex items-center justify-between bg-black/40 border border-white/5 p-2 rounded-xl">
            <span class="text-xs text-indigo-400 font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span> Discord
            </span>
            <a href="https://discord.gg/GdHt36rJnG" target="_blank" rel="noopener noreferrer" class="text-[9px] uppercase font-black tracking-wider bg-white text-black px-2.5 py-1 rounded-lg hover:bg-neutral-200 transition-colors">Join Server</a>
          </div>
        </div>`
      };
    }

    // 2. Roster query
    if (text.includes('roster') || text.includes('player') || text.includes('lineup') || text.includes('team') || text.includes('bgmi') || text.includes('valorant')) {
      const bgmiCount = rostersState?.bgmi?.length || 0;
      const valCount = rostersState?.valorant?.length || 0;
      let reply = `Strikers Esports fields rosters in BGMI and Valorant. `;
      
      if (text.includes('bgmi')) {
        const names = (rostersState?.bgmi || []).map(p => `${p.name} (${p.role})`).join(', ');
        reply += `Our BGMI lineup: ${names || 'None registered'}.`;
      } else if (text.includes('valorant') || text.includes('val')) {
        const names = (rostersState?.valorant || []).map(p => `${p.name} (${p.role})`).join(', ');
        reply += `Our Valorant lineup: ${names || 'None registered'}.`;
      } else {
        reply += `We have ${bgmiCount} BGMI players and ${valCount} Valorant players. Ask for "BGMI roster" or "Valorant roster" details.`;
      }
      return reply;
    }

    // 3. Founder / Management query
    if (text.includes('founder') || text.includes('owner') || text.includes('management') || text.includes('staff') || text.includes('head')) {
      const founders = (staffState || []).filter(s => s.role.toLowerCase().includes('founder') || s.role.toLowerCase().includes('ceo') || s.role.toLowerCase().includes('owner'));
      if (founders.length > 0) {
        const list = founders.map(f => `${f.name} (${f.role})`).join(' and ');
        return `Strikers Esports was founded and is managed by ${list}. ${homepageSettings?.aboutDesc || ''}`;
      }
      return `Strikers Esports is managed by our dedicated administrative team. You can view them on our About page!`;
    }

    // 4. Stats / Tournament Achievements
    if (text.includes('stat') || text.includes('achievement') || text.includes('cup') || text.includes('trophy') || text.includes('prize') || text.includes('win')) {
      const statsList = homepageSettings?.stats || [];
      if (statsList.length > 0) {
        const details = statsList.map(s => `${s.value} ${s.label}`).join(', ');
        return `Here are our organizational achievements: ${details}.`;
      }
      return `Strikers Esports boasts multiple professional tournament victories across major gaming leagues.`;
    }

    // 5. Merch / Store
    if (text.includes('merch') || text.includes('buy') || text.includes('jersey') || text.includes('store') || text.includes('shop')) {
      return `Support us by purchasing team jerseys and gear in our Store! Just click "Shop" in the navigation bar to browse catalogs, view details, and place orders.`;
    }

    // 6. Contact / Support
    if (text.includes('contact') || text.includes('email') || text.includes('support') || text.includes('reach') || text.includes('help')) {
      return `You can reach us at our official contact email: ${homepageSettings?.contactEmail || 'contact@strikersesports.in'} or business email: ${homepageSettings?.businessEmail || 'info@strikersesports.in'}. ${homepageSettings?.supportInfo || ''}`;
    }

    // Default response
    return "I'm not sure I understand. Try asking about our 'social links', 'rosters', 'founders', 'stats', 'merch store', or 'contact email'!";
  };

  const handleSendChat = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', text: chatInput, time: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');

    setIsTyping(true);
    chatTimeoutRef.current = setTimeout(() => {
      const reply = generateBotResponse(currentInput);
      setChatHistory(prev => [...prev, { 
        sender: 'bot', 
        text: typeof reply === 'object' ? reply.text : reply, 
        html: typeof reply === 'object' ? reply.html : null,
        time: new Date() 
      }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleSuggestClick = (phrase) => {
    setChatInput(phrase);
    suggestTimeoutRef.current = setTimeout(() => {
      const userMessage = { sender: 'user', text: phrase, time: new Date() };
      setChatHistory(prev => [...prev, userMessage]);
      setChatInput('');
      setIsTyping(true);
      suggestBotTimeoutRef.current = setTimeout(() => {
        const reply = generateBotResponse(phrase);
        setChatHistory(prev => [...prev, { 
          sender: 'bot', 
          text: typeof reply === 'object' ? reply.text : reply, 
          html: typeof reply === 'object' ? reply.html : null,
          time: new Date() 
        }]);
        setIsTyping(false);
      }, 500);
    }, 50);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    addContactMessage(contactName, contactEmail, contactMessage);
    setIsSubmitted(true);
    contactTimeoutRef.current = setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setIsSubmitted(false);
      setIsContactOpen(false); // Close modal on complete
    }, 2500);
  };

  const openChat = () => {
    setIsChatOpen(true);
    setIsContactOpen(false);
    setIsMenuOpen(false);
  };

  const openContact = () => {
    setIsContactOpen(true);
    setIsChatOpen(false);
    setIsMenuOpen(false);
  };

  const closeAllModals = () => {
    setIsChatOpen(false);
    setIsContactOpen(false);
    setIsMenuOpen(false);
  };

  const handleMainFabClick = () => {
    if (isChatOpen || isContactOpen) {
      closeAllModals();
    } else {
      setIsMenuOpen(prev => !prev);
    }
  };

  // Mobile Radial Circular Menu Items
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/', isLink: true },
    { icon: <Users className="w-5 h-5" />, label: 'Teams', path: '/team', isLink: true },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Shop', path: '/merch', isLink: true },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'AI Chat', action: 'chat' },
    { icon: <Mail className="w-5 h-5" />, label: 'Inquire', action: 'contact' }
  ];

  const radius = 95; // pixels distance from center of FAB
  const angleStep = 90 / (menuItems.length - 1); // Quarter circle spread (90 degrees / 4 steps)

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Backdrop for Mobile Radial Menu Focus */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 0.7, backdropFilter: 'blur(6px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.25 }}
            onClick={closeAllModals}
            className="fixed inset-0 bg-black/80 z-30 pointer-events-auto"
            style={{ width: '100vw', height: '100vh', left: 0, top: 0 }}
          />
        )}
      </AnimatePresence>

      {/* 1. Chatbot Modal Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            className="mb-4 w-[340px] sm:w-[380px] h-[520px] bg-neutral-950/95 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col backdrop-blur-xl overflow-hidden relative z-45"
          >
            {/* Onboarding Welcome Screen */}
            <AnimatePresence>
              {showChatOnboarding && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-neutral-950 p-6 flex flex-col justify-between z-30"
                >
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <motion.div
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-black shadow-lg"
                    >
                      <Sparkles className="w-8 h-8" />
                    </motion.div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-black uppercase text-white tracking-widest">Strikers AI</h4>
                      <p className="text-[10px] text-neutral-400 max-w-[220px] leading-relaxed">
                        I can answer any questions about our teams, staff, stats, store gear, or official socials and links!
                      </p>
                    </div>

                    <div className="w-full space-y-2 pt-2">
                      <p className="text-[8px] uppercase tracking-wider font-bold text-neutral-500">Suggested Questions</p>
                      {[
                        { label: '📱 Social Links & Channels', query: 'socials' },
                        { label: '🔥 Team Rosters', query: 'roster' },
                        { label: '🛍️ Merchandise Store', query: 'merch' }
                      ].map((item, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.08 }}
                          onClick={() => {
                            setShowChatOnboarding(false);
                            handleSuggestClick(item.query);
                          }}
                          className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-white/5 rounded-xl text-xs font-semibold text-neutral-300 text-left transition-colors flex justify-between items-center group cursor-pointer"
                        >
                          <span>{item.label}</span>
                          <Send className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowChatOnboarding(false)}
                    className="w-full py-3 bg-white text-black font-black uppercase tracking-wider text-[10px] rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    Start Chatting
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chatbot Header */}
            <div className="p-5 border-b border-white/5 bg-gradient-to-r from-neutral-900 to-black flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black shadow-inner">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-white tracking-widest">Strikers AI</h3>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span> Online Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={closeAllModals}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chatbot Body */}
            <div className="flex-1 overflow-hidden flex flex-col bg-black/20">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-white text-black font-medium rounded-tr-none'
                          : 'bg-neutral-900 text-neutral-200 border border-white/5 rounded-tl-none'
                      }`}
                    >
                      <div className="space-y-1">
                        <p>{msg.text}</p>
                        {msg.html && (
                          <div 
                            className="mt-2"
                            dangerouslySetInnerHTML={{ __html: msg.html }} 
                          />
                        )}
                      </div>
                      <span className="block text-[8px] text-right mt-1.5 opacity-40 font-mono">
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-neutral-900 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestion Quick Actions */}
              <div className="px-4 py-2 flex gap-2 border-t border-white/5 bg-black/40 overflow-x-auto whitespace-nowrap scrollbar-none">
                <button
                  onClick={() => handleSuggestClick('socials')}
                  className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-white/5 rounded-full text-[9px] font-bold text-neutral-300 transition-colors shrink-0"
                >
                  📱 Org Socials
                </button>
                <button
                  onClick={() => handleSuggestClick('Valorant Roster')}
                  className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-white/5 rounded-full text-[9px] font-bold text-neutral-300 transition-colors shrink-0"
                >
                  🔥 Valorant Roster
                </button>
                <button
                  onClick={() => handleSuggestClick('Who is the founder?')}
                  className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-white/5 rounded-full text-[9px] font-bold text-neutral-300 transition-colors shrink-0"
                >
                  👑 Founders?
                </button>
                <button
                  onClick={() => handleSuggestClick('Team achievements')}
                  className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-white/5 rounded-full text-[9px] font-bold text-neutral-300 transition-colors shrink-0"
                >
                  🏆 Stats & Cups
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-white/5 bg-neutral-950 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-white text-black hover:bg-neutral-200 flex items-center justify-center transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Separate Contact Message Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            className="mb-4 w-[340px] sm:w-[380px] h-[520px] bg-neutral-950/95 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col backdrop-blur-xl overflow-hidden z-45"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-gradient-to-r from-neutral-900 to-black flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black shadow-inner">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-white tracking-widest">Send Message</h3>
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                    Direct Admin Inbox
                  </p>
                </div>
              </div>
              <button
                onClick={closeAllModals}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto p-5 bg-black/20">
              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-3"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                  <h4 className="text-sm font-black uppercase text-white tracking-wider">Message Received</h4>
                  <p className="text-[10px] text-neutral-400 max-w-[200px] leading-relaxed">
                    Thank you for reaching out. An administrator will review your message shortly!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                      <User className="w-3 h-3" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white resize-none"
                      placeholder="Write your inquiry or feedback..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-white text-black font-black uppercase tracking-wider text-xs rounded-full hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Mobile Circular Radial Action Menu OR Desktop Action Menu Stack */}
      <AnimatePresence>
        {isMenuOpen && (
          isMobile ? (
            /* Mobile Circular Menu Actions */
            <div className="absolute bottom-0 right-0 w-0 h-0 overflow-visible z-40 pointer-events-none">
              {menuItems.map((item, i) => {
                const angleInRad = ((180 + i * angleStep) * Math.PI) / 180;
                const x = Math.cos(angleInRad) * radius;
                const y = Math.sin(angleInRad) * radius;

                return (
                  <motion.button
                    key={i}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ x, y, scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: -180 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 320, 
                      damping: 18, 
                      delay: i * 0.015 
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (item.isLink) {
                        navigate(item.path);
                      } else {
                        if (item.action === 'chat') openChat();
                        if (item.action === 'contact') openContact();
                      }
                    }}
                    className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white shadow-xl hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer pointer-events-auto z-40"
                  >
                    {item.icon}
                    <span className="absolute top-13 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-neutral-400 tracking-wider whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded border border-white/5">
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            /* Desktop Stack Options above main button */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="flex flex-col gap-3 mb-4 items-end z-40 font-sans"
            >
              <button
                onClick={openChat}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900 border border-white/10 hover:border-white/30 text-white rounded-full shadow-lg transition-all text-xs font-bold uppercase tracking-wider group cursor-pointer"
              >
                <span>AI Chatbot</span>
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={openContact}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-neutral-900 border border-white/10 hover:border-white/30 text-white rounded-full shadow-lg transition-all text-xs font-bold uppercase tracking-wider group cursor-pointer"
              >
                <span>Send Message</span>
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
              </button>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* 4. Floating Toggle Main FAB Button */}
      <motion.button
        onClick={handleMainFabClick}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_10px_35px_rgba(255,255,255,0.25)] hover:bg-neutral-200 transition-all cursor-pointer border border-white/10 relative overflow-hidden z-50"
      >
        <AnimatePresence mode="wait">
          {(isMenuOpen || isChatOpen || isContactOpen) ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
