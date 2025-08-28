"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function SearchSidebar({ searchResults }: { searchResults: any[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle on Mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 md:hidden bg-green-600 px-4 py-2 rounded text-white shadow-lg hover:bg-green-700 transition"
      >
        {open ? "Close" : "Search"}
      </button>

      <aside
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-gray-900 text-white shadow-lg p-4
        transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "translate-x-full"}
        md:translate-x-0 md:relative flex flex-col`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">🔍 Search Results</h2>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1 rounded hover:bg-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchResults.length === 0 ? (
            <p className="text-gray-400">No results found.</p>
          ) : (
            <ul className="space-y-3">
              {searchResults.map((r, i) => (
                <li key={i} className="border-b border-gray-700 pb-2">
                  <a
                    href={r.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline font-medium"
                  >
                    {r.title || "Untitled"}
                  </a>
                  {r.snippet && <p className="text-sm text-gray-400 mt-1">{r.snippet}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
