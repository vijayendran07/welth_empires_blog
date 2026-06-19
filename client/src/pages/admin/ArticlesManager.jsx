import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import useAuthStore from '../../store/useAuthStore';
import { FiPlus, FiSearch, FiFileText, FiEye, FiMessageSquare, FiExternalLink, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ArticlesManager = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { user } = useAuthStore();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/articles');
      setArticles(res.data);
    } catch (error) {
      console.error('Failed to fetch articles', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await api.delete(`/articles/${id}`);
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete article', error);
      alert('Failed to delete article.');
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display-xl text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight mb-2 leading-tight">
            Editorial <span className="text-[#0052cc] italic font-normal">Publications</span>
          </h1>
          <p className="text-gray-500 text-[14px]">Manage your editorial archive, drafts, and live content.</p>
        </div>
        <Link 
          to="/admin/articles/new" 
          className="bg-[#0052cc] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0040a3] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap text-[14px]"
        >
          <FiPlus className="text-[20px]" />
          New Draft
        </Link>
      </header>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]" />
          <input 
            type="text"
            placeholder="Search publications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#0052cc] focus:ring-0 rounded-xl text-[13.5px] transition-all outline-none"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <button className="px-4 py-2 bg-blue-50 text-[#0052cc] text-[13px] font-bold rounded-lg whitespace-nowrap transition-colors">All ({(articles.length)})</button>
          <button className="px-4 py-2 hover:bg-gray-50 text-gray-500 text-[13px] font-bold rounded-lg transition-colors whitespace-nowrap">Published</button>
          <button className="px-4 py-2 hover:bg-gray-50 text-gray-500 text-[13px] font-bold rounded-lg transition-colors whitespace-nowrap">Drafts</button>
        </div>
      </div>

      <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="p-4 pl-6 text-gray-500 uppercase tracking-widest text-[11px] font-bold">Publication</th>
                <th className="p-4 text-gray-500 uppercase tracking-widest text-[11px] font-bold">Sector</th>
                <th className="p-4 text-gray-500 uppercase tracking-widest text-[11px] font-bold">Status</th>
                <th className="p-4 text-gray-500 uppercase tracking-widest text-[11px] font-bold">Metrics</th>
                <th className="p-4 pr-6 text-gray-500 uppercase tracking-widest text-[11px] font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex justify-center"><div className="w-8 h-8 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <FiFileText className="mx-auto text-[48px] text-gray-300 mb-4" />
                    <p className="text-gray-900 font-bold text-[16px]">No publications found.</p>
                    <p className="text-gray-500 text-[13.5px] mt-1">Try adjusting your search filters or create a new draft.</p>
                  </td>
                </tr>
              ) : (
                paginatedArticles.map(article => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex gap-5 items-center">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 hidden sm:block">
                          <img src={article.coverImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80'} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-bold text-[15px] md:text-[16px] text-gray-900 mb-1.5 line-clamp-1 group-hover:text-[#0052cc] transition-colors">{article.title}</p>
                          <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                            <span>{article.author?.name || 'Unknown Author'}</span>
                            <span>•</span>
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {article.category ? (
                        <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg text-[12px] text-gray-700 font-bold border border-gray-200 shadow-sm">
                          {article.category.name}
                        </span>
                      ) : (
                        <span className="text-[12px] text-gray-400 italic">Uncategorized</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold border shadow-sm ${article.published ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                        <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current opacity-75"></span>
                        {article.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-[13px] font-bold text-gray-500">
                        <span className="flex items-center gap-1" title="Views"><FiEye className="text-[14px]" /> {article.views || 0}</span>
                        <span className="flex items-center gap-1" title="Comments"><FiMessageSquare className="text-[14px]" /> {article._count?.comments || 0}</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/article/${article.slug}`} 
                          target="_blank"
                          className="w-8 h-8 flex items-center justify-center text-gray-500 bg-white border border-gray-200 shadow-sm rounded-lg hover:text-[#0052cc] hover:border-[#0052cc] transition-all"
                          title="View Live"
                        >
                          <FiExternalLink className="text-[16px]" />
                        </Link>
                        {(user?.role === 'ADMIN' || user?.id === article.authorId) && (
                          <>
                            <Link 
                              to={`/admin/articles/edit/${article.id}`} 
                              className="w-8 h-8 flex items-center justify-center text-gray-500 bg-white border border-gray-200 shadow-sm rounded-lg hover:text-[#0052cc] hover:border-[#0052cc] transition-all"
                              title="Edit"
                            >
                              <FiEdit2 className="text-[16px]" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(article.id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 bg-white border border-gray-200 shadow-sm rounded-lg hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-all"
                              title="Delete"
                            >
                              <FiTrash2 className="text-[16px]" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
            <span className="text-[13px] text-gray-500 font-bold">
              Showing <span className="text-gray-900">{startIndex + 1}</span> to <span className="text-gray-900">{Math.min(startIndex + itemsPerPage, filteredArticles.length)}</span> of <span className="text-gray-900">{filteredArticles.length}</span> publications
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-[#0052cc] hover:border-[#0052cc] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
              >
                <FiChevronLeft className="text-[18px]" />
              </button>
              <span className="text-[13px] font-bold text-gray-700 mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-[#0052cc] hover:border-[#0052cc] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
              >
                <FiChevronRight className="text-[18px]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesManager;
