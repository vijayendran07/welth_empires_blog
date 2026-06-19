import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/axios';

// Static mock data for rich UI
const mockFeatured = {
  id: 'f1',
  slug: 'blueprint-generational-wealth-building',
  title: 'The 2024 Blueprint for Generational Wealth Building',
  excerpt: 'Discover why traditional 60/40 portfolios are failing and how institutional-grade alternative assets are becoming the new standard for the elite investor class.',
  coverImage: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&q=80&w=900',
  category: { name: 'Investing' },
  author: { name: 'Alexander Sterling', avatarUrl: '' },
  readTime: '12 min read',
  createdAt: '2024-05-14T00:00:00.000Z',
};

const mockLatest = [
  {
    id: 'l1', slug: 'etfs-changed-bitcoin-forever',
    title: 'The Institutional Shift: Why ETFs Changed Bitcoin Forever',
    excerpt: 'Examining the massive liquidity inflow from Wall Street giants and what it means for everyday investors.',
    coverImage: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&q=80&w=600',
    tags: ['Crypto', 'Policy'],
    createdAt: 'May 14, 2024',
  },
  {
    id: 'l2', slug: 'commercial-real-estate-renaissance',
    title: "Commercial Real Estate's Quiet Renaissance",
    excerpt: "Beyond the office collapse, multi-family and industrial properties are hitting record highs.",
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    tags: ['Real Estate'],
    createdAt: 'May 12, 2024',
  },
  {
    id: 'l3', slug: 'tax-loss-harvesting-playbook',
    title: 'The Tax-Loss Harvesting Playbook for High Earners',
    excerpt: 'How to legally offset capital gains with strategic asset rebalancing before fiscal year close.',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600',
    tags: ['Tax', 'Strategy'],
    createdAt: 'May 10, 2024',
  },
  {
    id: 'l4', slug: 'dividend-aristocrats-2024',
    title: 'Dividend Aristocrats: 25 Stocks That Pay Through Recessions',
    excerpt: 'A curated list of companies that have increased dividends for 25+ consecutive years.',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600',
    tags: ['Stocks', 'Dividends'],
    createdAt: 'May 8, 2024',
  },
];

const mockPopular = [
  { id: 'p1', slug: 'hedge-inflation-physical-gold', title: 'How to Hedge Against Inflation Using Physical Gold', views: '13k', readTime: '5 min read' },
  { id: 'p2', slug: 'understanding-bond-yields-2024', title: 'Understanding Bond Yields: A Survival Guide for 2024', views: '14k', readTime: '8 min read' },
  { id: 'p3', slug: 'psychology-of-panic-selling', title: 'The Psychology of Panic Selling: How to Stay Rational', views: '9.5k', readTime: '10 min read' },
];

const categoryImages = {
  investing: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=700',
  'real-estate': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=700',
  cryptocurrency: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&q=80&w=700',
  'stock-market': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=700',
};

const getInitials = (name) => {
  if (!name) return 'WE';
  const parts = name.split(' ');
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategoryData = async () => {
      try {
        setIsLoading(true);
        const [catRes, artRes] = await Promise.all([
          api.get('/categories').catch(() => ({ data: [] })),
          api.get('/articles').catch(() => ({ data: [] }))
        ]);
        const foundCat = catRes.data.find(c => c.slug === slug || c.id === slug);
        setCategory(foundCat || { name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '), slug, description: '' });
        if (foundCat) {
          const categoryArticles = artRes.data.filter(a => a.categoryId === foundCat.id && a.published);
          setArticles(categoryArticles);
        }
      } catch (error) {
        console.error('Failed to fetch category data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const categoryName = category?.name || slug;
  const heroImage = categoryImages[slug] || categoryImages['investing'];
  const featured = articles.length > 0 ? articles[0] : mockFeatured;
  const latestList = articles.length > 1 ? articles.slice(1, 5) : mockLatest;
  
  // Sort articles by views for popular list
  const popularList = articles.length > 0 
    ? [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3)
    : mockPopular;

  const featuredDate = featured.createdAt
    ? new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'May 14, 2024';

  return (
    <div className="w-full bg-white font-interface-body">

      {/* ── Hero Header ── */}
      <header className="border-b border-gray-150 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <span className="inline-block px-3 py-1 bg-blue-50 text-[#0052cc] text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
              Category
            </span>
            <h1 className="font-display-xl text-[40px] md:text-[52px] font-bold text-[#0052cc] leading-tight tracking-tight mb-4">
              {categoryName}
            </h1>
            <p className="text-[14.5px] text-gray-500 leading-relaxed mb-6 max-w-lg">
              {category?.description || `Master the markets with our comprehensive guides on stocks, crypto, real estate, and portfolio management. From beginner strategies to advanced wealth-building techniques, discover the tools you need to grow your empire.`}
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0052cc] hover:bg-[#0040a3] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[16px]">notifications</span>
                Follow Topic
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 hover:border-[#0052cc] hover:text-[#0052cc] text-gray-700 text-[13px] font-bold rounded-lg transition-colors bg-white">
                <span className="material-symbols-outlined text-[16px]">share</span>
                View Resources
              </button>
            </div>
          </div>

          {/* Right: Category image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] lg:aspect-[3/2] border border-gray-150 shadow-sm">
            <img
              src={heroImage}
              alt={categoryName}
              className="w-full h-full object-cover grayscale-[0.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
          </div>
        </div>
      </header>

      {/* ── Featured Insight ── */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
        {/* Section title with left blue bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[#0052cc] rounded-full"></div>
          <h2 className="font-bold text-[18px] text-gray-900 tracking-tight">Featured Insight</h2>
        </div>

        <Link
          to={`/article/${featured.slug}`}
          className="group grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-gray-150 hover:border-gray-250 shadow-sm hover:shadow-md transition-all"
        >
          {/* Image */}
          <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-gray-100">
            <img
              src={featured.coverImage || 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&q=80&w=900'}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
          {/* Content */}
          <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
            <span className="text-[10px] font-bold text-[#0052cc] uppercase tracking-widest mb-3">Must Read</span>
            <h3 className="font-display-xl text-[26px] md:text-[30px] font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#0052cc] transition-colors">
              {featured.title}
            </h3>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6 line-clamp-3">
              {featured.excerpt || "Discover why traditional 60/40 portfolios are failing and how institutional-grade alternative assets are becoming the new standard for the elite investor class."}
            </p>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0052cc] border border-blue-100 flex items-center justify-center text-[11px] font-bold shrink-0">
                {featured.author?.avatarUrl
                  ? <img src={featured.author.avatarUrl} alt={featured.author.name} className="w-full h-full object-cover rounded-full" />
                  : getInitials(featured.author?.name)}
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-800">{featured.author?.name || 'Alexander Sterling'}</p>
                <p className="text-[11px] text-gray-400">{featuredDate} • {featured.readTime || '12 min read'}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#0052cc] group-hover:gap-2 transition-all">
              Read Full Strategy <span className="text-[18px]">→</span>
            </span>
          </div>
        </Link>
      </section>

      {/* ── Latest Analysis + Sidebar ── */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: 2-col article grid */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-[#0052cc] rounded-full"></div>
            <h2 className="font-bold text-[18px] text-gray-900 tracking-tight">Latest Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestList.map((article) => {
              const dateStr = article.createdAt
                ? (typeof article.createdAt === 'string' && article.createdAt.includes('-')
                  ? new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : article.createdAt)
                : 'May 2024';
              const tags = article.tags || (article.category?.name ? [article.category.name] : ['Investing']);
              return (
                <Link
                  key={article.id}
                  to={`/article/${article.slug}`}
                  className="group flex flex-col bg-white border border-gray-150 hover:border-gray-250 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={article.coverImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold text-gray-500 border border-gray-200 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-[15px] text-gray-900 leading-snug mb-2 group-hover:text-[#0052cc] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                      {article.excerpt || "Institutional strategies for the modern wealth builder."}
                    </p>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                      <span className="text-[11px] text-gray-400 font-medium">{dateStr}</span>
                      <button
                        onClick={(e) => { e.preventDefault(); setBookmarked(b => ({ ...b, [article.id]: !b[article.id] })); }}
                        className="text-gray-300 hover:text-[#0052cc] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {bookmarked[article.id] ? 'bookmark' : 'bookmark_border'}
                        </span>
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
          {/* Popular This Week */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[15px] text-gray-900">Popular This Week</h3>
              <span className="material-symbols-outlined text-[18px] text-[#0052cc]">trending_up</span>
            </div>
            <div className="flex flex-col gap-5">
              {popularList.map((item, idx) => (
                <Link
                  key={item.id}
                  to={`/article/${item.slug}`}
                  className="group flex gap-4 items-start"
                >
                  <span className="text-[22px] font-bold text-gray-150 leading-none shrink-0 w-7 pt-0.5 font-display-xl">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-[13px] font-bold text-gray-900 leading-snug group-hover:text-[#0052cc] transition-colors line-clamp-2 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {typeof item.views === 'number' ? `${item.views.toLocaleString()} views` : `${item.views || 0} views`} • {item.readTime || `${Math.max(1, Math.ceil((item.content?.length || 0) / 1000))} min read`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Empire Intelligence CTA */}
          <div className="bg-[#0052cc] rounded-2xl p-6 text-white shadow-sm">
            <h3 className="font-bold text-[17px] mb-2">Empire Intelligence</h3>
            <p className="text-[12.5px] text-white/80 leading-relaxed mb-4">
              Get our weekly breakdown of market movements, geopolitical shifts, and wealth opportunities.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2.5 rounded-lg bg-white/15 border border-white/20 text-white placeholder-white/50 text-[13px] focus:outline-none focus:bg-white/20 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-white text-[#0052cc] font-bold text-[13px] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Subscribe Free
              </button>
            </form>
          </div>
        </aside>

      </section>

      {/* Empty state */}
      {articles.length === 0 && (
        <p className="hidden">Using mock data for demonstration.</p>
      )}
    </div>
  );
};

export default CategoryPage;
