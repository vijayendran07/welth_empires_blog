import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { FiCalendar, FiDownload, FiGlobe, FiUsers } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const sixMonthsData = [
  { name: 'Jan', views: 2400 },
  { name: 'Feb', views: 3200 },
  { name: 'Mar', views: 2800 },
  { name: 'Apr', views: 4100 },
  { name: 'May', views: 3800 },
  { name: 'Jun', views: 5200 },
];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Last 7 days');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-secondary">Loading analytics data...</div>;
  if (error) return <div className="p-8 text-error">{error}</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display-xl text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight mb-2 leading-tight">
            Audience <span className="text-[#0052cc] italic font-normal">Analytics</span>
          </h1>
          <p className="text-gray-500 text-[14px]">Deep dive into readership metrics, engagement, and conversion tracking.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors border border-gray-200 text-[14px]">
            <FiCalendar className="text-[18px]" />
            Last 30 Days
          </button>
          <button className="bg-[#0052cc] text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0040a3] transition-colors shadow-sm text-[14px]">
            <FiDownload className="text-[18px]" />
            Export CSV
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display-xl text-[20px] font-bold text-gray-900">Readership Growth</h3>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-100 border-none text-[13px] font-bold text-gray-600 rounded-lg px-3 py-1.5 cursor-pointer outline-none hover:bg-gray-200 transition-colors"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="6 months">6 months</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-0 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filter === 'Last 7 days' ? data.trafficTrend : sixMonthsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#fff', backgroundColor: '#111827', fontWeight: 'bold' }} itemStyle={{color: '#fff'}} />
                <Bar dataKey="views" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {(filter === 'Last 7 days' ? data.trafficTrend : sixMonthsData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="font-display-xl text-[20px] font-bold text-gray-900 mb-6">Platform Overview</h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <div className="flex justify-between text-[13px] font-bold text-gray-700 mb-2">
                <span>Total Views</span>
                <span>{data.totalViews.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#137333] w-[100%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] font-bold text-gray-700 mb-2">
                <span>Total Articles</span>
                <span>{data.totalArticles.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0052cc] w-[100%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] font-bold text-gray-700 mb-2">
                <span>Published Articles</span>
                <span>{data.publishedArticles.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0052cc]/70" style={{ width: `${(data.publishedArticles / (data.totalArticles || 1)) * 100}%` }} rounded-full></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px] font-bold text-gray-700 mb-2">
                <span>Active Authors</span>
                <span>{data.authorsCount.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1da1f2] w-[100%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-display-xl text-[20px] font-bold text-gray-900">Content by Category</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {data.categories.length > 0 ? data.categories.map((cat, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[14px] text-gray-400 font-bold w-4">{idx + 1}.</span>
                  <div>
                    <p className="font-bold text-[14px] text-gray-900">{cat.name}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-bold text-[14px] text-gray-900">{cat.count}</span>
                  <span className="text-[10px] text-gray-500 font-medium">Articles</span>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500 font-bold">No categories found</div>
            )}
          </div>
        </div>

        {/* Author Contributions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-display-xl text-[20px] font-bold text-gray-900">Platform Structure</h3>
          </div>
          <div className="p-6">
            <div className="w-full aspect-[2/1] bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-500 mb-6 border-2 border-gray-200 border-dashed">
              <FiUsers className="text-[32px] text-[#0052cc] mb-2" />
              <span className="font-bold text-[14px]">Team Overview</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Authors</span>
                <span className="text-[24px] font-display-xl font-bold text-[#0052cc]">{data.authorsCount}</span>
              </div>
              <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Avg. Articles/Author</span>
                <span className="text-[24px] font-display-xl font-bold text-[#0052cc]">
                  {data.authorsCount > 0 ? (data.totalArticles / data.authorsCount).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
