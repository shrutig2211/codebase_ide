import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans transition-colors pb-16">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 transition-colors">
          Your Browser is Your New Classroom.
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          CogniBase was built to help students focus on what actually matters: learning to code. Skip the complicated installations and environment setups, and start executing logic immediately.
        </p>
      </div>

      {/* Student Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Zero Local Setup</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Forget downloading heavy JDKs, fighting with Python PATH variables, or configuring C++ compilers. Just select your language, open the editor, and run your assignment.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">One Unified Workspace</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Taking Data Structures in Java and Web Dev in JavaScript? Seamlessly switch between 12+ programming languages in a single, unified interface designed for fast context switching.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Cloud Persistence</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              All your snippets, practice algorithms, and class notes are auto-saved to your cloud dashboard. Access your code from the library, your dorm, or even a friend's laptop.
            </p>
          </div>
        </div>
      </div>

      {/* The Student Problem Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 transition-colors">
          <div className="w-full md:w-1/3 flex justify-center">
             <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 p-1 shadow-2xl shadow-indigo-500/20">
                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                    {/* Education Cap Icon inside the circle */}
                    <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
             </div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Built for the Modern Student</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Traditional IDEs are incredibly powerful, but they are often bloated, resource-heavy, and intimidating for beginners. When you're just trying to figure out how a `while` loop works or test a sorting algorithm for tomorrow's exam, you shouldn't have to fight with your tooling.
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              CogniBase provides a friction-free environment where your code runs securely in isolated Docker containers. Whether you are a freshman writing your first "Hello World" or a senior testing complex backend logic, CogniBase gets out of your way so you can focus on the logic.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">Fast Context Switching</span>
              <span className="px-4 py-2 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">No Resource Bloat</span>
              <span className="px-4 py-2 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">Interactive Inputs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Ace your next coding assignment.</h2>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          Open Your Workspace
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>

    </div>
  );
};

export default About;