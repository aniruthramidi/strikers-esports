import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Intro3D({ onComplete }) {
  const [stage, setStage] = useState('intro'); // intro -> shine -> exit -> complete

  useEffect(() => {
    // 1. Initial rotation and scale entrance: 2.0 seconds
    // 2. Sheen swipe: 2.0 to 3.0 seconds
    // 3. Zoom / Exit transition: 3.0 to 3.6 seconds
    const timers = [
      setTimeout(() => setStage('shine'), 2000),
      setTimeout(() => setStage('exit'), 3000),
      setTimeout(() => {
        setStage('complete');
        if (onComplete) onComplete();
      }, 3600)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (stage === 'complete') return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      {/* Cinematic Radial Glow Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1.2 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45)_0%,transparent_65%)] pointer-events-none"
      />

      {/* 3D Perspective Card Wrapper */}
      <div 
        className="relative w-80 h-80 flex items-center justify-center"
        style={{ perspective: 1000 }}
      >
        <AnimatePresence>
          {stage !== 'exit' && (
            <motion.div
              initial={{ 
                opacity: 0, 
                rotateY: -45, 
                rotateX: 15,
                scale: 0.6,
                y: 20
              }}
              animate={{ 
                opacity: 1, 
                rotateY: 0, 
                rotateX: 0,
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 2.2,
                rotateY: 10,
                rotateX: -10,
                filter: 'blur(10px)'
              }}
              transition={{ 
                duration: 1.8, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="relative w-64 h-64 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-neutral-950/90 backdrop-blur-md shadow-[0_0_60px_rgba(255,255,255,0.06)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Logo container */}
              <div 
                className="relative flex items-center justify-center w-full h-full"
                style={{ transform: 'translateZ(30px)' }}
              >
                <img
                  src="/logo_transparent.png"
                  alt="Strikers Logo"
                  className="w-44 h-44 object-contain select-none pointer-events-none"
                />
              </div>

              {/* Sheen Container (Separated to prevent WebKit overflow hidden bug on 3D layers) */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none z-20">
                {stage === 'shine' && (
                  <motion.div
                    initial={{ left: '-150%' }}
                    animate={{ left: '150%' }}
                    transition={{ duration: 0.85, ease: 'easeInOut' }}
                    className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-30"
                  />
                )}
              </div>

              {/* Highlight Border Reflection */}
              <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient background grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_90%)] opacity-25 pointer-events-none" />
    </div>
  );
}
