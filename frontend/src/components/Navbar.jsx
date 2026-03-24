import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Theme State
  const [isDark, setIsDark] = useState(true);

  // Initialize theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Theme Toggle with Swipe Animation
  const toggleTheme = () => {
    const willBeDark = !isDark;

    const applyTheme = () => {
      if (willBeDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      setIsDark(willBeDark);
    };

    // Use View Transitions API if supported by the browser
    if (!document.startViewTransition) {
      applyTheme();
    } else {
      document.startViewTransition(applyTheme);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 transition-colors shrink-0">
      
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center w-8 h-8 transition-transform duration-300 group-hover:scale-110">
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cogniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#cogniGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-indigo-500/10 dark:fill-indigo-500/20"/>
            <path d="M2 17L12 22L22 17" stroke="url(#cogniGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="url(#cogniGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-full -z-10 group-hover:bg-indigo-500/40 transition-all duration-300"></div>
        </div>
        <span className="text-xl font-bold tracking-wide text-zinc-900 dark:text-zinc-100 transition-colors">
          Cogni<span className="text-indigo-500 dark:text-indigo-400">Base</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {/* Dark Mode Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all"
          title="Toggle Theme"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
        </button>

        {isLoggedIn ? (
          <>
            <Link to="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Home</Link>
            
            {/* UPDATED: About Link now points to /about */}
            <Link to="/about" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">About</Link>

            <button 
              onClick={handleLogout}
              className="ml-2 px-5 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-md transition-all active:scale-95 flex items-center gap-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* UPDATED: About link for logged out users too (optional, but good practice!) */}
            <Link to="/about" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">About</Link>
            <Link to="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Login</Link>
            <Link to="/signUp" className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-all active:scale-95 shadow-lg shadow-indigo-500/20">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;