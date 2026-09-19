"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MediaItem, TorrentStream, parseStreamTitle } from "@/types";
import { fetchStreams } from "@/lib/api";
import { X, Play, Loader2, Users, HardDrive, AlertCircle, Copy, Check } from "lucide-react";

interface StreamSelectorModalProps {
  item: MediaItem;
  onClose: () => void;
  onPlayStream: (stream: TorrentStream, title: string) => void;
}

export function StreamSelectorModal({
  item,
  onClose,
  onPlayStream,
}: StreamSelectorModalProps) {
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const [streams, setStreams] = useState<TorrentStream[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  const handleCopyMagnet = (magnet: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(magnet);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#1f2537] bg-[#0f121a] shadow-2xl">
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-[#1b202e] px-6 py-4 bg-[#141824]">
          <div className="flex items-center gap-3">
            <span className="rounded bg-red-600/10 px-2 py-0.5 text-xs font-mono font-semibold uppercase text-red-400 border border-red-500/20">
              {item.type}
            </span>
            <h2 className="text-base font-semibold text-white line-clamp-1">
              {item.name} {item.releaseInfo ? `(${item.releaseInfo})` : ""}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#737c92] hover:bg-[#1f2639] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Media Details Banner */}
        <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-[#1b202e] bg-[#0c0e14]">
          {item.poster && (
            <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-[#232a3d] bg-[#161a26]">
              <Image
                src={item.poster}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="flex flex-1 flex-col justify-between">
            <p className="text-xs leading-relaxed text-[#9aa2b5] line-clamp-4">
              {item.description || "No synopsis available."}
            </p>
            {item.genre && item.genre.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.genre.map((g) => (
                  <span
                    key={g}
                    className="rounded bg-[#171c2a] px-2 py-0.5 text-[11px] text-[#7d869b] border border-[#20273a]"
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
          <div className="flex items-center gap-4 px-6 py-3 border-b border-[#1b202e] bg-[#121622]">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#7d869b]">Season</label>
              <input
                type="number"
                min={1}
                max={50}
                value={season}
                onChange={(e) => setSeason(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 rounded border border-[#252c40] bg-[#171c2b] px-2.5 py-1 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#7d869b]">Episode</label>
              <input
                type="number"
                min={1}
                max={100}
                value={episode}
                onChange={(e) => setEpisode(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 rounded border border-[#252c40] bg-[#171c2b] px-2.5 py-1 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Streams List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737c92]">
              Available Streams {streams.length > 0 && `(${streams.length})`}
            </h3>
            <span className="text-[11px] text-[#555d72]">Sorted by Quality & Seeds</span>
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
                    onClick={() => onPlayStream(stream, `${item.name} (${info.quality})`)}
                    className="group flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-[#1c2232] bg-[#131722] p-3.5 transition-all hover:border-red-500/40 hover:bg-[#181d2c]"
                  >
                    <div className="flex flex-1 items-center gap-3 min-w-0">
                      {/* Quality Badge */}
                      <span
                        className={`flex-shrink-0 rounded px-2 py-1 text-[11px] font-mono font-bold ${
                          info.quality === "4K"
                            ? "bg-purple-950/80 text-purple-300 border border-purple-800/40"
                            : info.quality === "1080p"
                            ? "bg-blue-950/80 text-blue-300 border border-blue-800/40"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {info.quality}
                      </span>

                      {/* Stream Title & Details */}
                      <div className="flex flex-1 flex-col min-w-0">
                        <span className="truncate text-xs font-medium text-[#dce0ea] group-hover:text-red-400 transition-colors">
                          {info.rawTitle}
                        </span>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-[#6b758b]">
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
                          <span className="rounded bg-[#1c2130] px-1.5 py-0.2 text-[10px] text-[#7d879c]">
                            {info.provider}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        title="Copy Magnet Link"
                        onClick={(e) => handleCopyMagnet(stream.magnet, idx, e)}
                        className="rounded-lg p-2 text-[#60697f] hover:bg-[#20273a] hover:text-white transition-colors"
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
