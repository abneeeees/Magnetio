"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MediaItem } from "@/types";
import { Play, Film } from "lucide-react";

interface MediaCardProps {
  item: MediaItem;
  onSelect: (item: MediaItem) => void;
}

export function MediaCard({ item, onSelect }: MediaCardProps) {
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
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        {item.releaseInfo && (
          <div className="absolute top-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#c0c6d4] backdrop-blur-sm">
            {item.releaseInfo}
          </div>
        )}
      </div>

      {/* Title & Metadata */}
      <div className="flex flex-1 flex-col justify-between p-2.5">
        <h3 className="line-clamp-1 text-xs font-semibold text-[#e2e5eb] group-hover:text-red-400 transition-colors">
          {item.name}
        </h3>
        <div className="mt-1 flex items-center justify-between text-[11px] text-[#6b7385]">
          <span className="capitalize">{item.type}</span>
          {item.genre && item.genre.length > 0 && (
            <span className="line-clamp-1">{item.genre[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
}
