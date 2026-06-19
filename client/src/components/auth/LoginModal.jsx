import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const LoginModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, register, error, isLoading, checkAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const getRedirectPath = (role) => {
    if (location.state?.from?.pathname) return location.state.from.pathname;
    if (role === 'ADMIN' || role === 'AUTHOR') return '/admin';
    return '/'; // Go to homepage for regular users if no 'from' state
  };

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      checkAuth();
    }
  }, [isOpen, checkAuth, defaultMode]);

  // Removed auto-redirect useEffect to prevent redirecting when checkAuth finishes or when password is pasted

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    
    if (mode === 'login') {
      success = await login(email, password);
    } else {
      success = await register(name, email, password);
    }
    
    if (success) {
      const currentUser = useAuthStore.getState().user;
      onClose();
      navigate(getRedirectPath(currentUser?.role), { replace: true });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-[28px] font-bold text-[#001a4d] tracking-tight mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-[14px]">
            {mode === 'login' 
              ? 'Sign in to access your Wealth Empires account'
              : 'Join Wealth Empires to unlock exclusive intelligence'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wider" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] outline-none transition-all rounded-xl text-[15px]"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wider" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] outline-none transition-all rounded-xl text-[15px]"
              placeholder="editor@wealthempires.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wider" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] outline-none transition-all rounded-xl text-[15px]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#001a4d] hover:bg-[#0052cc] text-white py-3.5 rounded-xl font-bold text-[14px] uppercase tracking-wider transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[14px] text-gray-500 hover:text-[#0052cc] transition-colors"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
