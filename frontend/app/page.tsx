"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { MediaItem, TorrentStream } from "@/types";
import {
  fetchPopularMedia,
  searchMedia,
  fetchWatchlist,
  fetchWatchHistory,
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Navbar, NavTab } from "@/components/Navbar";
import { MediaCard } from "@/components/MediaCard";
import { StreamSelectorModal } from "@/components/StreamSelectorModal";
import { VideoPlayerModal } from "@/components/VideoPlayerModal";
import { DirectStreamModal } from "@/components/DirectStreamModal";
import { AuthModal } from "@/components/AuthModal";
import { directMagnet, tabChange, useEscapeKey } from "@/hooks/KeyBoardControls";
import { Loader2, Film, Tv, Sparkles, Bookmark, History, Play, Clock } from "lucide-react";

export default function HomePage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>("movie");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [watchlistBusyId, setWatchlistBusyId] = useState<string | null>(null);

  // Modals state
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [activeStream, setActiveStream] = useState<{
    stream: TorrentStream;
    title: string;
    mediaInfo?: any;
  } | null>(null);
  const [showDirectStream, setShowDirectStream] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEscapeKey(() => {
    setShowDirectStream(false);
    setSelectedItem(null);
    setActiveStream(null);
    setShowAuthModal(false);
    setActiveTab("movie");
  });

  tabChange((key) => {
    switch (key) {
      case "m":
        setActiveTab("movie");
        break;
      case "s":
        setActiveTab("series");
        break;
      case "w":
        setActiveTab("watchlist");
        break;
      case "h":
        setActiveTab("history");
        break;
    }
  });

  directMagnet(() => {
    setShowDirectStream(true);
  });

  const mapWatchlistItems = (list: any[]): MediaItem[] =>
    list.map((item: any) => ({
      id: item.mediaId,
      imdb_id: item.mediaId,
      type: item.mediaType === "series" ? "series" : "movie",
      name: item.title,
      poster: item.posterUrl,
      releaseInfo: item.releaseInfo,
    }));

  useEffect(() => {
    if (!token) {
      setWatchlistIds(new Set());
      return;
    }
    fetchWatchlist(token)
      .then((list) => setWatchlistIds(new Set(list.map((item: any) => String(item.mediaId)))))
      .catch((err) => console.error("Error loading watchlist ids:", err));
  }, [token]);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);

    const loadData = async () => {
      try {
        if (searchQuery.trim()) {
          const type = activeTab === "movie" ? "movie" : "series";
          const results = await searchMedia(searchQuery, type);
          if (isCurrent) setItems(results);
        } else if (activeTab === "watchlist") {
          if (token) {
            const list = await fetchWatchlist(token);
            if (isCurrent) {
              setItems(mapWatchlistItems(list));
              setWatchlistIds(new Set(list.map((item: any) => String(item.mediaId))));
            }
          } else {
            if (isCurrent) setItems([]);
          }
        } else if (activeTab === "history") {
          if (token) {
            const hist = await fetchWatchHistory(token);
            if (isCurrent) setHistoryItems(hist);
          } else {
            if (isCurrent) setHistoryItems([]);
          }
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
  }, [activeTab, searchQuery, token]);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  const handleToggleWatchlist = async (item: MediaItem): Promise<boolean> => {
    if (!token) {
      setShowAuthModal(true);
      return false;
    }
    if (!item.id || !item.name) {
      console.error("Watchlist item is missing id or title");
      return false;
    }

    const alreadySaved = watchlistIds.has(item.id);
    setWatchlistBusyId(item.id);
    try {
      if (alreadySaved) {
        await removeFromWatchlist(token, item.id);
        setWatchlistIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
        if (activeTab === "watchlist") {
          setItems((prev) => prev.filter((entry) => entry.id !== item.id));
        }
      } else {
        await addToWatchlist(token, {
          mediaId: item.id,
          title: item.name,
          mediaType: item.type,
          posterUrl: item.poster,
          releaseInfo: item.releaseInfo,
        });
        setWatchlistIds((prev) => new Set(prev).add(item.id));
        if (activeTab === "watchlist") {
          setItems((prev) => (prev.some((entry) => entry.id === item.id) ? prev : [item, ...prev]));
        }
      }
      return true;
    } catch (err) {
      console.error("Watchlist toggle failed:", err);
      throw err;
    } finally {
      setWatchlistBusyId(null);
    }
  };

  const handlePlayStream = (stream: TorrentStream, title: string, mediaInfo?: any) => {
    setSelectedItem(null);
    setActiveStream({ stream, title, mediaInfo });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0c10] text-[#e6e8ec]">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSearch={setSearchQuery}
        onOpenDirectStream={() => setShowDirectStream(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Content Area */}
      <main className="w-full flex-1 px-3 py-6 sm:px-4 lg:px-5">
        {/* Content Grid / State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-[#6e778d]">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-red-500" />
            <p className="text-xs font-medium">Loading content...</p>
          </div>
        ) : activeTab === "history" ? (
          // Watch History View
          historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#202739] py-24 text-center">
              <History className="mb-3 h-8 w-8 text-[#515a6e]" />
              <p className="text-sm font-medium text-[#8d97ac]">No watch history yet</p>
              <p className="mt-1 text-xs text-[#5f687e]">
                Movies and shows you watch will appear here with your saved progress.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {historyItems.map((hist) => {
                const progressPct =
                  hist.duration > 0 ? (hist.currentTime / hist.duration) * 100 : 0;
                return (
                  <div
                    key={hist.id}
                    onClick={() =>
                      setSelectedItem({
                        id: hist.mediaId,
                        name: hist.title,
                        type: hist.mediaType,
                        poster: hist.posterUrl,
                      })
                    }
                    className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-[#1c2232] bg-[#12151e] p-3 transition-all hover:border-red-500/40 hover:bg-[#181d2c]"
                  >
                    <div className="flex gap-3">
                      {hist.posterUrl && (
                        <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded bg-[#161a26]">
                          <Image
                            src={hist.posterUrl}
                            alt={hist.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <span className="font-mono text-[10px] text-red-400 uppercase">
                            {hist.mediaType}{" "}
                            {hist.seasonNum ? `S${hist.seasonNum}:E${hist.episodeNum}` : ""}
                          </span>
                          <h3 className="line-clamp-2 text-xs font-semibold text-white transition-colors group-hover:text-red-400">
                            {hist.title}
                          </h3>
                        </div>

                        <div className="mt-2">
                          <div className="mb-1 flex items-center justify-between text-[11px] text-[#6b758b]">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(hist.currentTime)}
                            </span>
                            {hist.completed ? (
                              <span className="text-emerald-400">Completed</span>
                            ) : (
                              <span>{Math.round(progressPct)}%</span>
                            )}
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1e2537]">
                            <div
                              className="h-full bg-red-600 transition-all"
                              style={{ width: `${Math.min(100, Math.max(5, progressPct))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#202739] py-24 text-center">
            <Sparkles className="mb-3 h-8 w-8 text-[#515a6e]" />
            <p className="text-sm font-medium text-[#8d97ac]">
              {activeTab === "watchlist" ? "Your watchlist is empty" : "No results found"}
            </p>
            <p className="mt-1 text-xs text-[#5f687e]">
              {activeTab === "watchlist"
                ? "Click the bookmark icon on any movie or show to save it here."
                : "Try searching by title or enter a specific IMDb ID (e.g. tt0133093)"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:gap-6">
            {items.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                inWatchlist={watchlistIds.has(item.id)}
                watchlistBusy={watchlistBusyId === item.id}
                onToggleWatchlist={handleToggleWatchlist}
                onSelect={(selected) => setSelectedItem(selected)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Stream Selector Drawer/Modal */}
      {selectedItem && (
        <StreamSelectorModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          inWatchlist={watchlistIds.has(selectedItem.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onRequireAuth={() => setShowAuthModal(true)}
          onPlayStream={handlePlayStream}
        />
      )}

      {/* Direct Stream Modal using Magnet Links */}
      {showDirectStream && (
        <DirectStreamModal
          onClose={() => setShowDirectStream(false)}
          onPlayStream={handlePlayStream}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Fullscreen Video Player */}
      {activeStream && (
        <VideoPlayerModal
          stream={activeStream.stream}
          title={activeStream.title}
          mediaInfo={activeStream.mediaInfo}
          onClose={() => setActiveStream(null)}
        />
      )}
    </div>
  );
}
