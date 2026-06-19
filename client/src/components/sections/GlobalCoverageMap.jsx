import React, { useState } from 'react';
import { motion } from 'framer-motion';

const hubs = [
  { id: 'us', name: 'USA', articles: 215, guides: 28, x: 23, y: 35 },
  { id: 'uk', name: 'United Kingdom', articles: 156, guides: 22, x: 47, y: 25 },
  { id: 'dxb', name: 'Dubai', articles: 98, guides: 12, x: 63, y: 43 },
  { id: 'in', name: 'India', articles: 84, guides: 8, x: 71, y: 45 },
  { id: 'sg', name: 'Singapore', articles: 124, guides: 15, x: 77, y: 55 },
  { id: 'hk', name: 'Hong Kong', articles: 112, guides: 18, x: 81, y: 44 },
];

const connections = [
  { from: 'us', to: 'uk' },
  { from: 'uk', to: 'dxb' },
  { from: 'dxb', to: 'in' },
  { from: 'dxb', to: 'sg' },
  { from: 'in', to: 'hk' },
  { from: 'sg', to: 'hk' },
];

const GlobalCoverageMap = ({ compact = false }) => {
  const [activeHub, setActiveHub] = useState(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateYValue = ((x - centerX) / centerX) * 5; // Max 5 deg tilt
    const rotateXValue = -((y - centerY) / centerY) * 5; 
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <section className="bg-surface-container-low py-10 border-y border-outline-variant/30 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="max-w-[1600px] mx-auto px-gutter relative z-10">
        <div className="text-center mb-8">
          <span className="text-primary text-[12px] font-bold uppercase tracking-[0.3em] mb-2 block">Global Coverage</span>
          <h2 className="font-display-xl text-[36px] md:text-[48px] font-bold text-on-surface tracking-tight mb-4">Worldwide Intelligence.</h2>
          <p className="text-secondary text-[16px] max-w-2xl mx-auto leading-relaxed">
            Proprietary research and regulatory frameworks spanning the world's most critical wealth jurisdictions.
          </p>
        </div>

        <motion.div 
          className="relative w-full max-w-5xl mx-auto aspect-[1.8] sm:aspect-[2] rounded-3xl border border-white/10 bg-black overflow-visible shadow-2xl pointer-events-auto flex items-center justify-center"
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* CSS Animation for SVG lines */}
        <style>{`
          @keyframes dash-flow {
            to { stroke-dashoffset: -20; }
          }
          .animate-dash-flow {
            animation: dash-flow 1s linear infinite;
          }
        `}</style>

        {/* World Map Background */}
        <img 
          src="/world-map-outline.svg" 
          alt="World Map" 
          className="absolute inset-0 w-[90%] h-[90%] m-auto object-contain opacity-100 pointer-events-none select-none" 
          style={{ transform: 'translateZ(10px)', filter: 'drop-shadow(0 0 8px rgba(110,168,254,0.4))' }}
        />
        
        {/* Title Overlay */}
        <div className="absolute top-6 w-full text-center pointer-events-none z-10" style={{ transform: 'translateZ(30px)' }}>
          <span className="font-display-xl text-[16px] md:text-[20px] font-bold text-white tracking-tight uppercase tracking-[0.2em] drop-shadow-md">Global Intelligence Network</span>
        </div>

        {/* Network Lines */}
        <svg className="absolute inset-0 w-[90%] h-[90%] m-auto pointer-events-none z-0 overflow-visible" style={{ transform: 'translateZ(15px)' }}>
          {connections.map((conn, i) => {
            const fromHub = hubs.find(h => h.id === conn.from);
            const toHub = hubs.find(h => h.id === conn.to);
            const isActive = activeHub === fromHub.id || activeHub === toHub.id;
            
            return (
              <line
                key={i}
                x1={`${fromHub.x}%`} y1={`${fromHub.y}%`}
                x2={`${toHub.x}%`} y2={`${toHub.y}%`}
                stroke={isActive ? "rgba(110, 168, 254, 0.8)" : "rgba(110, 168, 254, 0.15)"}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className={`transition-all duration-500 ${isActive ? 'animate-dash-flow' : ''}`}
              />
            );
          })}
        </svg>

        {/* Map Nodes */}
        <div className="absolute inset-0 w-[90%] h-[90%] m-auto" style={{ transform: 'translateZ(20px)' }}>
          {hubs.map((hub) => (
            <div 
              key={hub.id}
              className="absolute"
              style={{ left: `${hub.x}%`, top: `${hub.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setActiveHub(hub.id)}
              onMouseLeave={() => setActiveHub(null)}
            >
              {/* Ping Animation */}
              <div className={`absolute inset-0 -m-3 bg-[#6EA8FE]/40 rounded-full animate-ping opacity-75 ${activeHub === hub.id ? 'scale-150' : ''} transition-transform`}></div>
              
              {/* Dot */}
              <div className={`relative w-2.5 h-2.5 bg-[#6EA8FE] rounded-full border-[1.5px] border-black cursor-pointer z-10 transition-all duration-300 ${activeHub === hub.id ? 'scale-150 shadow-[0_0_15px_rgba(110,168,254,0.8)]' : 'shadow-[0_0_8px_rgba(110,168,254,0.4)] hover:scale-125'}`}></div>

              {/* Hover Tooltip Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ 
                  opacity: activeHub === hub.id ? 1 : 0, 
                  y: activeHub === hub.id ? -12 : 10,
                  scale: activeHub === hub.id ? 1 : 0.95
                }}
                transition={{ duration: 0.2 }}
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-[#0A0F1F]/95 backdrop-blur-xl border border-white/20 p-3 rounded-lg shadow-2xl pointer-events-none ${activeHub === hub.id ? 'z-50' : 'z-0'}`}
              >
                <h4 className="text-white font-bold text-[14px] mb-2 leading-none border-b border-white/20 pb-2">{hub.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-white/60 text-[10px] uppercase tracking-widest font-medium">Articles</span>
                  <span className="text-[#6EA8FE] font-bold text-[12px]">{hub.articles}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-white/60 text-[10px] uppercase tracking-widest font-medium">Guides</span>
                  <span className="text-white font-bold text-[12px]">{hub.guides}</span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
        </motion.div>

        {/* Footer Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto">
          {[
            { label: 'Global Hubs', value: '6+' },
            { label: 'Active Researchers', value: '120' },
            { label: 'Policy Updates/Wk', value: '45' },
            { label: 'Data Points Analyzed', value: '2.5M' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 border-l border-outline-variant/30 first:border-l-0">
              <p className="font-display-xl text-[32px] font-bold text-on-surface mb-1">{stat.value}</p>
              <p className="text-[10px] text-secondary uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalCoverageMap;
