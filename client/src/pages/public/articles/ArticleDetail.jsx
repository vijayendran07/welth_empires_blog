import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/axios';
import useAuthStore from '../../../store/useAuthStore';

// Removed hardcoded mock data
const fallbackContent = `
<p>For decades, the standard advice for wealth building has remained remarkably static: invest in a diversified portfolio of low-cost index funds, maximize your retirement accounts, and wait forty years. While this approach is effective for basic financial security, it often falls short of creating true, multi-generational <strong>Wealth Empires</strong>.</p>

<h2 id="the-wealth-shift">The Diversification Myth: Beyond Stocks</h2>
<p>To truly move into the top tier of wealth accumulation, one must look beyond the liquid public markets. High-net-worth individuals typically allocate a significant portion of their portfolios to alternative assets that provide lower correlation with the S&P 500.</p>

<blockquote>"The goal isn't just to beat the market; it's to create an ecosystem of assets that generate cash flow regardless of market volatility."</blockquote>

<ul>
  <li><strong>Private Equity:</strong> Investing in private businesses before they reach the public stage.</li>
  <li><strong>Real Estate Syndication:</strong> Pool capital to acquire institutional-grade commercial properties.</li>
  <li><strong>Digital Commodities:</strong> Strategic allocation into crypto-assets and decentralized finance protocols.</li>
</ul>

<h2 id="tax-efficiency">The Hidden Cost of Inefficiency</h2>
<p>Taxes are often the single largest expense in any wealth-building journey. Professional wealth management focuses heavily on tax-loss harvesting, strategic asset location, and utilizing trust structures to minimize the drag on long-term compounding.</p>

<figure>
  <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=900" alt="Asset Allocation Chart" />
  <figcaption>Proper asset allocation across taxable and non-taxable accounts can increase net returns by up to 1.5% annually.</figcaption>
</figure>

<h2 id="lasting-legacy">Building a Lasting Legacy</h2>
<p>Finally, a true wealth empire is one that survives its creator. This requires more than just a will; it requires a family constitution, education for the next generation, and a clear vision of the impact the family wealth should have on the world.</p>
`;

const ArticleDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [likedComments, setLikedComments] = useState({});
  const [dynamicToc, setDynamicToc] = useState([]);
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        // Fetch specific article and all articles in parallel to halve network latency
        const [res, allRes] = await Promise.all([
          api.get(`/articles/${slug}`),
          api.get('/articles')
        ]);
        
        setArticle(res.data);
        const related = allRes.data.filter(a => a.id !== res.data.id && a.published).slice(0, 3);
        setRelatedArticles(related);
      } catch (error) {
        console.error('Failed to fetch article', error);
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (article?.content && contentRef.current) {
      // Parse HTML to extract headings and inject IDs
      const parser = new DOMParser();
      const doc = parser.parseFromString(article.content, 'text/html');
      const headings = doc.querySelectorAll('h2, h3');
      const toc = [];
      headings.forEach((heading, idx) => {
        let id = heading.getAttribute('id');
        if (!id) {
          id = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `heading-${idx}`;
          heading.setAttribute('id', id);
        }
        toc.push({ id, label: heading.textContent, level: heading.tagName.toLowerCase() });
      });
      setDynamicToc(toc);
      // Update content HTML with new IDs
      contentRef.current.querySelector('.prose').innerHTML = doc.body.innerHTML;
    }
  }, [article]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim() || !article) return;
    setIsSubmittingComment(true);
    try {
      const res = await api.post(`/articles/${article.id}/comments`, {
        name: commentName,
        text: commentText
      });
      setArticle(prev => ({ ...prev, comments: [...(prev.comments || []), res.data] }));
      setCommentText('');
    } catch (error) {
      console.error('Failed to post comment', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (likedComments[commentId]) return; // already liked
    try {
      await api.put(`/articles/comments/${commentId}/like`);
      setLikedComments(l => ({ ...l, [commentId]: true }));
      setArticle(prev => ({
        ...prev,
        comments: prev.comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
      }));
    } catch (error) {
      console.error('Failed to like comment', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || isProgressHovered) return;
      const { top, height } = contentRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (top > windowHeight) setScrollProgress(0);
      else if (top < -height) setScrollProgress(100);
      else {
        const progress = Math.min(100, Math.max(0, ((windowHeight - top) / height) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-white">
        <h1 className="text-[48px] font-bold text-[#0052cc] font-display-xl">404</h1>
        <p className="text-gray-500">Article not found.</p>
        <Link to="/" className="text-[#0052cc] font-bold hover:underline">Return Home</Link>
      </div>
    );
  }

  const dateStr = new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const readTime = Math.ceil((article.content?.split(' ').length || 800) / 200);
  const fallbackImage = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1600';

  const authorName = article.customAuthorName || article.author?.name || 'Marcus Sterling';
  const authorBio = article.customAuthorBio || article.author?.bio || `${authorName} is a Lead Strategist at Wealth Empires with extensive experience in private equity and estate planning.`;
  const authorAvatar = article.customAuthorAvatar || article.author?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0052cc&color=fff&size=128`;

  return (
    <article className="w-full bg-white font-interface-body">

      {/* ── Reading Progress Bar ── */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-gray-100">
        <div className="h-full bg-[#0052cc] transition-all duration-150 ease-out" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* ── Full-Width Hero Image with Overlay ── */}
      <header className="relative w-full h-[320px] md:h-[400px] overflow-hidden">
        <img
          src={article.coverImage || fallbackImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* Category pill + Title over image */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-8 max-w-[1440px] mx-auto w-full left-0 right-0">
          <Link
            to={`/category/${article.category?.slug || 'investing'}`}
            className="inline-block mb-3 w-fit px-3 py-1 bg-[#0052cc] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm"
          >
            {article.category?.name || 'Investing'}
          </Link>
          <h1 className="font-display-xl text-[28px] md:text-[40px] font-bold text-white leading-tight tracking-tight max-w-3xl">
            {article.title}
          </h1>
        </div>
      </header>

      {/* ── Article Meta Row (below hero) ── */}
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex flex-wrap items-center gap-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Link to={article.customAuthorName ? '#' : `/author/${article.author?.id}`} className={`w-8 h-8 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-100 ${article.customAuthorName ? 'cursor-default' : ''}`}>
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            </Link>
            <span className="text-[13px] font-semibold text-gray-700">
              By {article.customAuthorName ? (
                <span className="text-gray-900 font-bold">{authorName}</span>
              ) : (
                <Link to={`/author/${article.author?.id}`} className="text-gray-900 font-bold hover:text-[#0052cc] transition-colors">{authorName}</Link>
              )}
            </span>
          </div>
          <span className="w-px h-4 bg-gray-200 hidden sm:block"></span>
          {/* Date */}
          <span className="flex items-center gap-1.5 text-[12.5px] text-gray-500">
            <span className="material-symbols-outlined text-[15px]">calendar_today</span>
            {dateStr}
          </span>
          <span className="w-px h-4 bg-gray-200 hidden sm:block"></span>
          {/* Read time */}
          <span className="flex items-center gap-1.5 text-[12.5px] text-gray-500">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            {readTime}-min read
          </span>

          {/* Spacer + actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${isBookmarked ? 'bg-[#0052cc] border-[#0052cc] text-white' : 'border-gray-200 text-gray-400 hover:text-[#0052cc] hover:border-[#0052cc]'}`}
              title="Bookmark"
            >
              <span className="material-symbols-outlined text-[16px]">bookmark</span>
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0052cc] hover:border-[#0052cc] transition-all"
              title="Share"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 clear-both">

        {/* Left Sidebar: TOC + Expert Tip */}
        <aside className="hidden lg:block float-left w-[280px] xl:w-[320px] mr-10 mb-8">
          <div className="space-y-5">

            {/* In This Article */}
            {dynamicToc.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4">In This Article</p>
                <ul className="space-y-3">
                  {dynamicToc.map((item, idx) => (
                    <li key={idx} className={item.level === 'h3' ? 'ml-4' : ''}>
                      <a
                        href={`#${item.id}`}
                        className="flex items-center gap-2.5 text-[13px] font-semibold text-gray-600 hover:text-[#0052cc] transition-colors group"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${idx === 0 ? 'bg-[#0052cc]' : 'bg-gray-250 group-hover:bg-[#0052cc]'} transition-colors`}></span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expert Tip */}
            {article.expertTip && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0052cc] mb-2">Expert Tip</p>
                <p className="text-[13px] text-gray-700 leading-relaxed italic">
                  {article.expertTip}
                </p>
              </div>
            )}

            {/* Read Progress */}
            <div
              className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 cursor-default"
              onMouseEnter={() => setIsProgressHovered(true)}
              onMouseLeave={() => setIsProgressHovered(false)}
              title="Hover to freeze progress"
            >
              <div className="relative w-12 h-12 shrink-0">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                  <circle cx="22" cy="22" r="18" fill="none" stroke={isProgressHovered ? '#22c55e' : '#0052cc'} strokeWidth="4"
                    strokeDasharray="113" strokeDashoffset={113 - (113 * scrollProgress) / 100}
                    className="transition-all duration-150 ease-out" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-gray-800">{Math.round(scrollProgress)}%</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{isProgressHovered ? 'Paused' : 'Progress'}</p>
                <p className="text-[12px] font-semibold text-gray-600">{readTime} min read</p>
              </div>
            </div>



          </div>
        </aside>

        {/* Center: Article Body */}
        <div ref={contentRef} className="block min-w-0">



          <div
            className="
              prose prose-slate max-w-none
              prose-headings:font-display-xl prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight prose-headings:leading-tight
              prose-h2:text-[24px] prose-h2:mt-10 prose-h2:mb-4
              prose-p:text-[15.5px] prose-p:leading-[1.85] prose-p:text-gray-700 prose-p:mb-5
              prose-a:text-[#0052cc] prose-a:font-semibold hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-[#0052cc] prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:font-medium prose-blockquote:my-6 prose-blockquote:bg-blue-50/40 prose-blockquote:py-3 prose-blockquote:rounded-r-lg
              prose-ul:space-y-2 prose-li:text-[15px] prose-li:text-gray-700
              prose-strong:text-[#0052cc] prose-strong:font-bold
              prose-img:rounded-xl prose-img:shadow-sm prose-img:w-full
              prose-figcaption:text-center prose-figcaption:text-[12px] prose-figcaption:text-gray-400 prose-figcaption:mt-2
            "
            dangerouslySetInnerHTML={{ __html: article.content || fallbackContent }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 clear-both">
              {article.tags.map(tag => (
                <span key={tag.id} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-[10.5px] font-bold uppercase tracking-wider text-gray-500 rounded-lg hover:text-[#0052cc] hover:border-[#0052cc] transition-colors cursor-pointer">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="clear-both pt-8"></div>

          {/* PDF Report Download Banner */}
          {article.pdfReportUrl && (
            <div className="bg-[#003087] text-white p-8 md:p-10 rounded-2xl mb-10 shadow-md border-none outline-none">
              <h2 className="font-display-xl text-[24px] md:text-[28px] font-bold leading-tight mb-4">{article.title}</h2>
              {article.excerpt && (
                <p className="text-[15px] text-white/90 leading-relaxed mb-8">{article.excerpt}</p>
              )}
              <a 
                href={article.pdfReportUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white text-[#003087] px-6 py-3 rounded-full font-bold text-[14px] inline-flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm w-fit border-none outline-none"
              >
                Download the report ({article.pdfReportSize || 'PDF'}) <span className="font-bold text-[16px]">&gt;</span>
              </a>
            </div>
          )}

          {/* ── Author Bio Card ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex gap-5 items-start">
            <Link to={article.customAuthorName ? `/author/guest-${encodeURIComponent(article.customAuthorName)}` : `/author/${article.author?.id}`} className={`w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-100`}>
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">About {authorName}</p>
                  {article.customAuthorName ? (
                    <Link to={`/author/guest-${encodeURIComponent(article.customAuthorName)}`} className="font-bold text-[16px] text-gray-900 hover:text-[#0052cc] transition-colors block mb-2">{authorName}</Link>
                  ) : (
                    <Link to={`/author/${article.author?.id}`} className="font-bold text-[16px] text-gray-900 hover:text-[#0052cc] transition-colors block mb-2">
                      {authorName}
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href="#" className="text-gray-400 hover:text-[#0052cc] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">language</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-[#0052cc] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </a>
                </div>
              </div>
              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-3">
                {authorBio}
              </p>
              {!article.customAuthorName && (
                <Link to={`/author/${article.author?.id}`} className="inline-flex items-center gap-1 text-[13px] font-bold text-[#0052cc] hover:gap-2 transition-all">
                  View All Articles <span className="text-[16px]">→</span>
                </Link>
              )}
            </div>
          </div>

          {/* ── Further Reading ── */}
          {relatedArticles.length > 0 && (
            <div className="mt-10 pt-8">
              <h3 className="font-bold text-[18px] text-gray-900 mb-6">Further Reading</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedArticles.map(rel => (
                  <Link key={rel.id} to={`/article/${rel.slug}`} className="group flex flex-col gap-3">
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                      <img
                        src={rel.coverImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400'}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h5 className="font-bold text-[14px] text-gray-800 leading-snug group-hover:text-[#0052cc] transition-colors line-clamp-2 mb-1">
                        {rel.title}
                      </h5>
                      <p className="text-[11px] text-gray-400">
                        {new Date(rel.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Discussions ── */}
          <div className="mt-8" id="discussions">
            <h3 className="font-bold text-[18px] text-[#0052cc] mb-5">
              Discussions ({article.comments?.length || 0})
            </h3>

            {/* Comment list */}
            <div className="space-y-5 mb-6">
              {article.comments?.map(comment => {
                const initials = comment.name.substring(0, 2).toUpperCase();
                // generate a pseudo-random color based on name
                const colorCode = comment.name.length % 3;
                const colors = ['bg-blue-100 text-[#0052cc]', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700'];
                return (
                  <div key={comment.id} className="flex gap-4">
                    <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-[12px] ${colors[colorCode]}`}>
                      {initials}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[13px] text-gray-900">{comment.name}</span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[13.5px] text-gray-600 leading-relaxed">{comment.text}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1.5 text-[12px] font-semibold transition-colors ${likedComments[comment.id] ? 'text-[#0052cc]' : 'text-gray-400 hover:text-[#0052cc]'}`}
                        >
                          <span className="material-symbols-outlined text-[15px]">thumb_up</span>
                          {comment.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!article.comments || article.comments.length === 0) && (
                <p className="text-gray-500 text-[13px] italic">Be the first to comment.</p>
              )}
            </div>

            {/* Comment input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-4">
              <div className="w-9 h-9 rounded-full shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13.5px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0052cc] focus:bg-white transition-all"
                />
                <textarea
                  required
                  rows="3"
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13.5px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0052cc] focus:bg-white transition-all resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim() || !commentName.trim()}
                    className="px-5 py-2 bg-[#0052cc] disabled:opacity-50 text-white font-bold text-[12.5px] rounded-lg hover:bg-[#0040a3] transition-colors flex items-center gap-2"
                  >
                    {isSubmittingComment && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    Post Comment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
