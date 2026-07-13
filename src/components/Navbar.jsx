import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AdminContext } from '../features/admin/AdminContext';
import { Menu, X, Users, ShoppingBag, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { navLinksState } = useContext(AdminContext);

  const baseLinks = [
    { name: 'Home', path: '/' },
  ];

  const visibleNavLinks = (navLinksState || [])
    .filter(link => link.visible && link.name !== 'Tournaments' && link.name !== 'Studios' && link.name !== 'IGQ Calculator')
    .map(link => {
      let icon = ShoppingBag;
      if (link.name === 'About') icon = Shield;
      if (link.name === 'Teams') icon = Users;
      if (link.name === 'Shop') icon = ShoppingBag;
      return { name: link.name, path: link.path, icon };
    });

  const navLinks = [
    ...baseLinks,
    ...visibleNavLinks,
  ];

  const isActive = (path) => location.pathname === path;


  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-strikers-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img src="/logo.png?v=3" alt="Strikers Logo" className="w-9 h-9 object-contain rounded-md" />
          <span className="font-bold tracking-widest text-lg uppercase text-white group-hover:text-gray-300 transition-colors">
            Strikers <span className="font-light text-gray-400">Esports</span>
          </span>
        </Link>


        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 py-2 transition-all duration-300 relative group cursor-pointer ${
                  isActive(link.path) ? 'text-white' : 'text-strikers-muted hover:text-white'
                }`}
              >
                {isActive(link.path) && <span className="w-1.5 h-1.5 bg-white rounded-full inline-block" />}
                {link.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-strikers-muted hover:text-white transition-colors focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-20 left-0 w-full bg-black/95 border-b border-strikers-border py-6 px-6 space-y-4 flex flex-col overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-sm uppercase tracking-wider font-semibold py-2 block ${
                  isActive(link.path) ? 'text-white border-l-2 border-white pl-3' : 'text-strikers-muted hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
