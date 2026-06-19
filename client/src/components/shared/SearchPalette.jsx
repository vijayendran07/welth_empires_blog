import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

const SearchPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ articles: [], authors: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setResults({ articles: [], authors: [], categories: [] });
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      // Handle cmd+k or ctrl+k to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // This logic would ideally be in a parent component managing the `isOpen` state.
          // But placing it here as a fallback or example
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isOpen]);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (!query.trim()) {
        setResults({ articles: [], authors: [], categories: [] });
        return;
      }

      setIsSearching(true);
      try {
        const [artRes, catRes, userRes] = await Promise.all([
          api.get('/articles'),
          api.get('/categories'),
          api.get('/users').catch(() => ({ data: [] }))
        ]);

        const q = query.toLowerCase();
        
        setResults({
          articles: artRes.data.filter(a => a.published && (a.title?.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q))).slice(0, 5),
          categories: catRes.data.filter(c => c.name?.toLowerCase().includes(q)).slice(0, 3),
          authors: userRes.data.filter(u => (u.role === 'ADMIN' || u.role === 'AUTHOR') && u.name?.toLowerCase().includes(q)).slice(0, 3)
        });
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  if (!isOpen) return null;

  const handleResultClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[70vh] overflow-hidden border border-outline-variant animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="flex items-center px-6 py-4 border-b border-outline-variant">
          <span className="material-symbols-outlined text-secondary text-[24px]">search</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 text-[18px] text-primary px-4 font-interface-body placeholder:text-outline"
            placeholder="Search strategy, markets, analysts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                if (results.articles.length > 0) handleResultClick(`/article/${results.articles[0].slug}`);
                else if (results.categories.length > 0) handleResultClick(`/category/${results.categories[0].slug}`);
              }
            }}
          />
          <button onClick={onClose} className="text-[12px] font-bold text-secondary bg-surface-container px-2 py-1 rounded">ESC</button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-surface">
          {!query.trim() ? (
            <div className="py-8 text-center text-secondary">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">manage_search</span>
              <p className="font-interface-body">Start typing to search our intelligence archive.</p>
              
              <div className="mt-8 max-w-sm mx-auto text-left">
                <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Asset Protection', 'Offshore Trusts', 'Julian Vane', 'Tax Havens', 'Market Outlook 2024'].map(term => (
                    <button key={term} onClick={() => setQuery(term)} className="px-3 py-1.5 bg-surface-container hover:bg-outline-variant text-primary text-[13px] rounded-full transition-colors">
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isSearching ? (
            <div className="py-8 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.articles.length === 0 && results.categories.length === 0 && results.authors.length === 0 && (
                <div className="py-8 text-center text-secondary">No results found for "{query}"</div>
              )}

              {/* Articles Group */}
              {results.articles.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-3 px-2">Publications</p>
                  <div className="space-y-1">
                    {results.articles.map(article => (
                      <button key={article.id} onClick={() => handleResultClick(`/article/${article.slug}`)} className="w-full text-left flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container transition-colors group">
                        <div className="w-12 h-12 rounded-lg bg-surface-variant overflow-hidden flex-shrink-0">
                          <img src={article.coverImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-bold text-[15px] text-primary truncate">{article.title}</h4>
                          <p className="text-[12px] text-secondary truncate">{article.category?.name || 'Editorial'} • {article.author?.name || 'Board'}</p>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">arrow_forward</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Group */}
              {results.categories.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-3 px-2">Sectors</p>
                  <div className="grid grid-cols-2 gap-2">
                    {results.categories.map(cat => (
                      <button key={cat.id} onClick={() => handleResultClick(`/category/${cat.slug}`)} className="text-left p-3 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px] text-secondary">category</span>
                        <span className="font-bold text-[14px] text-primary">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Authors Group */}
              {results.authors.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-3 px-2">Strategists</p>
                  <div className="grid grid-cols-2 gap-2">
                    {results.authors.map(author => (
                      <button key={author.id} onClick={() => handleResultClick(`/author/${author.id}`)} className="text-left p-3 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-variant">
                          <img src={author.avatarUrl || `https://ui-avatars.com/api/?name=${author.name}&background=131b2e&color=fff`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-bold text-[14px] text-primary block truncate">{author.name}</span>
                          <span className="text-[11px] text-secondary uppercase tracking-wider block truncate">{author.role}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-surface-container-lowest p-4 border-t border-outline-variant flex justify-between items-center text-[12px] text-secondary font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant font-mono">↑</kbd><kbd className="bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant font-mono">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant font-mono">↵</kbd> to select</span>
          </div>
          <div className="flex items-center gap-2">
            Wealth Empires Search
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPalette;
