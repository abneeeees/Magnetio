"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { searchBar, useEscapeKey } from "@/hooks/KeyBoardControls";
import {
  Film,
  Tv,
  Play,
  Search,
  Magnet,
  X,
  Bookmark,
  History,
  User as UserIcon,
  LogOut,
} from "lucide-react";

export type NavTab = "movie" | "series" | "watchlist" | "history";

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onSearch: (query: string) => void;
  onOpenDirectStream: () => void;
  onOpenAuth: () => void;
}

export function Navbar({
  activeTab,
  onTabChange,
  onSearch,
  onOpenDirectStream,
  onOpenAuth,
}: NavbarProps) {
  const { user, signOut } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const searchRef = useRef<HTMLInputElement>(null);

  searchBar((key) => {
    switch (key) {
      case "k":
        searchRef.current?.focus();
        break;
      case "/":
        searchRef.current?.focus();
        break;
    }
  });

  useEscapeKey(() => {
    searchRef.current?.blur();
  });

  const handleClear = () => {
    setSearchInput("");
    onSearch("");
  };

  const SearchSkeleton = () => (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex gap-3">
          <div className="h-20 w-14 rounded-md bg-[#252a38]" />

          <div className="flex-1 space-y-2 py-2">
            <div className="h-3 w-3/4 rounded bg-[#252a38]" />
            <div className="h-3 w-1/2 rounded bg-[#252a38]" />
            <div className="h-3 w-1/4 rounded bg-[#252a38]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-[#1b1f2b] bg-[#0b0c10]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onTabChange("movie")}
            className="flex cursor-pointer items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-600/10 text-red-500">
              <Magnet className="rotate-45" />
            </div>
            <span className="font-mono text-lg font-bold tracking-tight text-white">
              Magnet<span className="text-red-500">IO</span>
            </span>
          </div>

          {/* Catalog & Library Switcher */}
          <nav className="hidden items-center gap-1 rounded-lg border border-[#1f2434] bg-[#141722] p-1 sm:flex">
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
              <kbd className="ml-1 inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-[5px] border border-white/[0.12] bg-[#191d2a] px-1 text-[10px] leading-none font-bold text-[#aeb4c3] shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                M
              </kbd>
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
              <kbd className="ml-1 inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-[5px] border border-white/[0.12] bg-[#191d2a] px-1 text-[10px] leading-none font-medium text-[#aeb4c3] shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                S
              </kbd>
            </button>
            {user && (
              <>
                <button
                  onClick={() => onTabChange("watchlist")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeTab === "watchlist"
                      ? "bg-[#252b3d] text-white shadow-sm"
                      : "text-[#8e95a5] hover:text-white"
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  Watchlist
                  <kbd className="ml-1 inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-[5px] border border-white/[0.12] bg-[#191d2a] px-1 text-[10px] leading-none font-medium text-[#aeb4c3] shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    W
                  </kbd>
                </button>
                <button
                  onClick={() => onTabChange("history")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeTab === "history"
                      ? "bg-[#252b3d] text-white shadow-sm"
                      : "text-[#8e95a5] hover:text-white"
                  }`}
                >
                  <History className="h-3.5 w-3.5" />
                  History
                  <kbd className="ml-1 inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-[5px] border border-white/[0.12] bg-[#191d2a] px-1 text-[10px] leading-none font-medium text-[#aeb4c3] shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    H
                  </kbd>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative max-w-md flex-1">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#656d81]" />
            <input
              ref={searchRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Press Ctrl + K, ⌘ + K, or / to search"
              className="w-full rounded-lg border border-[#1f2434] bg-[#141722] py-2 pr-8 pl-9 text-xs text-[#e6e8ec] placeholder-[#656d81] focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[#656d81] hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Action Buttons: Direct Magnet & Auth */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDirectStream}
            className="flex items-center gap-1.5 rounded-md border border-[#22283b] bg-[#141724] px-3 py-1.5 text-xs font-medium text-[#c4cad7] transition-colors hover:border-[#333d56] hover:text-white"
          >
            <Magnet className="h-3.5 w-3.5 fill-current text-red-500" />
            <span className="hidden sm:inline">Direct Magnet</span>
            <kbd className="ml-1 hidden h-[19px] min-w-[19px] items-center justify-center rounded-[5px] border border-white/[0.12] bg-[#191d2a] px-1 text-[10px] leading-none font-medium text-[#aeb4c3] shadow-[0_1px_2px_rgba(0,0,0,0.4)] sm:inline-flex">
              D
            </kbd>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-[#22283b] bg-[#141724] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#1a1f30]"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600/20 text-[10px] font-bold text-red-400">
                  {user.email?.[0].toUpperCase() || "U"}
                </div>
                <span className="hidden max-w-[100px] truncate text-xs md:inline">
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-[#1f2537] bg-[#10131d] py-1 shadow-2xl">
                  <div className="truncate border-b border-[#1b202e] px-3 py-2 text-[11px] text-[#717b92]">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      onTabChange("watchlist");
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-[#c4cad7] hover:bg-[#191e2c] hover:text-white"
                  >
                    <Bookmark className="h-3.5 w-3.5" /> Watchlist
                  </button>
                  <button
                    onClick={() => {
                      onTabChange("history");
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-[#c4cad7] hover:bg-[#191e2c] hover:text-white"
                  >
                    <History className="h-3.5 w-3.5" /> History
                  </button>
                  <div className="my-1 border-t border-[#1b202e]" />
                  <button
                    onClick={() => {
                      signOut();
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500 active:scale-95"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Submenu for Tabs */}
      <div className="flex justify-center gap-1.5 overflow-x-auto border-t border-[#1b1f2b] px-4 py-2 sm:hidden">
        <button
          onClick={() => onTabChange("movie")}
          className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
            activeTab === "movie" ? "bg-[#1f2434] text-white" : "text-[#8e95a5]"
          }`}
        >
          <Film className="h-3.5 w-3.5" /> Movies
        </button>
        <button
          onClick={() => onTabChange("series")}
          className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
            activeTab === "series" ? "bg-[#1f2434] text-white" : "text-[#8e95a5]"
          }`}
        >
          <Tv className="h-3.5 w-3.5" /> Series
        </button>
        {user && (
          <>
            <button
              onClick={() => onTabChange("watchlist")}
              className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                activeTab === "watchlist" ? "bg-[#1f2434] text-white" : "text-[#8e95a5]"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" /> Watchlist
            </button>
            <button
              onClick={() => onTabChange("history")}
              className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                activeTab === "history" ? "bg-[#1f2434] text-white" : "text-[#8e95a5]"
              }`}
            >
              <History className="h-3.5 w-3.5" /> History
            </button>
          </>
        )}
      </div>
    </header>
  );
}
