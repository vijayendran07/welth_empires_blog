import { useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { FiGrid, FiFileText, FiImage, FiBarChart2, FiFolder, FiUsers, FiLogOut, FiExternalLink } from 'react-icons/fi';

const AdminLayout = () => {
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafc] font-interface-body">
        <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if authenticated and authorized
  if (!isAuthenticated) {
    return <Navigate to="/?login=true" state={{ from: location }} replace />;
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'AUTHOR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafc] font-interface-body">
        <div className="text-center">
          <h1 className="text-display-xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-500 mb-8">You do not have permission to access the admin dashboard.</p>
          <Link to="/" className="text-[#0052cc] font-bold hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fafafc] font-interface-body">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-gray-100">
          <Link to="/admin" className="font-display-xl text-[24px] font-bold tracking-tight text-gray-900 block leading-none">Wealth Empires</Link>
          <p className="text-gray-400 mt-2 uppercase tracking-widest font-bold text-[10px]">Command Center</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-[13px] group ${location.pathname === '/admin' ? 'bg-[#0052cc] text-white shadow-sm' : 'text-gray-500 hover:bg-blue-50 hover:text-[#0052cc]'}`}>
            <FiGrid className="text-[20px] transition-transform group-hover:scale-110" />
            Dashboard
          </Link>
          <Link to="/admin/articles" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-[13px] group ${location.pathname.startsWith('/admin/articles') ? 'bg-[#0052cc] text-white shadow-sm' : 'text-gray-500 hover:bg-blue-50 hover:text-[#0052cc]'}`}>
            <FiFileText className="text-[20px] transition-transform group-hover:scale-110" />
            Articles
          </Link>

          <Link to="/admin/analytics" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-[13px] group ${location.pathname.startsWith('/admin/analytics') ? 'bg-[#0052cc] text-white shadow-sm' : 'text-gray-500 hover:bg-blue-50 hover:text-[#0052cc]'}`}>
            <FiBarChart2 className="text-[20px] transition-transform group-hover:scale-110" />
            Analytics
          </Link>
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/admin/categories" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-[13px] group ${location.pathname.startsWith('/admin/categories') ? 'bg-[#0052cc] text-white shadow-sm' : 'text-gray-500 hover:bg-blue-50 hover:text-[#0052cc]'}`}>
                <FiFolder className="text-[20px] transition-transform group-hover:scale-110" />
                Categories
              </Link>
              <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-[13px] group ${location.pathname.startsWith('/admin/users') ? 'bg-[#0052cc] text-white shadow-sm' : 'text-gray-500 hover:bg-blue-50 hover:text-[#0052cc]'}`}>
                <FiUsers className="text-[20px] transition-transform group-hover:scale-110" />
                Users
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[#0052cc] shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[13px] text-gray-900 truncate leading-snug">{user.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors font-bold text-[12.5px]"
          >
            <FiLogOut className="text-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-[72px] border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <h2 className="font-display-xl font-bold text-[22px] text-gray-900 tracking-tight">
            {location.pathname === '/admin' ? 'Dashboard Overview' : 
             location.pathname.includes('/articles') ? 'Article Management' : 

             location.pathname.includes('/analytics') ? 'Analytics & Insights' : 
             location.pathname.includes('/users') ? 'User Management' : 'Administration'}
          </h2>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-500 font-bold hover:text-[#0052cc] transition-colors flex items-center gap-1.5 text-[13px] bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-[#0052cc]/30 shadow-sm">
              <FiExternalLink className="text-[16px]" />
              View Live Site
            </Link>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
