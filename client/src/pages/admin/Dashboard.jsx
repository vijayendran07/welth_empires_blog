import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { FiEye, FiTrendingUp, FiFileText, FiFolder, FiShield, FiArrowRight, FiEdit2, FiImage, FiUsers } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';


const Dashboard = () => {
  const [stats, setStats] = useState({
    articles: 0,
    categories: 0,
    tags: 0,
    users: 0,
    views: 0
  });
  const [trafficTrend, setTrafficTrend] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [postGrowthData, setPostGrowthData] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [postGrowthFilter, setPostGrowthFilter] = useState('6 months');
  const [trafficFilter, setTrafficFilter] = useState('Last 7 days');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [articlesRes, categoriesRes, tagsRes, usersRes, analyticsRes, messagesRes] = await Promise.all([
          api.get('/articles'),
          api.get('/categories'),
          api.get('/tags'),
          api.get('/users').catch(() => ({ data: [] })),
          api.get('/analytics').catch(() => ({ data: { totalViews: 0, trafficTrend: [] } })),
          api.get('/messages').catch(() => ({ data: [] }))
        ]);

        setStats(prev => ({
          ...prev,
          articles: articlesRes.data.length,
          categories: categoriesRes.data.length,
          tags: tagsRes.data.length,
          users: usersRes.data.length,
          views: analyticsRes.data.totalViews || 0
        }));

        setTrafficTrend(analyticsRes.data.trafficTrend || []);
        setRecentArticles(articlesRes.data.slice(0, 5));
        setRecentMessages(messagesRes.data.slice(0, 4));
        setAllArticles(articlesRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (allArticles.length === 0) {
      if (!isLoading) {
        // Just fill with 0s if no articles but loaded
        if (postGrowthFilter === '6 months') {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const currentMonthIndex = new Date().getMonth();
          const growthData = [];
          for (let i = 5; i >= 0; i--) {
            let monthIndex = currentMonthIndex - i;
            if (monthIndex < 0) monthIndex += 12;
            growthData.push({ name: months[monthIndex], posts: 0 });
          }
          setPostGrowthData(growthData);
        } else {
          const growthData = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            growthData.push({ name: date.toLocaleDateString('en-US', { weekday: 'short' }), posts: 0 });
          }
          setPostGrowthData(growthData);
        }
      }
      return;
    }

    if (postGrowthFilter === '6 months') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonthIndex = new Date().getMonth();
      const growthData = [];
      for (let i = 5; i >= 0; i--) {
        let monthIndex = currentMonthIndex - i;
        let yearOffset = 0;
        if (monthIndex < 0) {
          monthIndex += 12;
          yearOffset = -1;
        }
        const targetMonth = monthIndex;
        const targetYear = new Date().getFullYear() + yearOffset;
        
        const count = allArticles.filter(article => {
          const date = new Date(article.createdAt);
          return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
        }).length;
        
        growthData.push({ name: months[targetMonth], posts: count });
      }
      setPostGrowthData(growthData);
    } else if (postGrowthFilter === 'Last 7 days') {
      const growthData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const targetDate = date.toLocaleDateString();
        
        const count = allArticles.filter(article => {
          return new Date(article.createdAt).toLocaleDateString() === targetDate;
        }).length;
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        growthData.push({ name: dayName, posts: count });
      }
      setPostGrowthData(growthData);
    }
  }, [allArticles, postGrowthFilter, isLoading]);

  useEffect(() => {
    if (allArticles.length === 0) {
      if (!isLoading) {
        if (trafficFilter === '6 months') {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const currentMonthIndex = new Date().getMonth();
          const viewData = [];
          for (let i = 5; i >= 0; i--) {
            let monthIndex = currentMonthIndex - i;
            if (monthIndex < 0) monthIndex += 12;
            viewData.push({ name: months[monthIndex], views: 0 });
          }
          setTrafficTrend(viewData);
        } else {
          const viewData = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            viewData.push({ name: date.toLocaleDateString('en-US', { weekday: 'short' }), views: 0 });
          }
          setTrafficTrend(viewData);
        }
      }
      return;
    }

    if (trafficFilter === '6 months') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonthIndex = new Date().getMonth();
      const viewData = [];
      for (let i = 5; i >= 0; i--) {
        let monthIndex = currentMonthIndex - i;
        let yearOffset = 0;
        if (monthIndex < 0) {
          monthIndex += 12;
          yearOffset = -1;
        }
        const targetMonth = monthIndex;
        const targetYear = new Date().getFullYear() + yearOffset;
        
        const views = allArticles.filter(article => {
          const date = new Date(article.createdAt);
          return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
        }).reduce((sum, article) => sum + (article.views || 0), 0);
        
        viewData.push({ name: months[targetMonth], views: views });
      }
      setTrafficTrend(viewData);
    } else if (trafficFilter === 'Last 7 days') {
      const viewData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const targetDate = date.toLocaleDateString();
        
        const views = allArticles.filter(article => {
          return new Date(article.createdAt).toLocaleDateString() === targetDate;
        }).reduce((sum, article) => sum + (article.views || 0), 0);
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        viewData.push({ name: dayName, views: views });
      }
      setTrafficTrend(viewData);
    }
  }, [allArticles, trafficFilter, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="font-display-xl text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight mb-2 leading-tight">
          Command <span className="text-[#0052cc] italic font-normal">Center</span>
        </h1>
        <p className="text-gray-500 text-[14px]">Monitor platform metrics and manage your editorial empire.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0052cc]/30 transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Total Views</span>
            <FiEye className="text-[#0052cc] text-[24px]" />
          </div>
          <div className="relative z-10">
            <span className="font-display-xl text-[40px] font-bold text-gray-900 leading-none block mb-1">{(stats.views).toLocaleString()}</span>
            <span className="text-[12px] font-bold text-[#137333] flex items-center gap-1"><FiTrendingUp className="text-[14px]" /> +12.5% this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0052cc]/30 transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Publications</span>
            <FiFileText className="text-[#0052cc] text-[24px]" />
          </div>
          <div className="relative z-10">
            <span className="font-display-xl text-[40px] font-bold text-gray-900 leading-none block mb-1">{stats.articles}</span>
            <span className="text-[12px] text-gray-500">Across {stats.categories} sectors</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0052cc]/30 transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Sectors</span>
            <FiFolder className="text-[#0052cc] text-[24px]" />
          </div>
          <div className="relative z-10">
            <span className="font-display-xl text-[40px] font-bold text-gray-900 leading-none block mb-1">{stats.categories}</span>
            <span className="text-[12px] text-gray-500">Categories</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0052cc]/30 transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Authors</span>
            <FiShield className="text-[#0052cc] text-[24px]" />
          </div>
          <div className="relative z-10">
            <span className="font-display-xl text-[40px] font-bold text-gray-900 leading-none block mb-1">{stats.users}</span>
            <span className="text-[12px] text-gray-500">Active contributors</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Post Growth */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[400px] [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-[18px] text-gray-900 mb-2">Post Growth</h3>
              <div className="flex items-center gap-2 text-[14px] text-gray-600 font-medium">
                <span className="w-4 h-4 rounded bg-[#3b82f6]"></span> Total number of posts
              </div>
            </div>
            <select 
              value={postGrowthFilter}
              onChange={(e) => setPostGrowthFilter(e.target.value)}
              className="bg-gray-100 border-none text-[13px] font-bold text-gray-600 rounded-lg px-3 py-1.5 cursor-pointer outline-none hover:bg-gray-200 transition-colors"
            >
              <option value="6 months">6 months</option>
              <option value="Last 7 days">Last 7 days</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postGrowthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} style={{ outline: 'none' }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 13, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 13, fontWeight: 500}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#fff', backgroundColor: '#111827', fontWeight: 'bold' }} itemStyle={{color: '#fff'}} />
                <Bar dataKey="posts" radius={[4, 4, 0, 0]} maxBarSize={50} tabIndex={-1} style={{ outline: 'none' }}>
                  {postGrowthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" style={{ outline: 'none' }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Trend */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[400px] [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-[18px] text-gray-900 mb-3">Traffic Trend</h3>
              <div className="flex items-center gap-5 text-[14px] text-gray-600 font-medium">
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#2563eb]"></span> Page Views</div>
              </div>
            </div>
            <select 
              value={trafficFilter}
              onChange={(e) => setTrafficFilter(e.target.value)}
              className="bg-gray-100 border-none text-[13px] font-bold text-gray-600 rounded-lg px-3 py-1.5 cursor-pointer outline-none hover:bg-gray-200 transition-colors"
            >
              <option value="6 months">6 months</option>
              <option value="Last 7 days">Last 7 days</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 13, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 13, fontWeight: 500}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Posts */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="px-6 py-5">
            <h3 className="font-bold text-[18px] text-gray-900">Latest Posts</h3>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead className="bg-[#f8fafc] text-[13px] font-bold text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[14px] text-gray-700 font-medium bg-white">
                {recentArticles.length > 0 ? (
                  recentArticles.slice(0, 4).map(article => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">{article.title}</td>
                      <td className="px-6 py-4">
                        <span className={article.published ? 'text-[#16a34a]' : 'text-[#d97706]'}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(article.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                      <td className="px-6 py-4 text-gray-400">...</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No articles yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="px-6 py-5">
            <h3 className="font-bold text-[18px] text-gray-900">Recent Messages</h3>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead className="bg-[#f8fafc] text-[13px] font-bold text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Author</th>
                  <th className="px-6 py-3 font-medium">Message Preview</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[14px] text-gray-700 font-medium bg-white">
                {recentMessages.length > 0 ? (
                  recentMessages.map(msg => (
                    <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">{msg.name}</td>
                      <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">{msg.message}</td>
                      <td className="px-6 py-4">{new Date(msg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                      <td className="px-6 py-4 text-center">
                        <Link to="/admin/messages" className="bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] font-bold text-[12px] px-4 py-1.5 rounded-full transition-colors inline-block">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No new messages</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
