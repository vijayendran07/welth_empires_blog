import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const reports = [
  { 
    id: 1, 
    title: 'The Great Wealth Migration: Where Ultra-High-Net-Worth Capital is Flowing in 2026', 
    type: 'Featured Research', 
    category: 'Macro Strategy',
    pages: 124, 
    date: 'June 10, 2026',
    format: 'PDF / EPUB',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    description: 'An exclusive analysis of the unprecedented shifting of global capital. Discover why traditional safe havens are losing their allure, and which emerging jurisdictions are successfully attracting the next generation of institutional and private wealth.',
    author: 'Editorial Desk',
    readTime: '12 min read'
  },
  { 
    id: 2, 
    title: 'Singapore Incorporation Guide', 
    type: 'Most Downloaded', 
    category: 'Corporate Structuring',
    pages: 86, 
    date: 'May 2026',
    format: 'PDF',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=1200',
    description: 'The ultimate playbook for establishing a holding company in Asia\'s premier financial hub, featuring step-by-step compliance requirements and banking introductions.'
  },
  { 
    id: 3, 
    title: 'International Trademark Handbook', 
    type: "Editor's Pick", 
    category: 'IP Protection',
    pages: 210, 
    date: 'April 2026',
    format: 'PDF / EPUB',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=1200',
    description: 'Protect your brand sovereignty. A multi-jurisdictional guide to securing intellectual property rights across the US, EU, and key global markets.'
  },
  { 
    id: 4, 
    title: 'Wealth Preservation Playbook', 
    type: 'Recently Updated', 
    category: 'Asset Management',
    pages: 150, 
    date: 'June 2026',
    format: 'PDF',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200',
    description: 'Institutional-grade strategies for high-net-worth individuals to shield capital from market volatility, inflation, and unpredictable geopolitical risks.'
  }
];

const FeaturedReports = () => {
  const primary = reports[0];
  const secondary = reports.slice(1);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-8 py-24 editorial-divider border-outline-variant">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div className="max-w-2xl">
          <span className="text-primary text-[12px] font-bold uppercase tracking-[0.2em] mb-4 block flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Research Center
          </span>
          <h2 className="font-headline-md text-[40px] md:text-[48px] font-bold text-on-surface tracking-tight leading-tight">
            Featured Reports & Monographs.
          </h2>
        </div>
        <Link to="/resources" className="text-on-surface font-bold text-[13px] hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest border-b border-outline-variant hover:border-primary pb-1 group">
          Access the Vault <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </Link>
      </div>
      <div className="w-full h-[1px] bg-outline-variant/60 mb-12"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        
        {/* Left Column: Primary Report */}
        <motion.div variants={itemVariants} className="lg:col-span-7 h-full">
          <Link to="/resources" className="group block h-full min-h-[500px] md:min-h-[600px] rounded-2xl border border-outline-variant hover:border-primary/50 transition-all duration-300 shadow-xl overflow-hidden relative flex flex-col justify-end">
            
            {/* Background Image */}
            <img 
              src={primary.image} 
              alt={primary.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
            />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

            {/* Premium Badge Corner */}
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm shadow-md">
                Premium Research
              </div>
            </div>

            {/* Content overlay */}
            <div className="p-8 md:p-12 relative z-20 flex flex-col justify-end h-full">
              <div className="mb-6">
                <span className="text-primary text-[10px] font-bold uppercase tracking-[0.15em] border border-primary/35 bg-primary/15 px-3 py-1.5 rounded-sm">
                  {primary.category}
                </span>
              </div>
              
              <h3 className="text-white font-display-xl text-[28px] md:text-[40px] font-bold leading-[1.15] mb-6 group-hover:text-white/95 transition-colors">
                {primary.title}
              </h3>
              
              <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed mb-8 max-w-2xl font-light">
                {primary.description}
              </p>

              {/* Horizontal divider line */}
              <div className="w-full h-[1px] bg-white/15 mb-6"></div>

              <div className="flex flex-wrap items-center gap-6 text-[12px] text-white/60">
                <span className="font-bold text-white uppercase tracking-wider">{primary.author || 'Editorial Desk'}</span>
                
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  {primary.date}
                </span>
                
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {primary.readTime || '12 min read'}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Right Column: Secondary Reports Stack */}
        <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6">
          {secondary.map((report) => (
            <Link key={report.id} to="/resources" className="group flex flex-col sm:flex-row gap-6 bg-surface-container-lowest rounded-2xl border border-outline-variant hover:border-primary/50 transition-colors p-5 shadow-sm relative overflow-hidden">
              
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="w-full sm:w-[140px] h-[180px] sm:h-auto rounded-xl overflow-hidden shrink-0 border border-outline-variant relative">
                <img 
                  src={report.image} 
                  alt={report.title} 
                  className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700 ease-out"
                />
              </div>
              
              <div className="flex flex-col py-1 justify-center relative z-10 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-primary text-[9px] font-bold uppercase tracking-widest">
                    {report.type}
                  </span>
                </div>
                
                <h4 className="text-on-surface font-bold text-[20px] leading-snug mb-3 group-hover:text-primary transition-colors">
                  {report.title}
                </h4>
                
                <p className="text-on-surface-variant text-[13px] line-clamp-2 leading-relaxed mb-4">
                  {report.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-secondary text-[11px] font-medium uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                      {report.pages} Pages
                    </span>
                    <span className="flex items-center gap-1.5 text-secondary text-[11px] font-medium uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                      {report.format}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">
                    download
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
};

export default FeaturedReports;
