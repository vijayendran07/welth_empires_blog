import React from 'react';
import { motion } from 'framer-motion';

const experts = [
  { name: 'Dr. Evelyn Cross', title: 'Director of Global Tax Strategy', articles: 142, exp: '20+ Yrs', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
  { name: 'Marcus Sterling', title: 'Head of Offshore Structuring', articles: 89, exp: '15 Yrs', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' },
  { name: 'Sarah Chen', title: 'Chief Compliance Officer', articles: 115, exp: '18 Yrs', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
  { name: 'Julian Vane', title: 'Wealth Preservation Architect', articles: 204, exp: '25 Yrs', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
];

const ExpertNetwork = () => {
  return (
    <section className="bg-surface-container-low py-24 border-y border-outline-variant/30">
      <div className="max-w-max-container mx-auto px-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary text-[12px] font-bold uppercase tracking-[0.2em] mb-4 block">Author & Expert Network</span>
            <h2 className="font-headline-md text-[40px] font-bold text-on-surface tracking-tight leading-tight">Unrivaled Expertise.</h2>
          </div>
          <button className="text-on-surface font-bold text-[14px] hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest bg-surface-container border border-outline-variant/50 px-6 py-3 rounded-full hover:border-primary/50 shadow-sm">
            View All Experts <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {experts.map((expert, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-surface rounded-3xl p-6 border border-outline-variant/40 hover:border-primary/50 hover:shadow-lg transition-all text-center flex flex-col items-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-surface-container-highest shadow-md relative">
                <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 rounded-full border border-primary/20"></div>
              </div>
              
              <h3 className="font-bold text-[20px] text-on-surface mb-1 group-hover:text-primary transition-colors">{expert.name}</h3>
              <p className="text-[13px] text-secondary font-medium mb-6">{expert.title}</p>
              
              <div className="w-full flex justify-between items-center border-t border-outline-variant/30 pt-4 mt-auto">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-0.5">Published</p>
                  <p className="text-[14px] font-bold text-on-surface">{expert.articles}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-0.5">Experience</p>
                  <p className="text-[14px] font-bold text-on-surface">{expert.exp}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertNetwork;
