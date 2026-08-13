import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface InitialVideoLoaderProps {
  onComplete?: () => void;
}

export const InitialVideoLoader: React.FC<InitialVideoLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing OneHost Cloud AI...');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only play loader on initial page load per session if needed, or every reload
    const textIntervals = [
      { p: 20, text: 'Loading AI Website Builder Core...' },
      { p: 50, text: 'Connecting High-Speed Cloud Servers...' },
      { p: 80, text: 'Securing SSL & Subdomain Routing...' },
      { p: 100, text: 'Welcome to OneHost Cloud!' },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }

        const next = prev + 2;
        const currentTextObj = textIntervals.find((t) => next >= t.p);
        if (currentTextObj) {
          setLoadingText(currentTextObj.text);
        }
        return next;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center overflow-hidden select-none"
        >
          {/* BACKGROUND AMBIENT GLOW & SMOKE EFFECTS */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/90 via-black to-black opacity-95" />
          
          {/* BACKGROUND VIDEO ANIMATION LAYER */}
          <div className="absolute inset-0 flex items-center justify-center opacity-60 pointer-events-none">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover max-w-2xl filter brightness-110 contrast-125"
              src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-nodes-mesh-41559-large.mp4"
            />
          </div>

          {/* 3D GLOWING GLASS CUBE LOADER ANIMATION (MATCHING UPLOADED VIDEO) */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4">
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-8">
              
              {/* SMOKE & PARTICLE BURST RINGS */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-500/30 to-amber-500/20 blur-2xl animate-pulse" />
              
              {/* OUTER ROTATING PRISM FRAME */}
              <motion.div
                animate={{ rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="w-36 h-36 md:w-48 md:h-48 border-2 border-slate-300/50 rounded-3xl backdrop-blur-md bg-white/10 shadow-[0_0_60px_rgba(255,255,255,0.2)] flex items-center justify-center transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* INNER DIAMOND TRIANGLE CORE */}
                <motion.div
                  animate={{ rotate: [0, -360], scale: [0.85, 1.1, 0.85] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-24 h-24 md:w-32 md:h-32 border-2 border-cyan-400/90 rounded-2xl bg-gradient-to-tr from-cyan-500/30 via-white/20 to-purple-500/40 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.6)]"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl transform rotate-45 flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,1)]">
                    <Zap className="w-8 h-8 text-slate-950 transform -rotate-45 fill-slate-950" />
                  </div>
                </motion.div>
              </motion.div>

              {/* LENS FLARE GLOW CORNERS */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-white rounded-full blur-[2px] shadow-[0_0_15px_#fff]" />
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-cyan-400 rounded-full blur-[2px] shadow-[0_0_15px_#06b6d4]" />
            </div>

            {/* BRAND TITLE & LOADING TEXT */}
            <div className="text-center space-y-3 max-w-sm w-full">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  ONE<span className="text-cyan-400">HOST</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black uppercase tracking-widest">
                  CLOUD AI
                </span>
              </div>

              <p className="text-xs text-slate-300 font-mono h-5 font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{loadingText}</span>
              </p>

              {/* HIGH PRECISION PROGRESS BAR */}
              <div className="w-full bg-slate-900/90 border border-slate-800 rounded-full h-2.5 p-0.5 shadow-inner relative overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono px-1">
                <span className="flex items-center gap-1 text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secure SSL & Cloud Active
                </span>
                <span className="font-bold text-cyan-400">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
