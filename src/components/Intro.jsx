import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Intro({ onComplete }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if intro has already run in this session
    const hasRun = sessionStorage.getItem('strikers_intro_run') === 'true';
    if (hasRun) {
      setShow(false);
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('strikers_intro_run', 'true');
      if (onComplete) onComplete();
    }, 3200); // Animation takes 3.2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 bg-black z-[9999] flex items-center justify-center overflow-hidden pointer-events-none"
        >
          {/* Sliced Logo Container */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            
            {/* Top-Left Half */}
            <motion.div
              initial={{ x: -180, y: -180, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              exit={{ x: -220, y: -220, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              }}
            >
              <img src="/logo_transparent.png" alt="Strikers TL Slice" className="w-48 h-48 object-contain" />
            </motion.div>

            {/* Bottom-Right Half */}
            <motion.div
              initial={{ x: 180, y: 180, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              exit={{ x: 220, y: 220, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              }}
            >
              <img src="/logo_transparent.png" alt="Strikers BR Slice" className="w-48 h-48 object-contain" />
            </motion.div>

            {/* Diagonal Slash Slice Effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              animate={{ 
                scale: [0, 1.2, 0], 
                opacity: [0, 1, 0], 
                x: [-160, 0, 160], 
                y: [160, 0, -160] 
              }}
              transition={{ 
                duration: 0.9, 
                delay: 1.2, 
                ease: 'easeInOut' 
              }}
              className="absolute w-2.5 h-[340px] bg-white shadow-[0_0_20px_rgba(255,255,255,1),0_0_40px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
              style={{ transform: 'rotate(-45deg)' }}
            />

            {/* Lens Flare Flash */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.8, 0.6] }}
              transition={{ duration: 0.7, delay: 1.5, ease: 'easeOut' }}
              className="absolute w-80 h-80 rounded-full bg-white/20 blur-3xl z-10 pointer-events-none"
            />
          </div>

          {/* Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            exit={{ opacity: 0, y: -15 }}
            className="absolute bottom-16 text-[10px] uppercase tracking-[0.6em] font-black text-white"
          >
            FUELING VICTORIES
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
