"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MediaItem, TorrentStream, parseStreamTitle } from "@/types";
import { fetchStreams } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Play,
  Loader2,
  Users,
  HardDrive,
  AlertCircle,
  Copy,
  Check,
  Bookmark,
} from "lucide-react";

interface StreamSelectorModalProps {
  item: MediaItem;
  onClose: () => void;
  inWatchlist?: boolean;
  onToggleWatchlist?: (item: MediaItem) => Promise<boolean>;
  onRequireAuth?: () => void;
  onPlayStream: (
    stream: TorrentStream,
    title: string,
    mediaInfo?: {
      mediaId: string;
      title: string;
      mediaType: string;
      seasonNum?: number;
      episodeNum?: number;
      posterUrl?: string;
    },
  ) => void;
}

export function StreamSelectorModal({
  item,
  onClose,
  inWatchlist = false,
  onToggleWatchlist,
  onRequireAuth,
  onPlayStream,
}: StreamSelectorModalProps) {
  const { user } = useAuth();
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const [streams, setStreams] = useState<TorrentStream[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [watchlistLoading, setWatchlistLoading] = useState<boolean>(false);
  const [watchlistError, setWatchlistError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchStreams(item.type, item.id, season, episode)
      .then((data) => {
        if (isMounted) {
          setStreams(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load streams from backend.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [item.id, item.type, season, episode]);

  const toggleWatchlist = async () => {
    if (!user) {
      onRequireAuth?.();
      return;
    }
    if (!onToggleWatchlist) return;
    setWatchlistError(null);
    setWatchlistLoading(true);
    try {
      const ok = await onToggleWatchlist(item);
      if (!ok) setWatchlistError("Could not update watchlist.");
    } catch (err) {
      console.error("Watchlist toggle failed:", err);
      setWatchlistError(err instanceof Error ? err.message : "Could not update watchlist.");
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleCopyMagnet = (magnet: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(magnet);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 backdrop-blur-sm sm:p-4">
      <div className="relative flex max-h-[calc(100dvh-1rem)] min-h-0 w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-[#1f2537] bg-[#0f121a] shadow-2xl sm:max-h-[90vh] sm:rounded-xl">
        {/* Header */}
        <div className="relative flex items-center justify-between gap-2 border-b border-[#1b202e] bg-[#141824] px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            {/* <span className="rounded bg-red-600/10 px-2 py-0.5 text-xs font-mono font-semibold uppercase text-red-400 border border-red-500/20">
              {item.type}
            </span> */}
            <h2 className="line-clamp-1 min-w-0 text-sm font-semibold text-white sm:text-base">
              {item.name} {item.releaseInfo ? `(${item.releaseInfo})` : ""}
            </h2>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            <button
              onClick={toggleWatchlist}
              disabled={watchlistLoading}
              aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              className={`flex items-center gap-1.5 rounded-lg border p-2 text-xs font-medium transition-colors sm:px-3 sm:py-1.5 ${
                inWatchlist
                  ? "border-red-500/40 bg-red-500/10 text-red-400"
                  : "border-[#252c40] bg-[#181d2c] text-[#8e98ae] hover:text-white"
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${inWatchlist ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{inWatchlist ? "Saved" : "Watchlist"}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close stream selector"
              className="rounded-lg p-1.5 text-[#737c92] transition-colors hover:bg-[#1f2639] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        {watchlistError && (
          <div className="border-b border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400 sm:px-6">
            {watchlistError}
          </div>
        )}

        {/* Media Details Banner */}
        <div className="flex gap-3 border-b border-[#1b202e] bg-[#0c0e14] p-3 sm:gap-4 sm:p-6">
          {item.poster && (
            <div className="relative h-32 w-[5.33rem] flex-shrink-0 overflow-hidden rounded-lg border border-[#232a3d] bg-[#161a26] sm:h-36 sm:w-24">
              <Image src={item.poster} alt={item.name} fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <p className="line-clamp-3 text-xs leading-relaxed text-[#9aa2b5] sm:line-clamp-4">
              {item.description || "No synopsis available."}
            </p>
            {item.genre && item.genre.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.genre.map((g) => (
                  <span
                    key={g}
                    className="rounded border border-[#20273a] bg-[#171c2a] px-2 py-0.5 text-[11px] text-[#7d869b]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TV Series Season / Episode Selector */}
        {item.type === "series" && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#1b202e] bg-[#121622] px-3 py-3 sm:px-6">
            {/* <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#7d869b]">Season</label>
              <input
                type="number"
                min={1}
                max={50}
                value={season}
                onChange={(e) => setSeason(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 rounded border border-[#252c40] bg-[#171c2b] px-2.5 py-1 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div> */}
            {/* <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#7d869b]">Episode</label>
              <input
                type="number"
                min={1}
                max={100}
                value={episode}
                onChange={(e) => setEpisode(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 rounded border border-[#252c40] bg-[#171c2b] px-2.5 py-1 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div> */}

            <div className="grid grid-cols-2 gap-3">
              {/* Season Selector */}
              <div className="flex flex-col gap-1.5">
                {/* <label className="text-xs font-medium text-[#7d869b]">
                  Season
                </label> */}
                <select
                  value={season}
                  onChange={(e) => setSeason(Number(e.target.value))}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-[#252c40] bg-[#171c2b] px-3 py-2.5 text-sm text-white transition outline-none hover:border-[#3b455e] focus:border-red-500"
                >
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((s) => (
                    <option key={s} value={s}>
                      Season {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Episode Selector */}
              <div className="flex flex-col gap-1.5">
                {/* <label className="text-xs font-medium text-[#7d869b]">
                  Episode
                </label> */}
                <select
                  value={episode}
                  onChange={(e) => setEpisode(Number(e.target.value))}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-[#252c40] bg-[#171c2b] px-3 py-2.5 text-sm text-white transition outline-none hover:border-[#3b455e] focus:border-red-500"
                >
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((ep) => (
                    <option key={ep} value={ep}>
                      Episode {ep}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Streams List */}
        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-[#737c92] uppercase">
              Available Streams {streams.length > 0 && `(${streams.length})`}
            </h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#737c92]">
              <Loader2 className="mb-3 h-7 w-7 animate-spin text-red-500" />
              <p className="text-xs">Fetching torrent streams from backend...</p>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          ) : streams.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#737c92]">
              No active torrent streams found for this title.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {streams.map((stream, idx) => {
                const info = parseStreamTitle(stream.title);
                return (
                  <div
                    key={stream.infoHash + idx}
                    onClick={() =>
                      onPlayStream(stream, `${item.name} (${info.quality})`, {
                        mediaId: item.id,
                        title: item.name,
                        mediaType: item.type,
                        seasonNum: item.type === "series" ? season : undefined,
                        episodeNum: item.type === "series" ? episode : undefined,
                        posterUrl: item.poster,
                      })
                    }
                    className="group flex cursor-pointer flex-col items-stretch gap-3 rounded-lg border border-[#1c2232] bg-[#131722] p-3 transition-all hover:border-red-500/40 hover:bg-[#181d2c] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:flex-1">
                      {/* Quality Badge */}
                      <span
                        className={`flex-shrink-0 rounded px-2 py-1 font-mono text-[11px] font-bold ${
                          info.quality === "4K"
                            ? "border border-purple-800/40 bg-purple-950/80 text-purple-300"
                            : info.quality === "1080p"
                              ? "border border-blue-800/40 bg-blue-950/80 text-blue-300"
                              : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {info.quality}
                      </span>

                      {/* Stream Title & Details */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-xs font-medium text-[#dce0ea] transition-colors group-hover:text-red-400">
                          {info.rawTitle}
                        </span>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6b758b]">
                          {info.size !== "—" && (
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              {info.size}
                            </span>
                          )}
                          {info.seeders !== "—" && (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Users className="h-3 w-3" />
                              {info.seeders} seeds
                            </span>
                          )}
                          <span className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#fffff] backdrop-blur-sm">
                            {info.provider}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full flex-shrink-0 items-center justify-end gap-2 sm:w-auto">
                      <button
                        type="button"
                        title="Copy Magnet Link"
                        onClick={(e) => handleCopyMagnet(stream.magnet, idx, e)}
                        className="rounded-lg p-2 text-[#60697f] transition-colors hover:bg-[#20273a] hover:text-white"
                      >
                        {copiedIndex === idx ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>

                      <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all group-hover:bg-red-500">
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Play
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
