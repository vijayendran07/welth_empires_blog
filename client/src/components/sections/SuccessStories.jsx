import React from 'react';
import { motion } from 'framer-motion';

const stories = [
  {
    client: 'FinTech Unicorn',
    challenge: 'Navigating post-IPO global tax structuring across 15+ jurisdictions.',
    strategy: 'Implemented our tiered holding company framework outlined in the Global Tax Playbook.',
    outcome: '$45M annual tax optimization and zero compliance breaches.'
  },
  {
    client: 'Family Office',
    challenge: 'Generational wealth transfer and asset protection from political instability.',
    strategy: 'Established a Cook Islands Trust linked to a Singapore VCC.',
    outcome: '100% asset preservation and smooth generational transition.'
  },
  {
    client: 'E-commerce Brand',
    challenge: 'Cross-border trademark infringement and revenue leakage.',
    strategy: 'Deployed international IP registration protocol from our Trademark Guide.',
    outcome: 'Recovered $2M in lost revenue and secured brand across 40 countries.'
  }
];

const SuccessStories = () => {
  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-8 py-24 editorial-divider border-outline-variant">
      <div className="text-center mb-16">
        <span className="text-primary text-[12px] font-bold uppercase tracking-[0.2em] mb-4 block">Case Studies</span>
        <h2 className="font-headline-md text-[40px] font-bold text-on-surface tracking-tight">Intelligence Applied.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group p-8 rounded-3xl border border-outline-variant hover:border-primary/50 transition-all flex flex-col h-full bg-surface-container-lowest shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/25 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
            </div>
            
            <h3 className="font-bold text-[20px] text-on-surface mb-6 border-b border-outline-variant pb-4">{story.client}</h3>
            
            <div className="flex flex-col gap-6 flex-1">
              <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">The Challenge</p>
                <p className="text-[14px] text-on-surface-variant leading-relaxed">{story.challenge}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">The Strategy</p>
                <p className="text-[14px] text-on-surface-variant leading-relaxed">{story.strategy}</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-outline-variant">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">The Outcome</p>
              <p className="text-[16px] font-bold text-on-surface">{story.outcome}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SuccessStories;
