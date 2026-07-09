import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { AdminContext } from '../features/admin/AdminContext';

const YoutubeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer() {
  const { homepageSettings } = useContext(AdminContext);
  return (
    <footer className="bg-[#080808] border-t border-strikers-border py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png?v=3" alt="Strikers Logo" className="w-8 h-8 object-contain rounded-md" />
            <span className="font-bold tracking-widest text-base uppercase text-white">
              Strikers <span className="font-light text-gray-400">Esports</span>
            </span>
          </div>

          <p className="text-xs text-strikers-muted leading-relaxed">
            Strikers Esports delivers the game and the glory. Professional esports organisation, tournament organizer, and premium gaming merchandise.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs text-strikers-muted">
            <li>
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/team" className="hover:text-white transition-colors">Our Teams</Link>
            </li>
            <li>
              <Link to="/merch" className="hover:text-white transition-colors">Merchandise</Link>
            </li>
          </ul>
        </div>

        {/* Official Channels */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Follow Us</h4>
          <ul className="space-y-2 text-xs text-strikers-muted">
            <li className="flex items-center gap-2">
              <YoutubeIcon className="w-4 h-4 text-red-500" />
              <a href="https://youtube.com/@Str1kersEsports" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Strikers Esports Official
              </a>
            </li>
            <li className="flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 text-pink-500" />
              <a href="https://instagram.com/strikersesports.gg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                @strikersesports.gg
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <a href="https://discord.gg/GdHt36rJnG" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Discord Community
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Contact</h4>
          <p className="text-xs text-strikers-muted leading-relaxed">
            Email: {homepageSettings?.contactEmail || 'contact@strikersesports.in'}<br />
            Business: {homepageSettings?.businessEmail || 'info@strikersesports.in'}<br />
            {homepageSettings?.supportInfo || 'Support available 24/7.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-strikers-border text-center text-[10px] text-strikers-muted uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Strikers Esports. All Rights Reserved.
      </div>
    </footer>
  );
}
