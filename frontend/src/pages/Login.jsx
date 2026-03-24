import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api_base_url } from "../helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !pwd) return toast.error("Please fill in all fields.");

    setIsSubmitting(true);

    fetch(api_base_url + "/users/login", {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pwd }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("fullName", data.fullName);
          window.location.href = "/";
          toast.success("Welcome back!");
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => toast.error("Server error. Please try again."))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 font-sans transition-colors relative overflow-hidden p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-zinc-200/50 dark:shadow-none transition-colors">
        
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="cogniGradientLog" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#cogniGradientLog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-indigo-500/10 dark:fill-indigo-500/20"/>
                <path d="M2 17L12 22L22 17" stroke="url(#cogniGradientLog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="url(#cogniGradientLog)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-wide text-zinc-900 dark:text-zinc-100 transition-colors">
              Cogni<span className="text-indigo-500 dark:text-indigo-400">Base</span>
            </span>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-zinc-900 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-8">Enter your credentials to access your workspaces.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Password</label>
              <Link to="#" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Logging in...
              </>
            ) : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don't have an account?{" "}
          <Link to="/signUp" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
