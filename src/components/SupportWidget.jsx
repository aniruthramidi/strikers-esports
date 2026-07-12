import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mail, User, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { AdminContext } from '../features/admin/AdminContext';

export default function SupportWidget() {
  const { rostersState, staffState, homepageSettings, addContactMessage } = useContext(AdminContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'contact'
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hi! I am the Strikers Esports Assistant. Ask me anything about our rosters, staff, stats, merch, or contact coordinates!', time: new Date() }
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

    // 1. Roster query
    if (text.includes('roster') || text.includes('player') || text.includes('lineup') || text.includes('team') || text.includes('bgmi') || text.includes('valorant')) {
      const bgmiCount = rostersState?.bgmi?.length || 0;
      const valCount = rostersState?.valorant?.length || 0;
      let reply = `Strikers Esports currently fields professional lineups in BGMI and Valorant. `;
      
      if (text.includes('bgmi')) {
        const names = (rostersState?.bgmi || []).map(p => `${p.name} (${p.role})`).join(', ');
        reply += `Our active BGMI Roster includes ${bgmiCount} members: ${names || 'None registered'}.`;
      } else if (text.includes('valorant') || text.includes('val')) {
        const names = (rostersState?.valorant || []).map(p => `${p.name} (${p.role})`).join(', ');
        reply += `Our active Valorant Roster includes ${valCount} members: ${names || 'None registered'}.`;
      } else {
        reply += `We have ${bgmiCount} BGMI players and ${valCount} Valorant players. Type "BGMI Roster" or "Valorant Roster" for member details.`;
      }
      return reply;
    }

    // 2. Founder / Management query
    if (text.includes('founder') || text.includes('owner') || text.includes('management') || text.includes('staff') || text.includes('head')) {
      const founders = (staffState || []).filter(s => s.role.toLowerCase().includes('founder') || s.role.toLowerCase().includes('ceo') || s.role.toLowerCase().includes('owner'));
      if (founders.length > 0) {
        const list = founders.map(f => `${f.name} (${f.role})`).join(' and ');
        return `Strikers Esports was founded and is managed by ${list}. ${homepageSettings?.aboutDesc || ''}`;
      }
      return `Strikers Esports is managed by our dedicated administrative team. You can view them on our About page!`;
    }

    // 3. Stats / Tournament Achievements
    if (text.includes('stat') || text.includes('achievement') || text.includes('cup') || text.includes('trophy') || text.includes('prize') || text.includes('win')) {
      const statsList = homepageSettings?.stats || [];
      if (statsList.length > 0) {
        const details = statsList.map(s => `${s.value} ${s.label}`).join(', ');
        return `Here are our organizational achievements to date: ${details}.`;
      }
      return `Strikers Esports boasts multiple professional tournament victories across major gaming leagues.`;
    }

    // 4. Merch / Store
    if (text.includes('merch') || text.includes('buy') || text.includes('jersey') || text.includes('store') || text.includes('shop')) {
      return `You can support us by purchasing official team jerseys and gear in our Store! Just click "Shop Gear" in the header to browse catalogs, view details, and place orders.`;
    }

    // 5. Contact / Support
    if (text.includes('contact') || text.includes('email') || text.includes('support') || text.includes('reach') || text.includes('help')) {
      return `You can reach us at our official contact email: ${homepageSettings?.contactEmail || 'contact@strikersesports.in'} or business email: ${homepageSettings?.businessEmail || 'info@strikersesports.in'}. ${homepageSettings?.supportInfo || ''}`;
    }

    // Default response
    return "I'm not sure I understand. Try asking about our 'rosters', 'founders', 'stats', 'merch store', or 'contact email', or send a message directly in the Send Message tab!";
  };

  const handleSendChat = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', text: chatInput, time: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');

    // Trigger typing simulation
    setIsTyping(true);
    setTimeout(() => {
      const replyText = generateBotResponse(currentInput);
      setChatHistory(prev => [...prev, { sender: 'bot', text: replyText, time: new Date() }]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleSuggestClick = (phrase) => {
    setChatInput(phrase);
    // Submit programmatically in next microtask
    setTimeout(() => {
      const userMessage = { sender: 'user', text: phrase, time: new Date() };
      setChatHistory(prev => [...prev, userMessage]);
      setChatInput('');
      setIsTyping(true);
      setTimeout(() => {
        const replyText = generateBotResponse(phrase);
        setChatHistory(prev => [...prev, { sender: 'bot', text: replyText, time: new Date() }]);
        setIsTyping(false);
      }, 700);
    }, 50);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    addContactMessage(contactName, contactEmail, contactMessage);
    setIsSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setIsSubmitted(false);
      setActiveTab('chat');
    }, 2500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Expanded Support panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            className="mb-4 w-[340px] sm:w-[380px] h-[520px] bg-neutral-950/95 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-gradient-to-r from-neutral-900 to-black flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black shadow-inner">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase text-white tracking-widest">Strikers Support</h3>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span> Online Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 text-[10px] font-black uppercase tracking-wider bg-black/40">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  activeTab === 'chat'
                    ? 'border-white text-white bg-white/5'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                AI Chatbot
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  activeTab === 'contact'
                    ? 'border-white text-white bg-white/5'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Send Message
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-hidden flex flex-col bg-black/20">
              {activeTab === 'chat' ? (
                <>
                  {/* Chat History */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin">
                    {chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-white text-black font-medium rounded-tr-none'
                              : 'bg-neutral-900 text-neutral-200 border border-white/5 rounded-tl-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className="block text-[8px] text-right mt-1.5 opacity-40">
                            {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-neutral-900 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Suggestion Pills */}
                  <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-white/5 bg-black/40 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <button
                      onClick={() => handleSuggestClick('Valorant Roster')}
                      className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-white/5 rounded-full text-[9px] font-bold text-neutral-300 transition-colors"
                    >
                      Valorant Roster
                    </button>
                    <button
                      onClick={() => handleSuggestClick('Who is the founder?')}
                      className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-white/5 rounded-full text-[9px] font-bold text-neutral-300 transition-colors"
                    >
                      Founders?
                    </button>
                    <button
                      onClick={() => handleSuggestClick('Team achievements')}
                      className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-white/5 rounded-full text-[9px] font-bold text-neutral-300 transition-colors"
                    >
                      Team Stats
                    </button>
                    <button
                      onClick={() => handleSuggestClick('How to contact you?')}
                      className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-white/5 rounded-full text-[9px] font-bold text-neutral-300 transition-colors"
                    >
                      Email Contact
                    </button>
                  </div>

                  {/* Chat Input */}
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
                </>
              ) : (
                /* Contact Us Form */
                <div className="p-5 h-full overflow-y-auto space-y-4">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="h-64 flex flex-col items-center justify-center text-center space-y-3"
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                      <h4 className="text-sm font-black uppercase text-white tracking-wider">Message Sent</h4>
                      <p className="text-[10px] text-neutral-400 max-w-[200px]">
                        Thank you for reaching out. An administrator will review your message shortly!
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-strikers-muted flex items-center gap-1">
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
                        <label className="text-[9px] uppercase font-bold text-strikers-muted flex items-center gap-1">
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
                        <label className="text-[9px] uppercase font-bold text-strikers-muted flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> Message Body *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white resize-none"
                          placeholder="Write your inquiry or feedback here..."
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_10px_35px_rgba(255,255,255,0.25)] hover:bg-neutral-200 transition-all cursor-pointer border border-white/10 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -95, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 95, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
