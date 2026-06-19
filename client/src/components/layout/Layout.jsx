import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import SearchPalette from '../shared/SearchPalette';
import LoginModal from '../auth/LoginModal';
import useAuthStore from '../../store/useAuthStore';

// Map route patterns to nav label + document title
const NAV_ITEMS = [
  { to: '/',             label: 'Home',    title: 'Home',          match: (p) => p === '/' },
  { to: '/articles',     label: 'Blog',    title: 'Blog',          match: (p) => p === '/articles' || p.startsWith('/article/') || p.startsWith('/category/') || p.startsWith('/author/') },

  { 
    to: '/services/incorporation',
    label: 'Services',  
    title: 'Services',        
    match: (p) => p.startsWith('/services'),
    subItems: [
      { to: '/services/incorporation', label: 'Incorporation' },
      { to: '/services/compliance', label: '360° Compliance' },
      { to: '/services/trademark', label: 'Trademark' },
      { to: '/services/taxes', label: 'Taxes' }
    ]
  },
  { to: '/contact',      label: 'Contact', title: 'Contact Us',    match: (p) => p.startsWith('/contact') },
];

const Layout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Resolve which nav item is active
  const activeItem = NAV_ITEMS.find(item => item.match(location.pathname));

  // Update document <title> on every route change
  useEffect(() => {
    document.title = activeItem
      ? `${activeItem.title} — Wealth Empires`
      : 'Wealth Empires';
  }, [location.pathname, activeItem]);

  // Close search when route changes
  useEffect(() => {
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Command + K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for login URL param to open modal automatically
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('login') === 'true') {
      setAuthMode('login');
      setIsLoginOpen(true);
      // Remove the query param so it doesn't persist on refresh
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  return (
    <div className="font-interface-body text-interface-body overflow-x-hidden min-h-screen flex flex-col bg-[#fafafc]">
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1200px] bg-white/85 backdrop-blur-lg border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full">
        <div className="px-6 md:px-8 py-3 flex justify-between items-center">

          {/* Logo + active page name */}
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[22px] font-bold text-[#0052cc] tracking-tight">Wealth Empires</Link>
            {activeItem && activeItem.label !== 'Home' && (
              <>
                <span className="text-gray-300 text-[18px] font-light select-none">/</span>
                <span className="text-[13px] font-bold text-gray-400 tracking-tight">
                  {activeItem.label}
                </span>
              </>
            )}
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-12 text-[16px] font-bold text-gray-600">
            {NAV_ITEMS.map(({ to, label, match, subItems }) => {
              const isActive = match(location.pathname);
              return (
                <div key={to} className="relative group">
                  <Link
                    to={to}
                    className={`transition-all hover:text-[#0052cc] relative py-1 flex items-center gap-1 ${
                      isActive ? 'text-[#0052cc]' : ''
                    }`}
                  >
                    {label}
                    {subItems && <span className="material-symbols-outlined text-[16px]">expand_more</span>}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0052cc]"></span>
                    )}
                  </Link>
                  {subItems && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-56 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-50">
                      {/* Invisible bridge to keep hover active */}
                      <div className="absolute -top-4 left-0 w-full h-4"></div>
                      {subItems.map((sub, i) => (
                        <Link 
                          key={i} 
                          to={sub.to}
                          className="block px-6 py-2.5 text-[13.5px] font-semibold text-gray-600 hover:text-[#0052cc] hover:bg-blue-50/50 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                {(user.role === 'ADMIN' || user.role === 'AUTHOR') && (
                  <Link to="/admin" className="text-[14px] font-bold text-[#0052cc] hover:text-[#0040a3] transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[#0052cc]">
                    {user.name.charAt(0)}
                  </div>
                  <button onClick={logout} className="text-[13px] font-bold text-gray-500 hover:text-red-600 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={() => { setAuthMode('login'); setIsLoginOpen(true); }} className="text-[14px] font-bold text-gray-600 hover:text-[#0052cc] transition-colors">Sign in</button>
                <button onClick={() => { setAuthMode('register'); setIsLoginOpen(true); }} className="bg-[#001a4d] hover:bg-[#0052cc] text-white font-bold text-[13px] tracking-wider uppercase px-6 py-2.5 rounded-full transition-colors shadow-sm">
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-white">
        <Outlet />
      </main>

      <footer id="footer" className="w-full bg-white border-t border-gray-200 pt-8 pb-8">
        <div className="max-w-[1440px] mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          {/* Col 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0052cc] flex items-center justify-center text-white font-bold">W</div>
              <span className="text-[20px] font-bold text-gray-900">Wealth Empires</span>
            </div>
            <p className="text-gray-500 text-[14px] leading-relaxed max-w-sm">
              Wealth Empires Design, the comprehensive design system solution that revolutionizes the way you create digital experiences.
            </p>
          </div>

          {/* Col 2: Company */}
          <div className="flex flex-col gap-4">
            <h5 className="font-semibold text-gray-900 text-[16px]">Company</h5>
            <div className="flex flex-col gap-3 text-[14px] text-gray-500">
              <Link to="#" className="hover:text-[#0052cc] transition-colors">Terms & Conditions</Link>
              <Link to="#" className="hover:text-[#0052cc] transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-[#0052cc] transition-colors">Project Protection</Link>
              <Link to="#" className="hover:text-[#0052cc] transition-colors">FAQs</Link>
            </div>
          </div>

          {/* Col 3: Help */}
          <div className="flex flex-col gap-4">
            <h5 className="font-semibold text-gray-900 text-[16px]">Help</h5>
            <div className="flex flex-col gap-3 text-[14px] text-gray-500">
              <Link to="#" className="hover:text-[#0052cc] transition-colors">Getting Started</Link>
              <Link to="#" className="hover:text-[#0052cc] transition-colors">Feedback</Link>
              <Link to="#" className="hover:text-[#0052cc] transition-colors">Referral Program</Link>
              <Link to="#" className="hover:text-[#0052cc] transition-colors">Network Status</Link>
              <Link to="#" className="hover:text-[#0052cc] transition-colors">FAQ</Link>
            </div>
          </div>

          {/* Col 4: Email & Socials */}
          <div className="flex flex-col gap-4 col-span-1">
            <h5 className="font-semibold text-gray-900 text-[16px]">Email</h5>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Input Placeholder" 
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:border-[#0052cc] text-gray-900"
              />
              <button className="bg-[#0052cc] hover:bg-[#0040a3] text-white font-bold text-[14px] px-5 py-2 rounded-lg transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <div className="flex gap-4 mt-2 text-gray-400">
              <a href="#" className="hover:text-[#0052cc]"><span className="material-symbols-outlined text-[20px]">language</span></a>
              <a href="#" className="hover:text-[#0052cc]"><span className="material-symbols-outlined text-[20px]">alternate_email</span></a>
              <a href="#" className="hover:text-[#0052cc]"><span className="material-symbols-outlined text-[20px]">share</span></a>
              <a href="#" className="hover:text-[#0052cc]"><span className="material-symbols-outlined text-[20px]">chat</span></a>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-[13px]">© Copyright 2024 Wealth Empires Design. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Global Search Palette */}
      <SearchPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Login/Register Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} defaultMode={authMode} />
    </div>
  );
};

export default Layout;
