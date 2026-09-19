"use client";

import React, { useState, useEffect } from "react";
import { MediaItem, TorrentStream } from "@/types";
import { fetchPopularMedia, searchMedia } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { MediaCard } from "@/components/MediaCard";
import { StreamSelectorModal } from "@/components/StreamSelectorModal";
import { VideoPlayerModal } from "@/components/VideoPlayerModal";
import { DirectStreamModal } from "@/components/DirectStreamModal";
import { Loader2, Film, Tv, Sparkles } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"movie" | "series">("movie");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [activeStream, setActiveStream] = useState<{
    stream: TorrentStream;
    title: string;
  } | null>(null);
  const [showDirectStream, setShowDirectStream] = useState<boolean>(false);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);

    const loadData = async () => {
      try {
        if (searchQuery.trim()) {
          const results = await searchMedia(searchQuery, activeTab);
          if (isCurrent) setItems(results);
        } else {
          const popular = await fetchPopularMedia(activeTab);
          if (isCurrent) setItems(popular);
        }
      } catch (err) {
        console.error("Error loading media:", err);
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadData();

    return () => {
      isCurrent = false;
    };
  }, [activeTab, searchQuery]);

  const handleTabChange = (tab: "movie" | "series") => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  const handlePlayStream = (stream: TorrentStream, title: string) => {
    setSelectedItem(null);
    setActiveStream({ stream, title });
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e6e8ec] flex flex-col">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSearch={setSearchQuery}
        onOpenDirectStream={() => setShowDirectStream(true)}
      />

      {/* Main Content Area */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Section Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b1f2b] pb-4">
          <div className="flex items-center gap-2">
            {activeTab === "movie" ? (
              <Film className="h-5 w-5 text-red-500" />
            ) : (
              <Tv className="h-5 w-5 text-red-500" />
            )}
            <h1 className="text-base font-semibold text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : activeTab === "movie" ? "Popular Movies" : "Popular TV Shows"}
            </h1>
          </div>

          <div className="text-xs text-[#6e778d]">
            {loading ? "Loading catalog..." : `${items.length} titles available`}
          </div>
        </div>

        {/* Content Grid / State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-[#6e778d]">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-red-500" />
            <p className="text-xs font-medium">Fetching catalog...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#202739] py-24 text-center">
            <Sparkles className="mb-3 h-8 w-8 text-[#515a6e]" />
            <p className="text-sm font-medium text-[#8d97ac]">No results found</p>
            <p className="text-xs text-[#5f687e] mt-1">
              Try searching by title or enter a specific IMDb ID (e.g. tt0133093)
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-4">
            {items.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onSelect={(selected) => setSelectedItem(selected)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#161a25] bg-[#090a0d] py-5 text-center text-xs text-[#5a6275]">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Magnetio — P2P Web Streamer</span>
          <span className="font-mono text-[11px] text-[#424857]">
            Powered by WebTorrent & Hono
          </span>
        </div>
      </footer>

      {/* Stream Selector Drawer/Modal */}
      {selectedItem && (
        <StreamSelectorModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onPlayStream={handlePlayStream}
        />
      )}

      {/* Direct Magnet Stream Modal */}
      {showDirectStream && (
        <DirectStreamModal
          onClose={() => setShowDirectStream(false)}
          onPlayStream={handlePlayStream}
        />
      )}

      {/* Fullscreen Video Player */}
      {activeStream && (
        <VideoPlayerModal
          stream={activeStream.stream}
          title={activeStream.title}
          onClose={() => setActiveStream(null)}
        />
      )}
    </div>
  );
}
