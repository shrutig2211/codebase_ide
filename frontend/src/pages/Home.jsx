import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { api_base_url } from "../helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isEditModelShow, setIsEditModelShow] = useState(false);
  const [editProjId, setEditProjId] = useState("");
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [projects, setProjects] = useState(null);

  const navigate = useNavigate();

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
  };
  
  // Dynamically checking if dark mode is active for react-select
  const isDark = document.documentElement.classList.contains("dark");

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDark ? "#09090b" : "#ffffff",
      borderColor: state.isFocused ? "#6366f1" : isDark ? "#27272a" : "#e4e4e7",
      boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
      color: isDark ? "#f4f4f5" : "#18181b",
      padding: "2px 4px",
      borderRadius: "0.5rem",
      cursor: "pointer",
      "&:hover": { borderColor: isDark ? "#3f3f46" : "#a1a1aa" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#18181b" : "#ffffff",
      border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#6366f1"
        : state.isFocused
        ? isDark ? "#27272a" : "#f4f4f5"
        : "transparent",
      color: state.isSelected ? "#ffffff" : isDark ? "#d4d4d8" : "#3f3f46",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDark ? "#f4f4f5" : "#18181b",
    }),
  };

  const getRunTimes = async () => {
    let res = await fetch("/api/v2/runtimes");
    let data = await res.json();
    const filteredLanguages = ["python", "javascript","bash"];
    const options = data
      .filter((runtime) => filteredLanguages.includes(runtime.language))
      .map((runtime) => ({
        label: `${runtime.language.toUpperCase()} (${runtime.version})`,
        value: runtime.language === "c++" ? "cpp" : runtime.language,
        version: runtime.version,
      }));
    setLanguageOptions(options);
  };

  const getProjects = async () => {
    fetch(api_base_url + "/getProjects", {
      mode: "cors", method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: localStorage.getItem("token") }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.projects);
      });
  };

  useEffect(() => {
    const storedFullName = localStorage.getItem("fullName");
    if (storedFullName) setFullName(storedFullName);
    else {
      fetch(api_base_url + "/getUserInfo", {
        mode: "cors", method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.fullName) {
            setFullName(data.fullName);
            localStorage.setItem("fullName", data.fullName);
          }
        });
    }
    getProjects();
    getRunTimes();
  }, []);

  const createProj = () => {
    if (!name || !selectedLanguage) return toast.error("Please fill all details");
    fetch(api_base_url + "/createProj", {
      mode: "cors", method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name, projLanguage: selectedLanguage.value,
        token: localStorage.getItem("token"), version: selectedLanguage.version,
      }),
    }).then((res) => res.json()).then((data) => {
        if (data.success) {
          setName(""); setSelectedLanguage(null);
          navigate("/editior/" + data.projectId);
        } else toast.error(data.msg);
      });
  };

  const deleteProject = (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      fetch(api_base_url + "/deleteProject", {
        mode: "cors", method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, token: localStorage.getItem("token") }),
      }).then((res) => res.json()).then((data) => {
          if (data.success) { getProjects(); toast.success("Project deleted"); }
        });
    }
  };

  const updateProj = () => {
    if (!name) return toast.error("Name cannot be empty");
    fetch(api_base_url + "/editProject", {
      mode: "cors", method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: editProjId, token: localStorage.getItem("token"), name: name }),
    }).then((res) => res.json()).then((data) => {
        if (data.success) {
          setIsEditModelShow(false); setName(""); setEditProjId(""); getProjects();
          toast.success("Project updated");
        }
      });
  };

  const getLanguageImage = (lang) => {
    const defaultClasses = "w-12 h-12 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300";
    const baseUrl = "https://img.icons8.com/color/96/";
    switch (lang) {
      case "python": return <img className={defaultClasses} src={`${baseUrl}python--v1.png`} alt="Python" />;
      case "javascript": return <img className={defaultClasses} src={`${baseUrl}javascript--v1.png`} alt="JavaScript" />;
      case "typescript": return <img className={defaultClasses} src={`${baseUrl}typescript.png`} alt="TypeScript" />;
      case "cpp": return <img className={defaultClasses} src={`${baseUrl}c-plus-plus-logo.png`} alt="C++" />;
      case "c": return <img className={defaultClasses} src={`${baseUrl}c-programming.png`} alt="C" />;
      case "csharp": return <img className={defaultClasses} src={`${baseUrl}c-sharp-logo.png`} alt="C#" />;
      case "java": return <img className={defaultClasses} src={`${baseUrl}java-coffee-cup-logo--v1.png`} alt="Java" />;
      case "go": return <img className={defaultClasses} src={`${baseUrl}golang.png`} alt="Go" />;
      case "ruby": return <img className={defaultClasses} src={`${baseUrl}ruby-programming-language.png`} alt="Ruby" />;
      case "php": return <img className={defaultClasses} src={`${baseUrl}php.png`} alt="PHP" />;
      case "bash": return <img className={defaultClasses} src={`${baseUrl}console.png`} alt="Bash" />;
      case "rust": return <img className={defaultClasses} src="https://img.icons8.com/fluency/96/rust.png" alt="Rust" />;
      default: return <div className="w-12 h-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-400 font-bold border border-zinc-200 dark:border-zinc-700 shadow-inner group-hover:scale-110 transition-transform duration-300">{"</>"}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans transition-colors">
      <Navbar />
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1 transition-colors">
            Welcome back, {fullName ? fullName.split(' ')[0] : "Developer"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your workspaces and code snippets.</p>
        </div>
        
        <button
          onClick={() => { setIsCreateModelShow(true); setName(""); setSelectedLanguage(null); }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-10">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate("/editior/" + project._id)}
                className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 cursor-pointer transition-all hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute -inset-x-4 top-0 h-24 bg-gradient-to-b from-indigo-500/10 dark:from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <div className="flex items-start justify-between mb-4 z-10">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center p-2 shrink-0">
                    {getLanguageImage(project.projLanguage)}
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setIsEditModelShow(true); setEditProjId(project._id); setName(project.name); }} className="p-2 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                    <button onClick={(e) => deleteProject(project._id, e)} className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                  </div>
                </div>

                <div className="flex flex-col z-10">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate mb-1">{project.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md uppercase tracking-wider">{project.projLanguage}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-500">{new Date(project.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/30">
            <div className="w-16 h-16 mb-4 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No projects yet</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">Create your first workspace to start writing, compiling, and executing code in the cloud.</p>
            <button onClick={() => setIsCreateModelShow(true)} className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors flex items-center gap-1">Create a project &rarr;</button>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateModelShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setIsCreateModelShow(false); }}>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">New Workspace</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Project Name</label>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="e.g. Data Script" className="w-full bg-gray-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" autoFocus />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Runtime Environment</label>
                <Select placeholder="Select a Language..." options={languageOptions} styles={customStyles} onChange={handleLanguageChange} />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setIsCreateModelShow(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
                <button onClick={createProj} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-indigo-500/20 active:scale-95">Create Project</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {isEditModelShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setIsEditModelShow(false); }}>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Rename Project</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">New Name</label>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" className="w-full bg-gray-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" autoFocus />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setIsEditModelShow(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
                <button onClick={updateProj} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-indigo-500/20 active:scale-95">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
