"use client";

import { useState } from "react";
import { Search, Zap, Code, Info, Menu, X, Send, Loader2 } from "lucide-react";
import { generateCircuit, searchSerpApi } from "./api"; // ✅ using our helper file
import { formatExplanation } from "./utils/textFormatter";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleBot = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    setSearchResults([]);

    try {
      const [circuit, results] = await Promise.all([
        generateCircuit(prompt),
        searchSerpApi(prompt),
      ]);
      setData(circuit);
      setSearchResults(results); // ✅ already array from API
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleBot();
  };
  console.log(formatExplanation(data?.explanation));

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Left Main Area (60%) */}
      <div className="flex-1 flex flex-col w-3/5">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Circuit Generator AI
              </h1>
              <p className="text-sm text-gray-400">Your electronics assistant</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Welcome */}
          {!data && !loading && !error && (
            <div className="max-w-3xl mx-auto text-center space-y-4 mt-20">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Zap className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold">Welcome to Circuit Generator AI</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Describe your circuit idea and I'll generate a diagram, explanation, and Arduino code for you.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <p className="text-red-400">⚠️ {error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <div>
                <p className="font-medium">Generating your circuit...</p>
                <p className="text-sm text-gray-400">This may take a few moments</p>
              </div>
            </div>
          )}

          {/* Results */}
          {data && (
            <div className="space-y-6">
              {/* Circuit Diagram full width */}
              <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">Circuit Diagram</h3>
                </div>
                <div className="p-4 h-[500px] flex items-center justify-center bg-white rounded-lg">
                  {data.image_url ? (
                    <img
                      src={data.image_url}
                      alt="Circuit Diagram"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-800 rounded-lg">
                      No circuit diagram available
                    </div>
                  )}
                </div>
              </div>

              {/* Explanation + Code (50-50) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-xl border border-gray-700">
                  <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <Info className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold">Explanation</h3>
                  </div>
                  <div className="p-4">
                    {data?.explanation ? (
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        {formatExplanation(data.explanation).map((step, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {step.replace(/\*\*/g, "")}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-gray-300">Explanation unavailable.</p>
                    )}
                  </div>

                </div>
                <div className="bg-gray-900 rounded-xl border border-gray-700">
                  <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold">Arduino Code</h3>
                  </div>
                  <div className="p-4">
                    <pre className="bg-black/50 p-4 rounded-lg text-sm overflow-x-auto text-green-400 font-mono">
                      {data.arduino_code || "// Arduino code unavailable."}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-gray-900 border-t border-gray-700">
          <div className="flex gap-3 items-end">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your circuit idea..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-blue-400 transition-colors"
              rows={2}
              disabled={loading}
            />
            <button
              onClick={handleBot}
              disabled={loading || !prompt.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 rounded-xl transition-all duration-200"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Right Sidebar (40%) */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:translate-x-0 md:relative absolute top-0 right-0 h-full w-full md:w-2/5 bg-gray-900 border-l border-gray-700 transition-transform duration-300`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Search Results</h3>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 hover:bg-gray-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((r, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="block">
                    <h4 className="font-medium text-blue-400 hover:text-blue-300 line-clamp-2 mb-2">
                      {r.title}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-3">{r.snippet}</p>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Search results will appear here after generation</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
