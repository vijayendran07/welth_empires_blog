import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import useAuthStore from '../../store/useAuthStore';

const faqItems = [
  {
    question: 'How do I start investing with Wealth Empires?',
    answer: "The first step is to schedule a discovery call with one of our senior wealth advisors. We'll conduct a thorough assessment of your current financial standing, long-term wealth goals, and risk tolerance to tailor a comprehensive roadmap for your portfolio. From there, we assign a dedicated relationship manager who guides every step of your journey."
  },
  {
    question: 'What real estate markets do you focus on?',
    answer: 'We primarily focus on high-yield metropolitan areas across North America, Europe, and select emerging markets in Southeast Asia. Our specialization covers commercial portfolios, high-end residential growth zones, logistics and industrial assets, and emerging structural jurisdictions with favorable regulatory environments.'
  },
  {
    question: 'Are your consultations free?',
    answer: 'Yes, our initial 30-minute discovery consultation is completely complimentary. We use this time to ensure that our wealth management frameworks, investment philosophies, and advisory culture align with your personal and corporate goals before any commitment is made.'
  },
  {
    question: 'How often will I receive portfolio updates?',
    answer: 'Members receive monthly comprehensive performance reports and real-time access to our proprietary digital dashboard. Major strategic allocations, tax optimization reviews, and advisory briefings are provided on a quarterly basis. Annual reviews include a full re-alignment of your financial strategy based on macroeconomic shifts.'
  },
  {
    question: 'What level of minimum investment is required?',
    answer: 'Our advisory services are tailored to high-net-worth individuals and corporate entities. While minimum investment thresholds vary by service tier, our standard managed portfolio programs begin at ₹50 lakhs or equivalent. We encourage an initial consultation to match you with the right program for your financial profile.'
  },
  {
    question: 'How is my financial data kept secure?',
    answer: 'We employ bank-grade 256-bit AES encryption across all client data and communications. Our infrastructure is ISO 27001 certified, and all client information is governed by strict confidentiality agreements. We never share, sell, or disclose your data to third parties without your explicit consent.'
  }
];

const services = [
  { icon: 'account_balance', title: 'Wealth Management', desc: 'Holistic advisory for growing and preserving multi-generational wealth across diverse asset classes.' },
  { icon: 'trending_up', title: 'Investment Strategy', desc: 'Data-driven portfolio construction for equities, bonds, alternative assets, and global real estate.' },
  { icon: 'gavel', title: 'Legal & Compliance', desc: 'Corporate incorporation, trademark protection, and regulatory compliance across multiple jurisdictions.' },
  { icon: 'receipt_long', title: 'Tax Optimization', desc: 'Advanced tax planning structures to legally minimize liability and maximize your net returns.' },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/messages', { name: form.name, email: form.email, message: `[${form.subject}] ${form.message}` });
      setSubmitSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen font-interface-body">

      {/* ── Hero Section ── */}
      <section className="relative bg-[#001a4d] pt-28 pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" alt="City skyline" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#001a4d]/95 via-[#001a4d]/80 to-[#0052cc]/60"></div>
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 text-center">
          <span className="inline-block px-5 py-1.5 bg-white/10 border border-white/20 text-white font-bold text-[11px] rounded-full uppercase tracking-widest mb-6">
            Get in Touch
          </span>
          <h1 className="font-display-xl text-[40px] md:text-[58px] font-bold text-white leading-[1.1] mb-5 tracking-tight">
            Expert Guidance is a <br />
            <span className="text-[#60a5fa]">Message Away.</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-white/75 max-w-3xl mx-auto leading-relaxed mb-8">
            Whether you're a corporate leader seeking structural clarity, an investor exploring high-yield opportunities, or an entrepreneur building a global empire — our team of seasoned advisors is ready to guide your next move.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact-form" className="px-7 py-3 bg-[#0052cc] hover:bg-[#0040a3] text-white font-bold text-[14px] rounded-full transition-colors shadow-lg">
              Send a Message
            </a>
            <a href="tel:+919884521264" className="px-7 py-3 bg-white/10 border border-white/30 hover:bg-white/20 text-white font-bold text-[14px] rounded-full transition-colors">
              Call Us Directly
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-[#f4f6fa] border-b border-gray-200 py-6">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '< 24hrs', label: 'Average Response Time' },
            { value: '500+', label: 'Clients Served Globally' },
            { value: '12+', label: 'Countries of Operation' },
            { value: '98%', label: 'Client Satisfaction Rate' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-[26px] md:text-[30px] font-bold text-[#0052cc] mb-0.5">{stat.value}</div>
              <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Information Section (Full Width) ── */}
      <section className="bg-white py-12 relative border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-[#0052cc] rounded-full"></div>
            <h2 className="font-display-xl text-[22px] font-bold text-gray-900 tracking-tight">Contact Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'mail', label: 'Email Us', value: 'support@wealthempires.in', href: 'mailto:support@wealthempires.in',  },
              { icon: 'call', label: 'Call Us', value: '+91 98845 21264', href: 'tel:+919884521264',  },
              { icon: 'schedule', label: 'Business Hours', value: 'Mon – Fri: 9:00 AM – 6:00 PM IST', href: null, },
              { icon: 'location_on', label: 'Visit Our HQ', value: 'Greenways Business Park, Chennai, Tamil Nadu', href: 'https://maps.google.com/?q=Greenways+Business+Park,+Chennai', },
            ].map((item) => (
              <div key={item.label} className="bg-[#f8f9fc] border border-gray-200 shadow-sm rounded-2xl p-4 flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] text-[#0052cc]">{item.icon}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</span>
                  {item.href ? (
                    <a href={item.href} className="text-[13px] font-bold text-gray-900 hover:text-[#0052cc] hover:underline leading-snug block">{item.value}</a>
                  ) : (
                    <p className="text-[13px] font-bold text-gray-900 leading-snug">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── Contact Form Section ── */}
      <section id="contact-form" className="bg-[#f8f9fc] py-16 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm">
            <h2 className="font-display-xl text-[22px] font-bold text-gray-900 mb-1.5">Send Us a Message</h2>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
              Fill in the form below and a dedicated advisor will personally respond within one business day.
            </p>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-7 rounded-2xl text-center">
                <span className="material-symbols-outlined text-[44px] text-green-500 mb-2 block">check_circle</span>
                <h4 className="font-bold text-[18px] mb-1.5">Message Received</h4>
                <p className="text-[13px] text-green-700 mb-4">A Wealth Empires representative will respond within 24 business hours.</p>
                <button onClick={() => setSubmitSuccess(false)} className="text-[13px] font-bold text-[#0052cc] hover:underline cursor-pointer">Send another message →</button>
              </div>
            ) : !isAuthenticated ? (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center bg-[#f8f9fc] rounded-2xl border border-gray-200">
                <div className="w-16 h-16 bg-blue-50 text-[#0052cc] rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[32px]">lock</span>
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-2">Authentication Required</h3>
                <p className="text-[13px] text-gray-500 mb-2 max-w-sm leading-relaxed">You must be a registered member of Wealth Empires to submit inquiries through our platform.</p>
                <p className="text-[12px] text-gray-400 mb-5">Registration is free and takes less than 2 minutes.</p>
                <Link to="/?login=true" className="bg-[#001a4d] hover:bg-[#0052cc] text-white px-8 py-3 rounded-xl font-bold text-[13px] transition-colors shadow-sm">
                  Sign In to Message
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input type="text" disabled value={user?.name || ''} className="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl text-gray-500 text-[13px] cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input type="email" disabled value={user?.email || ''} className="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-xl text-gray-500 text-[13px] cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 bg-[#f3f5f8] border border-transparent rounded-xl text-gray-900 text-[13px] focus:outline-none focus:bg-white focus:border-[#0052cc] transition-all cursor-pointer">
                    <option value="">Select a subject...</option>
                    <option>Wealth Management Inquiry</option>
                    <option>Investment Strategy Consultation</option>
                    <option>Legal & Compliance Services</option>
                    <option>Tax Optimization Planning</option>
                    <option>Real Estate Portfolio Advisory</option>
                    <option>Partnership & Business Inquiry</option>
                    <option>General Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea rows="5" required placeholder="Describe your goals, current situation, or any specific questions..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 bg-[#f3f5f8] border border-transparent rounded-xl text-gray-900 text-[13px] focus:outline-none focus:bg-white focus:border-[#0052cc] placeholder-gray-400 transition-all resize-none" />
                </div>
                <p className="text-[11px] text-gray-400">
                  By submitting this form, you agree to our <Link to="/privacy" className="text-[#0052cc] hover:underline">Privacy Policy</Link>. All communications are encrypted and kept strictly confidential.
                </p>
                <button type="submit" disabled={isSubmitting || !form.message.trim()} className="w-full bg-[#0052cc] hover:bg-[#0040a3] disabled:opacity-60 text-white font-bold text-[14px] px-8 py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Sending...</span></>
                  ) : (
                    <><span className="material-symbols-outlined text-[19px]">send</span><span>Send Secure Message</span></>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: HQ + Schedule Call */}
          <div className="flex flex-col gap-6">
            {/* HQ Map Row */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 flex flex-col items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0052cc] shrink-0">
                <span className="material-symbols-outlined text-[32px]">map</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-[18px] mb-2">Chennai Headquarters</h4>
                <p className="text-[14px] text-gray-500 leading-relaxed mb-1">Greenways Business Park, Tamil Nadu, India — 600028</p>
                <p className="text-[13px] text-gray-400">Mon – Fri, 9:00 AM – 6:00 PM IST</p>
              </div>
              <a href="https://maps.google.com/?q=Greenways+Business+Park,+Chennai,+Tamil+Nadu" target="_blank" rel="noreferrer" className="w-full px-6 py-3.5 bg-[#001a4d] hover:bg-[#0052cc] text-white font-bold rounded-xl text-[14px] transition-colors shadow-sm text-center">
                Open in Maps
              </a>
            </div>

            {/* Schedule Call */}
            <div className="text-center p-6 bg-[#f4f6fa] rounded-2xl border border-gray-200">
              <p className="text-[14px] text-gray-600 mb-4">Still have questions? Our advisory team is happy to walk you through anything in a private consultation.</p>
              <a href="tel:+919884521264" className="inline-flex items-center gap-2 px-7 py-3 bg-[#0052cc] hover:bg-[#0040a3] text-white font-bold text-[13px] rounded-full transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[17px]">call</span>
                Schedule a Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="bg-white py-12 px-6 border-t border-gray-100">
        <div className="max-w-[860px] mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-[#0052cc] rounded-full"></div>
            <h2 className="font-display-xl text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <p className="text-[13px] text-gray-500 mb-7 ml-4">
            We've compiled answers to the questions we hear most often. Reach out directly if you need more.
          </p>
          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className={`rounded-2xl overflow-hidden border transition-all duration-300 ${isOpen ? 'border-[#0052cc] shadow-md' : 'border-gray-200 bg-[#f8f9fc]'}`}>
                  <button onClick={() => toggleFaq(idx)} className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-[14px] md:text-[15px] text-gray-900 hover:text-[#0052cc] transition-colors focus:outline-none cursor-pointer">
                    <span>{item.question}</span>
                    <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 shrink-0 ml-4 ${isOpen ? 'rotate-180 text-[#0052cc]' : 'text-gray-400'}`}>keyboard_arrow_down</span>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
                    <div className="px-5 pb-5 text-[13px] leading-relaxed text-gray-600 bg-white border-t border-gray-100 pt-3">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
