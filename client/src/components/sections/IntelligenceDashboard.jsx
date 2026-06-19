import React from 'react';
import { Link } from 'react-router-dom';

const mockData = {
  flagship: {
    title: "The Great Wealth Migration: Where Ultra-High-Net-Worth Capital is Flowing in 2026",
    category: "Macro Strategy",
    description: "An exclusive analysis of the unprecedented shifting of global capital. Discover why traditional safe havens are losing their allure, and which emerging jurisdictions are successfully attracting the next generation of institutional and private wealth.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    date: "June 10, 2026",
    readTime: "12 min read",
    author: "Editorial Desk"
  },
  trending: [
    { title: "Structuring Family Offices in Singapore vs. Dubai", category: "Jurisdictional Analysis" },
    { title: "Navigating the New EU Corporate Tax Directives", category: "Taxation" },
    { title: "The Resurgence of the Cook Islands Trust", category: "Asset Protection" }
  ],
  regulatory: [
    { title: "SEC Proposes New Disclosure Rules for Offshore Entities", date: "2 hours ago", impact: "High" },
    { title: "Monetary Authority of Singapore Updates VCC Framework", date: "5 hours ago", impact: "Medium" },
    { title: "UK Treasury Outlines Overhaul of Non-Dom Tax Regime", date: "12 hours ago", impact: "High" }
  ],
  mostRead: [
    { title: "The Ultimate Guide to Second Citizenships for Tax Efficiency", reads: "12.4k" },
    { title: "Protecting Intellectual Property in the AI Era", reads: "10.8k" },
    { title: "Corporate Inversions: Strategies and Risks", reads: "9.2k" },
    { title: "Decentralized Autonomous Organizations (DAOs) as Holding Companies", reads: "8.5k" }
  ],
  editorsPicks: [
    { title: "The Future of Swiss Banking Secrecy", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=300", category: "Banking" },
    { title: "Structuring Cross-Border M&A in 2026", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300", category: "Corporate" },
    { title: "Navigating Sanctions and Compliance Constraints", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300", category: "Legal" }
  ],
  topics: [
    "Corporate Structuring", "Tax Optimization", "Asset Protection", "Intellectual Property", "Global Real Estate", "Venture Capital", "Compliance"
  ]
};

const IntelligenceDashboard = () => {
  return (
    <section className="py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 border-b border-outline-variant pb-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-primary text-[12px] font-bold uppercase tracking-[0.2em]">Intelligence Hub</span>
            </div>
            <h2 className="font-display-xl text-[48px] font-bold text-on-surface tracking-tight leading-none">
              Strategic Discovery.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ================= LEFT COLUMN (66%) ================= */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Flagship Story */}
            <Link to="/resources" className="group block relative rounded-2xl overflow-hidden bg-surface-container border border-outline-variant hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-md">
              <div className="h-[480px] w-full relative overflow-hidden">
                <img 
                  src={mockData.flagship.image} 
                  alt="Flagship Report" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
              </div>
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end z-10 w-full">
                <div className="mb-auto">
                   <span className="text-primary text-[11px] font-bold uppercase tracking-widest border border-primary/30 bg-primary/10 px-3 py-1 rounded-sm backdrop-blur-sm">
                    {mockData.flagship.category}
                  </span>
                </div>
                
                <h3 className="font-display-xl text-[36px] md:text-[48px] font-bold text-white leading-[1.1] mb-6 group-hover:text-primary transition-colors max-w-4xl">
                  {mockData.flagship.title}
                </h3>
                
                <p className="text-white/80 text-[16px] leading-relaxed mb-8 max-w-3xl">
                  {mockData.flagship.description}
                </p>
                
                <div className="flex items-center gap-6 text-white/60 text-[12px] font-medium border-t border-white/15 pt-6">
                  <span className="text-white font-bold">{mockData.flagship.author}</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {mockData.flagship.date}</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">schedule</span> {mockData.flagship.readTime}</span>
                </div>
              </div>
            </Link>

            {/* Secondary Row (Trending & Regulatory) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Trending This Week */}
              <div className="flex flex-col">
                <h4 className="font-bold text-[14px] text-on-surface uppercase tracking-[0.15em] border-b border-outline-variant pb-4 mb-6">
                  Trending This Week
                </h4>
                <div className="flex flex-col gap-4">
                  {mockData.trending.map((item, i) => (
                    <Link key={i} to="/resources" className="group bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:border-primary/50 transition-all shadow-sm h-[130px] flex flex-col justify-center">
                      <span className="text-primary text-[10px] font-bold uppercase tracking-widest block mb-3">
                        {item.category}
                      </span>
                      <h5 className="font-bold text-[16px] text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h5>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Regulatory Updates */}
              <div className="flex flex-col">
                <h4 className="font-bold text-[14px] text-on-surface uppercase tracking-[0.15em] border-b border-outline-variant pb-4 mb-6">
                  Regulatory Updates
                </h4>
                <div className="flex flex-col gap-4">
                  {mockData.regulatory.map((item, i) => (
                    <Link key={i} to="/resources" className="group bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:border-primary/50 transition-all shadow-sm h-[130px] flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-secondary text-[10px] font-bold uppercase tracking-widest">{item.date}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${item.impact === 'High' ? 'bg-red-900/10 text-red-600 border border-red-900/20' : 'bg-primary/10 text-primary border border-primary/25'}`}>
                          {item.impact} Impact
                        </span>
                      </div>
                      <h5 className="font-bold text-[16px] text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h5>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Popular Research Topics (Moved here) */}
            <div>
              <h4 className="font-bold text-[14px] text-on-surface uppercase tracking-[0.15em] border-b border-outline-variant pb-4 mb-6">
                Popular Research Topics
              </h4>
              <div className="flex flex-wrap gap-3">
                {mockData.topics.map((topic, i) => (
                  <Link key={i} to="/resources" className="px-5 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-full text-on-surface text-[13px] font-bold hover:bg-primary hover:border-primary hover:text-white transition-colors shadow-sm">
                    {topic}
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN (33%) ================= */}
          <div className="lg:col-span-4 flex flex-col gap-12 lg:border-l border-outline-variant lg:pl-12">
            
            {/* Most Read Reports */}
            <div>
              <h4 className="font-bold text-[14px] text-on-surface uppercase tracking-[0.15em] border-b border-outline-variant pb-4 mb-6">
                Most Read Reports
              </h4>
              <ol className="flex flex-col gap-4 list-none p-0 m-0">
                {mockData.mostRead.map((item, i) => (
                  <li key={i}>
                    <Link to="/resources" className="group bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:border-primary/50 transition-all shadow-sm flex items-center gap-6 min-h-[110px]">
                      <div className="w-12 shrink-0 flex justify-center">
                        <span className="text-primary font-display-xl text-[28px] font-bold leading-none opacity-80 group-hover:opacity-100 transition-opacity">
                          0{i + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-[15px] text-on-surface leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h5>
                        <span className="text-secondary text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">visibility</span> {item.reads} Readers
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {/* Editor's Picks */}
            <div>
              <h4 className="font-bold text-[14px] text-on-surface uppercase tracking-[0.15em] border-b border-outline-variant pb-4 mb-6">
                Editor's Picks
              </h4>
              <div className="flex flex-col gap-4">
                {mockData.editorsPicks.map((item, i) => (
                  <Link key={i} to="/resources" className="group flex items-center gap-6 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:border-primary/50 transition-all shadow-sm">
                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                        {item.category}
                      </span>
                      <h5 className="font-bold text-[15px] text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h5>
                    </div>
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

export default IntelligenceDashboard;
