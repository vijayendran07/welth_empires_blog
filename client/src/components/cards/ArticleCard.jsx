import { Link } from 'react-router-dom';

const ArticleCard = ({ article, featured = false, compact = false }) => {
  // Mock calculate read time (approx 200 words per min)
  const readTime = article.content 
    ? Math.ceil(article.content.split(' ').length / 200) 
    : 5;
    
  const dateStr = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const authorName = article.customAuthorName || article.author?.name || 'Editorial Board';
  const authorAvatar = article.customAuthorAvatar || article.author?.avatarUrl;

  const fallbackImage = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200';

  const handleShare = (e, platform) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = encodeURIComponent(window.location.origin + '/article/' + article.slug);
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

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'WE';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // 1. Featured Layout: Horizontal card on desktop
  if (featured) {
    return (
      <Link 
        to={`/article/${article.slug}`} 
        className="group flex flex-col md:flex-row gap-6 items-stretch bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="w-full md:w-[45%] min-h-[200px] md:min-h-[260px] md:h-auto relative overflow-hidden">
          <img 
            src={article.coverImage || fallbackImage} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-102"
          />
        </div>
        <div className="w-full md:w-[55%] p-4 sm:p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0052cc] bg-blue-50 px-3 py-1 rounded-[4px]">
                {article.category?.name || 'Editorial'}
              </span>
              <span className="text-[12px] text-gray-500 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[15px]">schedule</span> {readTime} min read
              </span>
            </div>
            <h3 className="font-display-xl text-[20px] sm:text-[24px] md:text-[32px] font-bold text-gray-950 leading-tight mb-3 sm:mb-4 group-hover:text-[#0052cc] transition-colors">
              {article.title}
            </h3>
            <p className="text-[14px] md:text-[15px] text-gray-500 line-clamp-3 mb-5 leading-relaxed font-interface-body">
              {article.excerpt || "An exclusive look into the strategies driving wealth generation in today's dynamic global economy."}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-gray-100 pt-4 sm:pt-5 mt-auto gap-3 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0052cc] border border-blue-100 flex items-center justify-center font-bold overflow-hidden text-[12px]">
                {authorAvatar ? (
                  <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                ) : (
                  getInitials(authorName)
                )}
              </div>
              <div>
                <p className="text-[11px] sm:text-[13px] font-bold text-gray-800 uppercase tracking-widest leading-none mb-1">
                  {authorName}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">{dateStr}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#25D366] hover:border-[#25D366] hover:bg-green-50 transition-colors bg-transparent" 
                onClick={(e) => handleShare(e, 'whatsapp')} 
                title="Share to WhatsApp"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </button>
              <button 
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#E1306C] hover:border-[#E1306C] hover:bg-pink-50 transition-colors bg-transparent" 
                onClick={(e) => handleShare(e, 'instagram')} 
                title="Share to Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </button>
              <button 
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black hover:bg-gray-100 transition-colors bg-transparent" 
                onClick={(e) => handleShare(e, 'twitter')} 
                title="Share to X"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // 2. Compact Layout: Sidebar row
  if (compact) {
    return (
      <Link 
        to={`/article/${article.slug}`} 
        className="group flex gap-4 items-center py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-3 -mx-3 rounded-xl"
      >
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
          <img 
            src={article.coverImage || fallbackImage} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{dateStr}</span>
          <h4 className="font-bold text-gray-950 text-[14px] leading-snug group-hover:text-[#0052cc] transition-colors line-clamp-2">
            {article.title}
          </h4>
        </div>
      </Link>
    );
  }

  // 3. Standard Grid Card
  const catColor = article.category?.name ?
    (article.category.name.toLowerCase().includes('equity') || article.category.name.toLowerCase().includes('cyber') || article.category.name.toLowerCase().includes('security') ? '#00897b' : '#0052cc')
    : '#0052cc';

  return (
    <Link 
      to={`/article/${article.slug}`} 
      className="bg-white border border-gray-200 flex flex-col group cursor-pointer h-full"
    >
      <div className="w-full aspect-[16/9] overflow-hidden block shrink-0">
        <img 
          src={article.coverImage || fallbackImage} 
          alt={article.category?.name || 'Category'} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ease-out"
        />
      </div>
      
      <div className="flex-grow flex flex-col p-6">
        <span className="text-[13px] font-medium mb-1.5" style={{ color: catColor }}>
          {article.category?.name || 'General'}
        </span>
        <h3 className="text-[20px] font-bold text-[#001a4d] leading-[1.3] group-hover:text-[#0052cc] transition-colors line-clamp-2 mb-4">
          {article.title}
        </h3>
        <p className="text-[15px] text-[#4a4a4a] line-clamp-3 mb-8 leading-[1.6]">
          {article.excerpt || "Immerse yourself in the world of strategy and wealth creation. Discover the beauty, diversity, and impact of exclusive market intelligence."}
        </p>
        <div className="mt-auto text-[#0052cc] text-[15px] font-bold flex items-center gap-1.5 hover:underline w-max">
          Read more <span className="text-[17px] font-bold mb-px">&gt;</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
