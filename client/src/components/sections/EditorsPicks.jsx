import React from 'react';
import { Link } from 'react-router-dom';

const mockData = {
  featured: {
    title: "The Great Wealth Migration: Where Ultra-High-Net-Worth Capital is Flowing in 2026",
    category: "Featured Boardroom Briefing",
    summaryTime: "4 minute executive summary",
    commentary: "Capital allocation patterns are shifting toward tax-efficient jurisdictions with robust legal frameworks. Failure to understand these new corridors risks exposing family offices to aggressive wealth taxation and compliance friction in legacy markets.",
    link: "/resources",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"
  },
  highlights: [
    { title: "Singapore VCC Adoption Rising Among Asian Family Offices", category: "Jurisdictional Shift", readTime: "2 min read" },
    { title: "UAE Corporate Tax Adjustments Spark New Restructuring Wave", category: "Regulatory Update", readTime: "3 min read" },
    { title: "New Trademark Holding Structures for Digital Assets", category: "Intellectual Property", readTime: "5 min read" },
    { title: "The Demise of the Non-Dom: What UK Residents Are Doing Now", category: "Wealth Preservation", readTime: "4 min read" }
  ]
};

const BoardroomBriefings = () => {
  return (
    <section className="py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 border-b border-outline-variant pb-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-primary text-[12px] font-bold uppercase tracking-[0.2em]">Curated Intelligence</span>
            </div>
            <h2 className="font-display-xl text-[48px] font-bold text-on-surface tracking-tight leading-none">
              Boardroom Briefings.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT COLUMN: Featured Briefing */}
          <div className="lg:col-span-8 flex">
            <Link to={mockData.featured.link} className="group w-full min-h-[550px] md:min-h-[600px] rounded-2xl border border-outline-variant overflow-hidden relative flex flex-col justify-end hover:border-primary/50 transition-all duration-300 shadow-xl">
              
              {/* Background Image */}
              <img 
                src={mockData.featured.image} 
                alt={mockData.featured.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10"></div>

              {/* Content overlay */}
              <div className="p-8 md:p-14 relative z-20 flex flex-col justify-end h-full text-white">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/5">
                  <div className="w-10 h-10 rounded-sm bg-primary/20 flex items-center justify-center border border-primary/45 shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[14px] text-white uppercase tracking-widest leading-none">Wealth Empires Research Council</h4>
                    <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mt-1.5 leading-none">Advisory Panel</p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-[0.15em] border border-primary/35 bg-primary/15 px-3 py-1.5 rounded-sm">
                    {mockData.featured.category}
                  </span>
                </div>
                
                <h3 className="font-display-xl text-[28px] md:text-[38px] font-bold text-white leading-[1.15] mb-4 group-hover:text-white/95 transition-colors max-w-4xl">
                  {mockData.featured.title}
                </h3>
                
                <div className="flex items-center gap-2 text-white/60 text-[12px] font-medium mb-8">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {mockData.featured.summaryTime}
                </div>

                {/* Why It Matters Panel */}
                <div className="border-l-4 border-primary pl-6 py-3 bg-black/40 backdrop-blur-md rounded-r-lg border border-white/5 border-l-0">
                  <h5 className="font-bold text-[12px] text-white uppercase tracking-widest mb-2">
                    Why this matters
                  </h5>
                  <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed max-w-3xl font-interface-body font-light">
                    {mockData.featured.commentary}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[12px] group-hover:translate-x-2 transition-transform">
                  Read Full Analysis <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </Link>
          </div>

          {/* RIGHT COLUMN: Executive Highlights */}
          <div className="lg:col-span-4 flex">
            <div className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 md:p-12 shadow-sm flex flex-col">
              
              <h4 className="font-bold text-[14px] text-on-surface uppercase tracking-[0.15em] border-b border-outline-variant pb-6 mb-2">
                Executive Highlights
              </h4>

              <div className="flex flex-col flex-1">
                {mockData.highlights.map((item, i) => (
                  <Link key={i} to="/resources" className="group py-6 border-b border-outline-variant last:border-0 flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-primary font-display-xl text-[24px] font-bold leading-none opacity-80 group-hover:opacity-100 transition-opacity">
                        0{i + 1}
                      </span>
                      <span className="text-secondary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">schedule</span> {item.readTime}
                      </span>
                    </div>
                    
                    <span className="text-primary text-[9px] font-bold uppercase tracking-widest mb-2 block">
                      {item.category}
                    </span>
                    
                    <h5 className="text-[17px] text-on-surface leading-snug group-hover:text-primary transition-colors pr-4 font-display-xl font-bold">
                      {item.title}
                    </h5>
                  </Link>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BoardroomBriefings;
