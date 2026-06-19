import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TrendingCarousel from '../../components/sections/TrendingCarousel';
import api from '../../lib/axios';

const heroQuotes = [
  "Knowledge Invested Today, Wealth Empowered Tomorrow. Navigate complex global markets with expert strategies to accelerate your corporate wealth creation.",
  "Secure Your Legacy With Unmatched Legal Compliance. Fortify your corporate structure against regulatory risks and ensure multi-generational stability.",
  "Protecting Global Brand Sovereignty And Assets. Secure the identity that defines your empire and prevent competitors from capitalizing on your market presence.",
  "Strategic Tax Optimization For High-Net-Worth Individuals. Minimize corporate burdens and legally maximize your returns through sophisticated structural planning."
];

const getCatColor = (name) => {
  if (!name) return '#0052cc';
  const lower = name.toLowerCase();
  if (lower.includes('equity') || lower.includes('cyber') || lower.includes('security')) return '#00897b';
  return '#0052cc';
};

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoadedExtra, setHasLoadedExtra] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [agree, setAgree] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [visibleLatest, setVisibleLatest] = useState(6);

  const handleShare = (e, platform, article) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Fallback to empty string if slug is missing
    const slug = article.slug || `article-${article.id}`;
    const url = encodeURIComponent(window.location.origin + '/article/' + slug);
    const title = encodeURIComponent(article.title);
    let shareLink = '';
    
    switch(platform) {
      case 'linkedin': shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`; break;
      case 'twitter': shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${title}`; break;
      case 'whatsapp': shareLink = `https://api.whatsapp.com/send?text=${title}%20${url}`; break;
      case 'instagram': shareLink = `https://instagram.com`; break;
    }
    
    if (shareLink) window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await api.get('/articles');
        // Only show published articles
        const publishedArticles = res.data.filter(a => a.published);
        setArticles(publishedArticles);

        // Derive unique categories from articles
        const catMap = {};
        publishedArticles.forEach(a => {
          if (a.category?.id && !catMap[a.category.id]) {
            catMap[a.category.id] = a.category;
          }
        });
        setCategories(Object.values(catMap));
      } catch (error) {
        console.error('Failed to fetch articles on Home', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % heroQuotes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/articles?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/articles');
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && agree) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  // Filter articles based on search
  const filteredArticles = articles.filter(art => 
    art.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute popular articles
  const popularArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  return (
    <div className="bg-white text-gray-800 font-interface-body">
      
      {/* ── Full-Width Hero Section ── */}
      <section className="relative w-full min-h-[750px] flex items-center pt-56 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
            alt="City Skyline" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay (Dark blue on left fading to transparent on right) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001a4d]/95 via-[#001a4d]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full flex flex-col md:flex-row items-end justify-between gap-12">
          
          {/* Left Content */}
          <div className="max-w-2xl text-white">
           

            <h1 className="font-serif text-[48px] md:text-[64px] font-bold leading-[1.1] mb-6 tracking-tight">
              Insights that <br/> inspire growth
            </h1>
            
            <p className="text-[16px] md:text-[18px] text-white/80 leading-relaxed mb-8 max-w-xl">
              Stay ahead with stories, strategies, and expert perspectives shaping the future of wealth and business.
            </p>

            <div className="w-12 h-1 bg-[#0052cc] mb-10 rounded-full"></div>

            {/* Hero Search Box */}
            <form onSubmit={handleSearchSubmit} className="flex w-full bg-white rounded-full shadow-xl p-1.5 items-center mb-12">
              <span className="material-symbols-outlined text-gray-400 pl-4 pr-2">search</span>
              <input 
                type="text" 
                placeholder="Search articles, topics, or keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-transparent text-[15px] text-gray-900 focus:outline-none placeholder-gray-400 py-3"
              />
              <button 
                type="submit" 
                className="bg-[#0052cc] hover:bg-[#0040a3] text-white font-bold text-[14.5px] px-8 py-3 rounded-full transition-colors whitespace-nowrap shadow-sm"
              >
                Explore Articles
              </button>
            </form>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </div>
                <div>
                  <div className="font-bold text-[18px] leading-tight">250+</div>
                  <div className="text-[12px] text-white/60">Articles</div>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                </div>
                <div>
                  <div className="font-bold text-[18px] leading-tight">50+</div>
                  <div className="text-[12px] text-white/60">Experts</div>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined text-[18px]">language</span>
                </div>
                <div>
                  <div className="font-bold text-[18px] leading-tight">12+</div>
                  <div className="text-[12px] text-white/60">Categories</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content (Glass Quote Card Carousel) */}
          <div className="w-full md:w-auto mt-8 md:mt-0" style={{ perspective: '1000px' }}>
            <div className="bg-[#001a4d]/60 backdrop-blur-md border border-white/10 rounded-[20px] p-8 w-full md:w-[480px] h-52 shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0052cc]/20 rounded-full blur-3xl"></div>
              <span className="material-symbols-outlined text-[32px] text-[#0052cc] mb-4 relative z-10" style={{ fontVariationSettings: '"FILL" 1' }}>format_quote</span>
              
              <div className="relative h-28 w-full" style={{ transformStyle: 'preserve-3d' }}>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={currentQuoteIndex}
                    initial={{ opacity: 0, rotateX: -90, y: 20 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, rotateX: 90, y: -20 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
                    className="font-bold text-[17px] text-white leading-snug absolute top-0 left-0 w-full"
                    style={{ transformOrigin: "bottom center" }}
                  >
                    {heroQuotes[currentQuoteIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>
              
              <div className="w-12 h-1 bg-[#0052cc] rounded-full mt-4 relative z-10"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Latest Analysis Section */}
      <section className="bg-[#f8f9fc] py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Grid of Articles */}
            <div className="lg:col-span-12">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-[#0052cc] rounded-full"></div>
                    <h2 className="font-display-xl text-[28px] font-bold text-[#001a4d] tracking-tight">Latest Analysis</h2>
                  </div>
                  <p className="text-[15px] text-gray-600 leading-relaxed">
                    Discover our most recently published insights and market breakdowns. This section is updated regularly with fresh perspectives on emerging trends, strategic investments, and timely advice to keep you ahead in the fast-paced world of corporate wealth.
                  </p>
                </div>
                <Link
                  to="/articles"
                  className="text-[13px] font-bold text-[#0052cc] flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap pt-2"
                >
                  Explore All <span className="text-[18px]">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, visibleLatest).map((article) => {
                  const catColor = getCatColor(article.category?.name);
                  return (
                    <div key={article.id} className="bg-white border border-gray-200 flex flex-col group cursor-pointer h-full">
                      <div className="w-full aspect-[16/9] overflow-hidden block shrink-0">
                        <img src={article.coverImage || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600'} alt={article.category?.name || 'Category'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      </div>
                      <div className="flex-grow flex flex-col p-6">
                        <span className="block text-[13px] font-medium mb-1.5" style={{ color: catColor }}>{article.category?.name || 'General'}</span>
                        <Link to={`/article/${article.slug}`} className="text-[20px] font-bold text-[#001a4d] leading-[1.3] group-hover:text-[#0052cc] transition-colors block mb-4">{article.title}</Link>
                        <p className="text-[15px] text-[#4a4a4a] line-clamp-3 mb-8 leading-[1.6]">{article.excerpt}</p>
                        <Link to={`/article/${article.slug}`} className="mt-auto text-[#0052cc] text-[15px] font-bold flex items-center gap-1.5 hover:underline w-max">
                          Read more <span className="text-[17px] font-bold mb-px">&gt;</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-4 mt-10">
                {visibleLatest > 6 && (
                  <button 
                    onClick={() => setVisibleLatest(prev => Math.max(6, prev - 3))}
                    className="px-8 py-3 border-2 font-bold text-[13px] rounded-full transition-all border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer shadow-sm"
                  >
                    Load Less
                  </button>
                )}
                <button 
                  onClick={() => setVisibleLatest(prev => prev + 3)}
                  disabled={visibleLatest >= articles.length}
                  className={`px-8 py-3 border-2 font-bold text-[13px] rounded-full transition-all shadow-sm
                    ${visibleLatest >= articles.length 
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'border-[#0052cc] text-[#0052cc] hover:bg-[#0052cc] hover:text-white cursor-pointer'}`}
                >
                  {visibleLatest >= articles.length ? 'No More Articles' : 'Load More Articles'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Promotional Banner ── */}
      <section className="bg-[#2452de] py-8 lg:py-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Image & Large Text */}
            <div className="lg:col-span-4 relative flex flex-col items-center lg:items-start pt-2 w-full select-none pl-0 lg:pl-4">
              
              {/* MAKE */}
              <div className="relative text-[48px] sm:text-[56px] lg:text-[64px] font-bold text-white leading-[0.85] tracking-tighter z-20 drop-shadow-md uppercase font-sans">
                MAKE
              </div>

              {/* Image */}
              <div className="relative z-10 w-[60%] sm:w-[50%] lg:w-[85%] aspect-[5/4] shadow-2xl -mt-2 lg:-mt-3 ml-0 lg:ml-10">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" 
                  alt="Professionals collaborating" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* THE DIFFERENCE */}
              <div className="flex flex-col items-center lg:items-end text-[48px] sm:text-[56px] lg:text-[64px] font-bold text-white leading-[0.85] tracking-tighter z-20 drop-shadow-md -mt-3 lg:-mt-4 uppercase font-sans w-[80%] lg:w-full">
                <span className="z-20">THE</span>
                <span className="z-10 -mt-1">DIFFERENCE</span>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-8 text-white z-10">
              <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold leading-tight mb-6 tracking-tight">
                Make the Difference with Wealth Empires
              </h2>
              
              <div className="space-y-6 text-[15px] sm:text-[16px] leading-relaxed text-white/90 mb-10 max-w-4xl">
                <p>
                  At Wealth Empires, what sets us apart isn't just what we do, it's how we do it.
                </p>
                <p>
                  We're leveraging deep expertise and innovative technology to turn insights into opportunity and move business and innovation forward, placing human connections at the center.
                </p>
                <p>
                  Together, we make the difference.
                </p>
              </div>

              <div className="flex">
                <Link 
                  to="/about"
                  className="bg-white text-[#2452de] font-bold text-[14px] px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm"
                >
                  Learn more <span className="text-[18px] leading-none mb-0.5">&gt;</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Most Viewed Section ── */}
      <section className="bg-[#f8f9fc] py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-[#0052cc] rounded-full"></div>
                <h2 className="font-display-xl text-[28px] font-bold text-[#001a4d] tracking-tight">Most Viewed Articles</h2>
              </div>
              <p className="text-[15px] text-gray-600 leading-relaxed">
                Explore the content that is currently capturing the attention of our community. These are the top-performing articles ranked by view count, highlighting the most sought-after knowledge, critical analyses, and foundational strategies our readers value most.
              </p>
            </div>
            <Link
              to="/articles"
              className="text-[13px] font-bold text-[#0052cc] flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap pt-2"
            >
              Explore Top Charts <span className="text-[18px]">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.slice(0, 8).map((article) => {
              const catColor = getCatColor(article.category?.name);
              return (
                <div key={article.id} className="bg-white border border-gray-200 flex flex-col group cursor-pointer h-full">
                  <div className="w-full aspect-[16/9] overflow-hidden block shrink-0">
                    <img src={article.coverImage || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600'} alt={article.category?.name || 'Category'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="flex-grow flex flex-col p-6">
                    <span className="block text-[13px] font-medium mb-1.5" style={{ color: catColor }}>{article.category?.name || 'General'}</span>
                    <Link to={`/article/${article.slug}`} className="text-[20px] font-bold text-[#001a4d] leading-[1.3] group-hover:text-[#0052cc] transition-colors block mb-4">{article.title}</Link>
                    <p className="text-[15px] text-[#4a4a4a] line-clamp-3 mb-8 leading-[1.6]">{article.excerpt}</p>
                    <Link to={`/article/${article.slug}`} className="mt-auto text-[#0052cc] text-[15px] font-bold flex items-center gap-1.5 hover:underline w-max">
                      Read more <span className="text-[17px] font-bold mb-px">&gt;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Connect with Us Section ── */}
      <section className="bg-[#2463eb] py-10 md:py-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          {/* Inner relative container */}
          <div className="relative w-full h-[350px] md:h-[420px]">
            {/* Full width image */}
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600" 
              alt="Executives on stairs" 
              className="w-full h-full object-cover" 
            />
            
            {/* Right Dark Box anchored to bottom-right */}
            <div className="absolute bottom-0 right-0 w-[85%] md:w-[45%] lg:w-[40%] bg-[#003087] p-8 md:p-10 text-white shadow-lg flex flex-col justify-center h-[70%]">
              <h2 className="font-bold text-[22px] md:text-[26px] mb-4 tracking-tight">Connect with us</h2>
              <p className="text-[13px] md:text-[14px] text-white/90 leading-relaxed mb-8">
                Contact our specialists for more information
              </p>
              
              <Link to="/contact" className="self-start bg-white text-[#003087] font-bold text-[13px] px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2">
                Contact us
                <span className="material-symbols-outlined text-[16px] font-bold">chevron_right</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── Popular Section ── */}
      <section className="bg-white py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-[#0052cc] rounded-full"></div>
                <h2 className="font-display-xl text-[28px] font-bold text-[#001a4d] tracking-tight">Popular Articles</h2>
              </div>
              <p className="text-[15px] text-gray-600 leading-relaxed">
                Dive into timeless pieces that consistently drive engagement and spark discussion among industry leaders. This curated selection represents highly regarded thought leadership, in-depth reports, and evergreen insights that remain relevant to your ongoing success.
              </p>
            </div>
            <Link
              to="/articles"
              className="text-[13px] font-bold text-[#0052cc] flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap pt-2"
            >
              See All Popular <span className="text-[18px]">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.slice(8, 12).map((article) => {
              const catColor = getCatColor(article.category?.name);
              return (
                <div key={`pop-${article.id}`} className="bg-white border border-gray-200 flex flex-col group cursor-pointer h-full">
                  <div className="w-full aspect-[16/9] overflow-hidden block shrink-0">
                    <img src={article.coverImage || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600'} alt={article.category?.name || 'Category'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="flex-grow flex flex-col p-6">
                    <span className="block text-[13px] font-medium mb-1.5" style={{ color: catColor }}>{article.category?.name || 'General'}</span>
                    <Link to={`/article/${article.slug}`} className="text-[20px] font-bold text-[#001a4d] leading-[1.3] group-hover:text-[#0052cc] transition-colors block mb-4">{article.title}</Link>
                    <p className="text-[15px] text-[#4a4a4a] line-clamp-3 mb-8 leading-[1.6]">{article.excerpt}</p>
                    <Link to={`/article/${article.slug}`} className="mt-auto text-[#0052cc] text-[15px] font-bold flex items-center gap-1.5 hover:underline w-max">
                      Read more <span className="text-[17px] font-bold mb-px">&gt;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Category Explorer Banner ── */}
      <section className="bg-[#003087] py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <p className="text-white font-bold text-[20px] md:text-[22px] mb-8 leading-snug">
            Click on a topic below to dive in via dedicated pages
          </p>
          <div className="flex flex-wrap gap-3">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/articles?category=${encodeURIComponent(cat.name)}`}
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/40 rounded-full text-white text-[14px] font-medium hover:bg-white hover:text-[#003087] transition-all duration-200 whitespace-nowrap group"
                >
                  {cat.name}
                  <span className="text-[16px] font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span>
                </Link>
              ))
            ) : (
              // Fallback static categories while loading
              ['Wealth Management', 'Tax Strategy', 'Investments', 'Legal & Compliance', 'Real Estate', 'Retirement', 'Global Markets', 'ETFs & Funds'].map((name) => (
                <Link
                  key={name}
                  to={`/articles?category=${encodeURIComponent(name)}`}
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/40 rounded-full text-white text-[14px] font-medium hover:bg-white hover:text-[#003087] transition-all duration-200 whitespace-nowrap group"
                >
                  {name}
                  <span className="text-[16px] font-bold group-hover:translate-x-0.5 transition-transform">&gt;</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
