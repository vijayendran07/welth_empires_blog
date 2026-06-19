import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/axios';
import ArticleCard from '../../../components/cards/ArticleCard';

const AuthorProfile = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAuthorData = async () => {
      try {
        setIsLoading(true);
        const [usersRes, articlesRes] = await Promise.all([
          api.get('/users').catch(() => ({ data: [] })),
          api.get('/articles')
        ]);
        
        if (id && id.startsWith('guest-')) {
          const guestName = decodeURIComponent(id.replace('guest-', ''));
          const guestArticles = articlesRes.data.filter(a => a.customAuthorName === guestName && a.published);
          
          if (guestArticles.length > 0) {
            const firstArticle = guestArticles[0];
            setAuthor({
              id: id,
              name: firstArticle.customAuthorName,
              bio: firstArticle.customAuthorBio,
              avatarUrl: firstArticle.customAuthorAvatar,
              role: 'GUEST',
              createdAt: firstArticle.createdAt
            });
            setArticles(guestArticles);
          }
        } else {
          const foundAuthor = usersRes.data.find(u => u.id === id);
          setAuthor(foundAuthor);
          
          if (foundAuthor) {
            const authorArticles = articlesRes.data.filter(a => a.authorId === foundAuthor.id && a.published);
            setArticles(authorArticles);
          }
        }
      } catch (error) {
        console.error('Failed to fetch author data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-white">
        <h1 className="text-[48px] font-bold text-[#0052cc] font-display-xl">404</h1>
        <p className="text-gray-500 text-interface-body">Author not found.</p>
        <Link to="/" className="text-[#0052cc] font-bold hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-8 font-interface-body">
      {/* Author Banner */}
      <section className="relative w-full">
        <div className="w-full h-[200px] lg:h-[250px] overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/5 mix-blend-multiply z-10"></div>
          <img 
            alt="Corporate background" 
            className="w-full h-full object-cover grayscale brightness-[0.5] transition-transform duration-1000 hover:scale-103" 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
          />
        </div>
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-20">
          <div className="flex flex-col md:flex-row items-end gap-6 -mt-8 md:-mt-20">
            <div className="w-40 h-40 rounded-full border-[6px] border-white overflow-hidden bg-gray-50 shadow-sm flex-shrink-0">
              <img 
                alt={author.name} 
                className="w-full h-full object-cover" 
                src={author.avatarUrl || `https://ui-avatars.com/api/?name=${author.name}&background=0052cc&color=fff&size=256`} 
              />
            </div>
            
            <div className="flex-1 pb-4 bg-white p-6 rounded-[24px] shadow-sm w-full md:w-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="font-display-xl text-[32px] md:text-[44px] font-bold text-gray-900 leading-tight mb-2">
                    {author.name}
                  </h1>
                  <p className="text-[#0052cc] font-bold tracking-widest uppercase text-[11px] mb-4">
                    {author.role === 'ADMIN' ? 'Editor-in-Chief & Lead Strategist' : author.role === 'GUEST' ? 'Guest Contributor' : 'Senior Contributor'}
                  </p>
                  <p className="text-gray-500 text-[14.5px] max-w-2xl leading-relaxed font-normal">
                    {author.bio || "Specializing in macroeconomic trends, corporate structuring, and borderless wealth preservation. An authority on modern financial strategy."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-[#0052cc] border border-gray-200 flex items-center justify-center transition-all" title="Website">
                    <span className="material-symbols-outlined text-[18px]">public</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-[#0052cc] border border-gray-200 flex items-center justify-center transition-all" title="Email">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Analytics/Metrics Strip */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 mt-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
          <div className="text-center md:text-left md:px-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Articles Published</p>
            <p className="font-display-xl text-[28px] md:text-[32px] font-bold text-[#0052cc]">{articles.length}</p>
          </div>
          <div className="text-center md:text-left md:px-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Readers</p>
            <p className="font-display-xl text-[28px] md:text-[32px] font-bold text-[#0052cc]">{(articles.length * 1240).toLocaleString()}+</p>
          </div>
          <div className="text-center md:text-left md:px-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Join Date</p>
            <p className="font-display-xl text-[20px] md:text-[24px] font-bold text-[#0052cc] leading-[40px]">
              {new Date(author.createdAt).getFullYear()}
            </p>
          </div>
          <div className="text-center md:text-left md:px-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Expertise</p>
            <p className="font-display-xl text-[15px] font-bold text-[#0052cc] leading-tight mt-3">Macro & Policy</p>
          </div>
        </div>
      </section>

      {/* Author Articles */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-bold text-[16px] text-gray-900 uppercase tracking-wider">Recent Publications</h2>
          <div className="text-gray-450 font-bold text-[13px] tracking-wide uppercase">
            {articles.length} items
          </div>
        </div>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-16 rounded-[24px] border border-gray-150 text-center">
            <span className="material-symbols-outlined text-[48px] text-gray-300 mb-4">edit_document</span>
            <h3 className="font-display-xl text-[22px] font-bold text-gray-900 mb-2">No publications yet</h3>
            <p className="text-gray-500 max-w-md mx-auto text-[14px]">
              This author hasn't published any articles yet. Check back soon for their latest intelligence.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AuthorProfile;
