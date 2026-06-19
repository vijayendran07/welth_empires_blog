import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../../lib/axios';
import ArticleCard from '../../../components/cards/ArticleCard';


const categoriesList = [
  { id: 'incorporation', name: 'Incorporation' },
  { id: 'compliance', name: '360° Compliance' },
  { id: 'trademark', name: 'Trademark' },
  { id: 'taxes', name: 'Taxes' }
];

const ArticleListing = () => {
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState('all');
  const [contentType, setContentType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, dateRange, contentType]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const [articlesRes] = await Promise.all([
          api.get('/articles').catch(() => ({ data: [] }))
        ]);
        
        // Use actual categories from the database
        const dbArticles = (articlesRes.data || []).filter(a => a.published).map(art => {
          let catName = art.category?.name || 'Uncategorized';
          let catId = art.category?.slug || art.category?.id || 'uncategorized';
          
          return {
            ...art,
            categoryId: catId,
            category: { id: catId, name: catName }
          };
        });

        // Use only db articles
        setArticles(dbArticles);
      } catch (error) {
        console.error('Failed to fetch articles', error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleCategoryToggle = (catId) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (article.category?.name && article.category.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(article.categoryId);
    return matchesSearch && matchesCategory;
  });

  const ITEMS_PER_PAGE = 12; // 4 rows of 3 columns
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const currentArticles = filteredArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-[#fafafc] min-h-screen pb-6 font-interface-body">
      {/* Centered Header */}
      <header className="relative w-full pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden flex flex-col items-center justify-center border-b border-gray-200">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1605280263929-1c42c62ef169?auto=format&fit=crop&q=80&w=2000" alt="Financial district" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#001a4d]/85"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full mt-4">
          <h1 className="font-serif text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] font-bold text-white leading-[1.1] mb-4 md:mb-8 tracking-tight">
            Empower Your Wealth Journey
          </h1>

          {/* Pill-shaped Search Box */}
          <form onSubmit={(e) => e.preventDefault()} className="flex max-w-[680px] mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1 sm:p-1.5 items-center mt-4 md:mt-8 shadow-lg focus-within:bg-white focus-within:border-white transition-all group">
            <span className="material-symbols-outlined text-white/70 pl-3 sm:pl-4 pr-1 sm:pr-2 text-[18px] sm:text-[20px] font-bold group-focus-within:text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-transparent text-[14px] sm:text-[15px] text-white focus:text-gray-900 focus:outline-none placeholder-white/60 group-focus-within:placeholder-gray-400 py-2.5 sm:py-3 font-medium transition-colors min-w-0"
            />
            <button 
              type="submit" 
              className="bg-white text-[#001a4d] hover:bg-gray-100 font-bold text-[12px] sm:text-[13px] tracking-wider uppercase px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Showing results count subtitle */}
          <div className="mt-4 md:mt-8 text-[12px] sm:text-[14px] text-white/80 font-medium flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span>Showing <span className="font-bold text-white">{filteredArticles.length}</span> results for "{searchQuery || 'All'}"</span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Filters Active ({selectedCategories.length + (dateRange !== 'all' ? 1 : 0) + (contentType !== 'all' ? 1 : 0)})</span>
            <span className="text-white/40">•</span>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategories([]); setDateRange('all'); setContentType('all'); }}
              className="hover:text-white hover:underline cursor-pointer transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </header>

      {/* Horizontal divider */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="border-t border-gray-200/80 w-full mt-4 mb-6 md:mb-10"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col gap-4 md:gap-8">
        
        {/* Slim Horizontal Filter Bar */}
        <div className="bg-white px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 mb-4 md:mb-8">
          
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 w-full lg:w-auto overflow-x-auto pb-1 scrollbar-hide">
            <span className="font-bold tracking-widest text-[12px] sm:text-[13px] uppercase text-[#001a4d] flex items-center gap-1.5 sm:gap-2 mr-1 sm:mr-2 flex-shrink-0">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">tune</span>
              Filters
            </span>

            {/* Category Dropdown (Multi-select) */}
            <div className="relative group flex-shrink-0">
              <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 hover:border-[#0052cc] rounded-lg sm:rounded-xl text-[12px] sm:text-[13px] font-bold text-gray-700 transition-all shadow-sm whitespace-nowrap">
                Category
                {selectedCategories.length > 0 && (
                  <span className="bg-[#0052cc] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center ml-1">
                    {selectedCategories.length}
                  </span>
                )}
                <span className="material-symbols-outlined text-[18px] text-gray-400">expand_more</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-150 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 translate-y-1 group-hover:translate-y-0">
                <div className="p-4 flex flex-col gap-3.5">
                  {categoriesList.map(cat => (
                    <label key={cat.id} className="flex items-center gap-3 text-[13.5px] text-gray-700 cursor-pointer select-none font-medium hover:text-[#0052cc] transition-colors">
                      <input 
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Range Dropdown */}
            <div className="relative group flex-shrink-0">
              <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 hover:border-[#0052cc] rounded-lg sm:rounded-xl text-[12px] sm:text-[13px] font-bold text-gray-700 transition-all shadow-sm whitespace-nowrap">
                {dateRange === 'all' ? 'All Time' : dateRange === '24h' ? 'Last 24 Hours' : dateRange === 'week' ? 'Last Week' : 'Last Month'}
                <span className="material-symbols-outlined text-[18px] text-gray-400">expand_more</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-150 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 translate-y-1 group-hover:translate-y-0">
                <div className="p-4 flex flex-col gap-3.5">
                  {[{ id: 'all', name: 'All Time' }, { id: '24h', name: 'Last 24 Hours' }, { id: 'week', name: 'Last Week' }, { id: 'month', name: 'Last Month' }].map(date => (
                    <label key={date.id} className="flex items-center gap-3 text-[13.5px] text-gray-700 cursor-pointer select-none font-medium hover:text-[#0052cc] transition-colors">
                      <input 
                        type="radio"
                        name="date-range"
                        checked={dateRange === date.id}
                        onChange={() => setDateRange(date.id)}
                        className="w-4.5 h-4.5 text-[#0052cc] focus:ring-[#0052cc] border-gray-300 cursor-pointer"
                      />
                      <span>{date.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Type Dropdown */}
            <div className="relative group flex-shrink-0">
              <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 hover:border-[#0052cc] rounded-lg sm:rounded-xl text-[12px] sm:text-[13px] font-bold text-gray-700 transition-all capitalize shadow-sm whitespace-nowrap">
                {contentType === 'all' ? 'All Content' : contentType}
                <span className="material-symbols-outlined text-[18px] text-gray-400">expand_more</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-gray-150 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 translate-y-1 group-hover:translate-y-0">
                <div className="p-2 flex flex-col gap-1">
                  {['All', 'Articles', 'Videos', 'Podcasts', 'Guides'].map(type => {
                    const isActive = (contentType === 'all' && type === 'All') || contentType === type.toLowerCase();
                    return (
                      <button
                        key={type}
                        onClick={() => setContentType(type === 'All' ? 'all' : type.toLowerCase())}
                        className={`text-left px-3 py-2.5 rounded-lg text-[13px] font-bold transition-colors cursor-pointer ${
                          isActive ? 'bg-blue-50 text-[#0052cc]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#0052cc]'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Sort & Layout */}
          <div className="flex items-center gap-3 sm:gap-6 text-[12px] sm:text-[13px] font-medium w-full lg:w-auto mt-2 lg:mt-0 justify-between lg:justify-end border-t border-gray-100 lg:border-0 pt-3 lg:pt-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Sort by:</span>
              <select className="border border-gray-200 rounded-lg py-1.5 px-3 text-gray-900 bg-gray-50 hover:bg-white hover:border-[#0052cc] transition-colors focus:outline-none focus:ring-1 focus:ring-[#0052cc] cursor-pointer font-bold shadow-sm">
                <option>Latest</option>
                <option>Oldest</option>
                <option>Trending</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-0.5 shadow-sm">
                <button className="p-1.5 rounded hover:bg-white text-gray-400 hover:text-[#0052cc] transition-colors cursor-pointer flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">view_list</span>
                </button>
                <button className="p-1.5 rounded bg-white shadow-sm border border-gray-200 text-[#0052cc] cursor-pointer flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Links Banner */}
        <div className="w-full bg-[#002b7f] rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-4 md:mb-8 text-white shadow-sm border border-transparent">
          <h3 className="font-bold text-[16px] sm:text-[18px] mb-5 font-interface-body">Click on a topic below to dive in via dedicated pages</h3>
          <div className="flex flex-wrap gap-3">
            {[
              'testing', 'Real Estate', 'Crypto & Policy', 'Taxes', 
              'Incorporation', 'Trademark', '360° Compliance', 
              'Global Markets', 'Wealth Strategy'
            ].map(topic => (
              <button 
                key={topic}
                className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/30 text-white text-[12px] sm:text-[13px] hover:bg-white/15 hover:border-white transition-all flex items-center gap-2 cursor-pointer font-medium"
              >
                {topic} <span className="text-[10px] sm:text-[11px] font-bold">&gt;</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredArticles.length > 0 ? (
            <>
              {/* Changed to 3 columns on large screens since we removed the left sidebar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {currentArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Centered Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 md:mt-12 mb-6 md:mb-8">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#0052cc] transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[16px] font-bold">chevron_left</span>
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-lg font-bold text-[13px] shadow-sm transition-colors cursor-pointer ${
                          currentPage === i + 1 
                            ? 'bg-[#001a4d] text-white' 
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#0052cc]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#0052cc] transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[16px] font-bold">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-6 sm:p-12 rounded-[16px] sm:rounded-[24px] border border-gray-150 text-center max-w-xl mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[36px] sm:text-[48px] text-gray-300 mb-4 font-bold">search_off</span>
              <h3 className="font-serif text-[22px] sm:text-[28px] font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-6 text-[13px] sm:text-[15px]">We couldn't find any articles matching your search criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategories(['investing', 'real-estate']); }}
                className="px-6 py-2.5 bg-[#001a4d] hover:bg-[#000d26] text-white font-bold rounded-xl text-[13px] transition-colors shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ArticleListing;
