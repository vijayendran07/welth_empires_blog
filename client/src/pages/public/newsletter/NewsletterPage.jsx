import { useState } from 'react';

const NewsletterPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');
    }, 1500);
  };

  return (
    <div className="w-full bg-white pb-8 font-interface-body">
      {/* Subscription Hero */}
      <header className="relative bg-gray-50 text-gray-900 py-8 lg:py-12 overflow-hidden border-b border-gray-150">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2000')] opacity-5 mix-blend-overlay"></div>
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block border border-gray-200 bg-white/60 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#0052cc] mb-8 shadow-sm">
              The Sunday Dispatch
            </span>
            <h1 className="font-display-xl text-[40px] md:text-[56px] font-bold leading-tight tracking-tight mb-6 text-gray-950">
              The intelligence network for the <span className="text-[#0052cc] italic font-normal">elite</span>.
            </h1>
            <p className="text-[16px] md:text-[18px] text-gray-500 mb-10 max-w-lg leading-relaxed font-normal">
              Join 50,000+ executives, founders, and investors receiving our exclusive weekly briefing on global wealth preservation.
            </p>

            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 p-6 rounded-2xl flex items-center gap-4 max-w-xl">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px]">check</span>
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-green-900">Welcome to the inner circle.</h3>
                  <p className="text-[13px] text-green-700/90 font-medium">Please check your email to confirm your subscription.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your professional email" 
                  className="flex-1 px-5 py-3.5 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#0052cc] focus:bg-white focus:outline-none rounded-xl transition-all"
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#0052cc] hover:bg-[#0040a3] text-white px-8 py-3.5 rounded-xl font-bold text-[14px] hover:shadow-md transition-all whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Gain Access'
                  )}
                </button>
              </form>
            )}
            
            <p className="text-[12px] text-gray-400 mt-4 flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[15px] text-gray-450 font-bold">lock</span> No spam. Unsubscribe anytime.
            </p>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-blue-50/50 rounded-3xl -rotate-6 scale-105 blur-sm"></div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-150 relative transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-gray-950 font-display-xl text-[20px]">Wealth Empires</h4>
                  <span className="text-[11px] font-bold text-gray-400">Vol. 42</span>
                </div>
                <h5 className="font-bold text-[16px] text-[#0052cc]">The 2026 Global Liquidity Shift</h5>
              </div>
              <div className="space-y-4">
                <p className="text-gray-500 text-[13.5px] leading-relaxed font-normal">
                  As institutional capital reallocates to emerging sovereign jurisdictions, high-net-worth individuals must adapt their wealth preservation strategies. Our analysis of over $400B in cross-border flows indicates...
                </p>
                <div className="w-full h-32 bg-gray-50 rounded-xl overflow-hidden mt-4 border border-gray-150">
                  <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale opacity-75" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Benefits */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-8 py-10">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h2 className="font-display-xl text-[32px] md:text-[36px] font-bold text-gray-900 tracking-tight mb-4">What's Inside?</h2>
          <p className="text-gray-500 text-[15px] md:text-[16px] leading-relaxed font-normal">Every Sunday, we deliver a comprehensive breakdown of the forces shaping global wealth.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 border border-gray-150 rounded-[24px] hover:border-[#0052cc] transition-colors shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-[#0052cc] rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[22px] font-bold">trending_up</span>
            </div>
            <h3 className="font-bold text-gray-900 text-[18px] mb-3">Macro Strategy</h3>
            <p className="text-gray-500 text-[13.5px] leading-relaxed font-normal">Analysis of central bank policy, geopolitical shifts, and structural market changes before they hit mainstream media.</p>
          </div>
          <div className="bg-white p-8 border border-gray-150 rounded-[24px] hover:border-[#0052cc] transition-colors shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-[#0052cc] rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[22px] font-bold">gavel</span>
            </div>
            <h3 className="font-bold text-gray-900 text-[18px] mb-3">Legal Structuring</h3>
            <p className="text-gray-500 text-[13.5px] leading-relaxed font-normal">Actionable insights into offshore trusts, holding companies, and jurisdictional arbitrage for asset protection.</p>
          </div>
          <div className="bg-white p-8 border border-gray-150 rounded-[24px] hover:border-[#0052cc] transition-colors shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-[#0052cc] rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[22px] font-bold">account_balance</span>
            </div>
            <h3 className="font-bold text-gray-900 text-[18px] mb-3">Capital Allocation</h3>
            <p className="text-gray-500 text-[13.5px] leading-relaxed font-normal">Deep dives into alternative assets, private equity, and physical commodities favored by institutional capital.</p>
          </div>
        </div>
      </section>
      
      {/* Newsletter Archive Placeholder */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-8 py-10 border-t border-gray-150">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-display-xl text-[32px] md:text-[36px] font-bold text-gray-900 tracking-tight">Recent Editions</h2>
        </div>
        
        <div className="bg-white border border-gray-150 rounded-[24px] overflow-hidden divide-y divide-gray-100 shadow-sm">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-gray-50/40 transition-colors group cursor-pointer">
              <div className="flex-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Vol. {43 - item} • {new Date(Date.now() - item * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
                <h3 className="font-bold text-[18px] md:text-[20px] text-gray-950 group-hover:text-[#0052cc] transition-colors mb-2">
                  The Architecture of Sovereign Capital
                </h3>
                <p className="text-gray-500 text-[13.5px] line-clamp-2 leading-relaxed font-normal">
                  An exploration of how modern nation-states and high-net-worth individuals are deploying capital defensively in 2026.
                </p>
              </div>
              <button className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#0052cc] group-hover:bg-[#0052cc] group-hover:text-white transition-all bg-transparent">
                <span className="material-symbols-outlined text-[16px] font-bold">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NewsletterPage;
