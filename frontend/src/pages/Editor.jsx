import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Editor2 from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { api_base_url } from "../helper";
import { toast } from "react-toastify";

const Editor = () => {
  const [code, setCode] = useState("");
  const { id } = useParams();
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("editor-theme") || "vs-dark"
  );

  // Dynamically determine the Piston API URL based on the environment
  const PISTON_URL = "https://piston-api.duckdns.org";

  // Layout States
  const [editorWidth, setEditorWidth] = useState(50);
  const [consoleHeight, setConsoleHeight] = useState(50);
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);

  // Refs
  const containerRef = useRef(null);
  const rightPanelRef = useRef(null);
  const codeRef = useRef(code);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Fetch project
  useEffect(() => {
    fetch(`${api_base_url}/getProject`, {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        projectId: id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setCode(res.project.code);
          setData(res.project);
        } else toast.error(res.msg);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load project");
      });
  }, [id]);

  // Save project
  const saveProject = (isAutoSave = false) => {
    const trimmedCode = codeRef.current?.toString().trim();
    setIsSaving(true);

    fetch(`${api_base_url}/saveProject`, {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        projectId: id,
        code: trimmedCode,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          if (!isAutoSave) toast.success("Project saved manually");
        } else toast.error(res.msg);
      })
      .catch(() => toast.error("Failed to save project"))
      .finally(() => setIsSaving(false));
  };

  // Debounced Auto-Save
  useEffect(() => {
    if (!data) return;
    const debounceTimer = setTimeout(() => saveProject(true), 1500);
    return () => clearTimeout(debounceTimer);
  }, [code, data]);

  // Manual save shortcut
  useEffect(() => {
    const handleSaveShortcut = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveProject(false);
      }
    };
    window.addEventListener("keydown", handleSaveShortcut);
    return () => window.removeEventListener("keydown", handleSaveShortcut);
  }, []);

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem("editor-theme", newTheme);
  };

  // Horizontal Drag
  const handleHorizontalMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingHorizontal(true);
    document.addEventListener("mousemove", handleHorizontalMouseMove);
    document.addEventListener("mouseup", handleHorizontalMouseUp);
  };
  const handleHorizontalMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    if (newWidth > 20 && newWidth < 80) setEditorWidth(newWidth);
  };
  const handleHorizontalMouseUp = () => {
    setIsDraggingHorizontal(false);
    document.removeEventListener("mousemove", handleHorizontalMouseMove);
    document.removeEventListener("mouseup", handleHorizontalMouseUp);
  };

  // Vertical Drag
  const handleVerticalMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingVertical(true);
    document.addEventListener("mousemove", handleVerticalMouseMove);
    document.addEventListener("mouseup", handleVerticalMouseUp);
  };
  const handleVerticalMouseMove = (e) => {
    if (!rightPanelRef.current) return;
    const rect = rightPanelRef.current.getBoundingClientRect();
    const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
    if (newHeight > 15 && newHeight < 85) setConsoleHeight(newHeight);
  };
  const handleVerticalMouseUp = () => {
    setIsDraggingVertical(false);
    document.removeEventListener("mousemove", handleVerticalMouseMove);
    document.removeEventListener("mouseup", handleVerticalMouseUp);
  };

const getFileExtension = (lang) => {
    switch (lang) {
      case "python": return ".py";
      case "javascript": return ".js";
      case "typescript": return ".ts";
      case "java": return ".java";
      case "c": return ".c";
      case "cpp": return ".cpp";
      case "csharp": return ".cs";
      case "go": return ".go";
      case "rust": return ".rs";
      case "ruby": return ".rb";
      case "php": return ".php";
      case "bash": return ".sh";
      default: return ".txt";
    }
  };

  const runProject = async () => {
    if (!data) return toast.error("Project not loaded yet");
    setOutput("Executing...");
    setError(false);

    try {
      // Uses the dynamic PISTON_URL
      const response = await fetch(`${PISTON_URL}/api/v2/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: data.projLanguage.toLowerCase(),
          version: "*",
          files: [{ filename: data.name + getFileExtension(data.projLanguage), content: code }],
          stdin: customInput,
        }),
      });
      const result = await response.json();
      if (result.run) {
        setOutput(result.run.output || "Program finished with no output.");
        setError(result.run.code !== 0);
      } else {
        setOutput(result.message || "Execution failed");
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setOutput("Server error");
      setError(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Navbar />

      <div
        ref={containerRef}
        className="flex items-center justify-between overflow-hidden flex-1 border-t border-zinc-800"
      >
        {/* LEFT PANEL: Code Editor */}
        <div
          className="h-full bg-zinc-900 flex flex-col relative"
          style={{
            width: `${editorWidth}%`,
            pointerEvents: isDraggingHorizontal ? "none" : "auto",
          }}
        >
          {/* Header */}
          <div className="flex px-4 py-3 border-b border-zinc-800 items-center justify-between bg-zinc-900 z-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              <p className="font-semibold text-sm tracking-wide text-zinc-300">
                {data?.name || "Code Editor"}
              </p>
            </div>
            <select
              className="bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-300 outline-none px-3 py-1 rounded-md text-xs cursor-pointer transition-colors"
              value={theme}
              onChange={handleThemeChange}
            >
              <option value="vs-dark">Dark Theme</option>
              <option value="light">Light Theme</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 mt-2">
            <Editor2
              onChange={(value) => setCode(value || "")}
              theme={theme}
              height="100%"
              width="100%"
              language={data?.projLanguage || "javascript"}
              value={code}
              options={{
                minimap: { enabled: false }, // Cleaner look
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          </div>
        </div>

        {/* HORIZONTAL DRAGGER */}
        <div
          onMouseDown={handleHorizontalMouseDown}
          className="w-[2px] h-full bg-zinc-800 hover:bg-indigo-500 cursor-col-resize transition-colors duration-200 z-20 flex-shrink-0 relative"
          title="Drag to resize horizontally"
        >
          {/* Invisible wider hit area for easier grabbing */}
          <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize"></div>
        </div>

        {/* RIGHT PANEL: Console Area */}
        <div
          className="h-full bg-zinc-900 flex flex-col"
          style={{
            width: `${100 - editorWidth}%`,
            pointerEvents: isDraggingHorizontal || isDraggingVertical ? "none" : "auto",
          }}
        >
          {/* Console Header */}
          <div className="flex px-4 py-3 border-b border-zinc-800 items-center justify-between bg-zinc-900 flex-shrink-0">
            <p className="font-semibold text-sm tracking-wide text-zinc-300">Terminal</p>
            <div className="flex items-center gap-4">
              {isSaving ? (
                <span className="text-xs text-zinc-500 italic flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="text-xs text-emerald-500 flex items-center gap-1">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Saved
                </span>
              )}
              <button
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2"
                onClick={runProject}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                Run Code
              </button>
            </div>
          </div>

          {/* Interactive Workspace (Input + Output) */}
          <div ref={rightPanelRef} className="flex flex-col flex-1 p-4 gap-2 overflow-hidden bg-zinc-950/50">
            
            {/* Top: Custom Input Box */}
            <div 
              className="flex flex-col border border-zinc-800 rounded-xl bg-zinc-950 shadow-inner focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all overflow-hidden" 
              style={{ height: `calc(${consoleHeight}% - 4px)` }}
            >
              <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800/50">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Standard Input (stdin)</p>
              </div>
              <textarea
                className="w-full flex-1 bg-transparent text-zinc-300 p-4 outline-none resize-none font-mono text-sm placeholder-zinc-700"
                placeholder="Type inputs here on separate lines..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              ></textarea>
            </div>

            {/* VERTICAL DRAGGER */}
            <div
              onMouseDown={handleVerticalMouseDown}
              className="h-[4px] w-full rounded-full bg-zinc-800 hover:bg-indigo-500 cursor-row-resize transition-colors duration-200 z-10 flex-shrink-0 my-1 relative"
              title="Drag to resize vertically"
            >
               {/* Invisible taller hit area */}
               <div className="absolute inset-x-0 -top-2 -bottom-2 cursor-row-resize"></div>
            </div>

            {/* Bottom: Output Box */}
            <div 
              className="flex flex-col border border-zinc-800 rounded-xl bg-zinc-950 shadow-inner overflow-hidden relative group" 
              style={{ height: `calc(${100 - consoleHeight}% - 4px)` }}
            >
              <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800/50 flex justify-between items-center">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Terminal Output</p>
                <button 
                  onClick={() => setOutput("")} 
                  className="text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
                  title="Clear Output"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
              <pre
                className={`w-full flex-1 bg-transparent p-4 font-mono text-sm overflow-auto m-0 leading-relaxed ${
                  error ? "text-rose-400" : "text-emerald-400"
                }`}
                style={{ textWrap: "pre-wrap" }}
              >
                {output || <span className="text-zinc-600 italic">Ready for execution...</span>}
              </pre>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
