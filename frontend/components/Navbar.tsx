"use client";

import React, { useState } from "react";
import { Film, Tv, Play, Search, Magnet, X } from "lucide-react";

interface NavbarProps {
  activeTab: "movie" | "series";
  onTabChange: (tab: "movie" | "series") => void;
  onSearch: (query: string) => void;
  onOpenDirectStream: () => void;
}

export function Navbar({
  activeTab,
  onTabChange,
  onSearch,
  onOpenDirectStream,
}: NavbarProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    onSearch("");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#1b1f2b] bg-[#0b0c10]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/10 text-red-500 border border-red-500/20">
              <Magnet className="h-5 w-5 rotate-45" />
            </div>
            <span className="font-mono text-lg font-bold tracking-tight text-white">
              Magnet<span className="text-red-500">io</span>
            </span>
          </div>

          {/* Catalog Type Switcher */}
          <nav className="hidden items-center gap-1 sm:flex rounded-lg bg-[#141722] p-1 border border-[#1f2434]">
            <button
              onClick={() => onTabChange("movie")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "movie"
                  ? "bg-[#252b3d] text-white shadow-sm"
                  : "text-[#8e95a5] hover:text-white"
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              Movies
            </button>
            <button
              onClick={() => onTabChange("series")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "series"
                  ? "bg-[#252b3d] text-white shadow-sm"
                  : "text-[#8e95a5] hover:text-white"
              }`}
            >
              <Tv className="h-3.5 w-3.5" />
              Series
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#656d81]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search movies, shows, or paste IMDb ID (tt0133093)..."
              className="w-full rounded-lg border border-[#1f2434] bg-[#141722] py-2 pl-9 pr-8 text-xs text-[#e6e8ec] placeholder-[#656d81] focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#656d81] hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Action Button: Direct Magnet Stream */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDirectStream}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-500 active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Direct Magnet</span>
          </button>
        </div>
      </div>

      {/* Mobile Submenu for Tabs */}
      <div className="flex border-t border-[#1b1f2b] px-4 py-2 sm:hidden justify-center gap-2">
        <button
          onClick={() => onTabChange("movie")}
          className={`flex-1 flex justify-center items-center gap-1.5 rounded-md py-1.5 text-xs font-medium ${
            activeTab === "movie" ? "bg-[#1f2434] text-white" : "text-[#8e95a5]"
          }`}
        >
          <Film className="h-3.5 w-3.5" /> Movies
        </button>
        <button
          onClick={() => onTabChange("series")}
          className={`flex-1 flex justify-center items-center gap-1.5 rounded-md py-1.5 text-xs font-medium ${
            activeTab === "series" ? "bg-[#1f2434] text-white" : "text-[#8e95a5]"
          }`}
        >
          <Tv className="h-3.5 w-3.5" /> Series
        </button>
      </div>
    </header>
  );
}
