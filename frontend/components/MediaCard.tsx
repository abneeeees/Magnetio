"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MediaItem } from "@/types";
import { Play, Film, Bookmark } from "lucide-react";

interface MediaCardProps {
  item: MediaItem;
  onSelect: (item: MediaItem) => void;
  inWatchlist?: boolean;
  watchlistBusy?: boolean;
  onToggleWatchlist?: (item: MediaItem) => void;
}

export function MediaCard({
  item,
  onSelect,
  inWatchlist = false,
  watchlistBusy = false,
  onToggleWatchlist,
}: MediaCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-[#1b1f2b] bg-[#12151e] transition-all duration-200 hover:-translate-y-1 hover:border-[#2e374d] hover:shadow-lg hover:shadow-black/60"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#161a26]">
        {item.poster && !imgError ? (
          <Image
            src={item.poster}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-[#555d71]">
            <Film className="mb-2 h-8 w-8 stroke-[1.5]" />
            <span className="text-xs font-medium">{item.name}</span>
          </div>
        )}

        {/* Hover Overlay with Play Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform duration-200 group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </div>
        </div>

        {onToggleWatchlist && (
          <button
            type="button"
            title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            disabled={watchlistBusy}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(item);
            }}
            className={`absolute top-2 left-2 z-10 rounded-md p-1.5 backdrop-blur-sm transition-colors ${
              inWatchlist
                ? "bg-red-600 text-white"
                : "bg-black/70 text-[#c0c6d4] opacity-100 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
            } disabled:opacity-50`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${inWatchlist ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Top Badges */}
        {item.genre && item.genre.length > 0 && (
          <div className="absolute top-2 right-2 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-medium backdrop-blur-sm">
            {item.genre[0]}
          </div>
        )}
      </div>

      {/* Title & Metadata */}
      <div className="flex flex-1 flex-col justify-between p-2.5">
        <h3 className="line-clamp-1 text-xs font-semibold text-[#e2e5eb] transition-colors group-hover:text-red-400">
          {item.name}
        </h3>
        <div className="mt-1 flex items-center justify-between text-[11px] text-[#6b7385]">
          <span className="capitalize">{item.releaseInfo}</span>
        </div>
      </div>
    </div>
  );
}
