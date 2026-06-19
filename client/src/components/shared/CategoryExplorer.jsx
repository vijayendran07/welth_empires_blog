import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categoryIcons = {
  'incorporation': 'domain',
  'compliance': 'fact_check',
  'trademark': 'copyright',
  'taxes': 'account_balance',
  'strategy': 'insights',
  'default': 'explore'
};

const CategoryExplorer = ({ categories }) => {
  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-8 py-16 editorial-divider border-outline-variant">
      <div className="flex flex-col items-center mb-12 text-center">
        <span className="text-primary text-[12px] font-bold uppercase tracking-[0.2em] mb-2 block">Category Explorer</span>
        <h2 className="font-headline-md text-[40px] font-bold text-on-surface tracking-tight">Navigate by Sector</h2>
        <p className="text-secondary mt-4 max-w-2xl text-[16px]">Select a jurisdiction or strategic vertical to access targeted intelligence reports and compliance frameworks.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Link to={`/category/${cat.slug}`} className="group relative bg-surface-container-lowest p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-primary transition-all duration-500 shadow-sm relative z-10">
                <span className="material-symbols-outlined text-[28px] text-white group-hover:text-primary transition-colors">
                  {categoryIcons[cat.slug] || categoryIcons.default}
                </span>
              </div>
              
              <h3 className="font-display-xl text-[24px] font-bold text-white mb-3 relative z-10">
                {cat.name}
              </h3>
              
              <p className="text-white/70 text-[14px] leading-relaxed mb-8 flex-1 relative z-10">
                {cat.description || `Explore expert guides, strategic analyses, and regulatory updates concerning global ${cat.name.toLowerCase()}.`}
              </p>
              
              <div className="flex items-center justify-between border-t border-white/10 pt-5 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  <span className="text-[12px] font-bold uppercase tracking-widest text-white">
                    {cat._count?.articles || Math.floor(Math.random() * 50) + 10} Reports
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary text-white transition-all transform group-hover:translate-x-1">
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryExplorer;
