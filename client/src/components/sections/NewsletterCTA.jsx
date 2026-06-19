import React, { useState } from 'react';

const NewsletterCTA = ({ minimal = false }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-3xl text-center shadow-sm max-w-[1440px] mx-auto">
        <span className="material-symbols-outlined text-[36px] text-green-600 mb-2">check_circle</span>
        <h4 className="font-bold text-[18px] mb-1">Subscription Confirmed!</h4>
        <p className="text-[14px] text-green-700/95 font-medium">Thank you for joining the Wealth Empires newsletter.</p>
      </div>
    );
  }

  if (minimal) {
    return (
      <div className="bg-[#0052cc] text-white p-8 rounded-3xl shadow-sm">
        <h4 className="font-display-xl text-[22px] font-bold mb-2">Join the Elite</h4>
        <p className="text-[13px] text-white/80 mb-5 leading-relaxed font-normal">
          Get exclusive intelligence delivered straight to your inbox weekly.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            placeholder="Your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 rounded-xl text-[13px] transition-all"
            required
          />
          <button 
            type="submit" 
            className="bg-white text-[#0052cc] hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold text-[13px] transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    );
  }

  return (
    <section className="w-full py-16 bg-white border-y border-gray-150">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#0052cc] mb-4 block">Newsletter</span>
          <h2 className="font-display-xl text-[36px] lg:text-[48px] font-bold text-gray-900 leading-tight mb-6 tracking-tight">
            Intelligence that <span className="text-[#0052cc] italic font-normal">defines</span> empires
          </h2>
          <p className="text-[14px] md:text-[15px] text-gray-500 max-w-lg mb-8 font-normal leading-relaxed">
            Join 50,000+ executives receiving our curated weekly dispatch on wealth preservation, global markets, and strategic acquisitions.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md">
            <input 
              type="email" 
              placeholder="Enter your professional email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 focus:border-[#0052cc] focus:bg-white focus:outline-none rounded-xl transition-all font-interface-body text-[14px] text-gray-900"
              required
            />
            <button 
              type="submit" 
              className="bg-[#0052cc] hover:bg-[#0040a3] text-white px-8 py-3.5 rounded-xl font-bold text-[14px] hover:shadow-md transition-all duration-200 whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
          <p className="text-[11px] text-gray-400 mt-4 font-normal">
            By subscribing, you agree to our Terms of Service and Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
        
        <div className="w-full md:w-1/2 relative">
          <div className="absolute inset-0 bg-blue-50/40 rounded-3xl -rotate-3 scale-105"></div>
          <div className="bg-white p-8 rounded-3xl border border-gray-150 shadow-sm relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0052cc]">
                <span className="material-symbols-outlined text-[22px] font-bold">mail</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 font-display-xl text-[16px]">The Sunday Dispatch</h4>
                <p className="text-gray-400 text-[12px] font-medium">Preview of our latest edition</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[13.5px] text-gray-700 leading-relaxed font-medium">
                In this week's edition, we explore the shifting landscape of European corporate tax directives and what it means for your international holding structures.
              </p>
              <p className="text-[13.5px] text-gray-500 leading-relaxed">
                Plus, an exclusive interview with leading compliance directors on the resurgence and future viability of the Cook Islands Trust in 2026.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-[12px] text-gray-400">
              <span>Read time: 5 minutes</span>
              <span className="flex items-center gap-1 font-bold text-[#0052cc] hover:underline cursor-pointer">
                Read preview <span className="material-symbols-outlined text-[16px] font-bold">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
