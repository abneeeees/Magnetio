"use client";

import React, { useState } from "react";
import { TorrentStream } from "@/types";
import { X, Play, Magnet } from "lucide-react";

interface DirectStreamModalProps {
  onClose: () => void;
  onPlayStream: (stream: TorrentStream, title: string) => void;
}

export function DirectStreamModal({
  onClose,
  onPlayStream,
}: DirectStreamModalProps) {
  const [input, setInput] = useState("");
  const [fileIdx, setFileIdx] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleStartStream = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) {
      setError("Please enter a magnet link or 40-character infoHash");
      return;
    }

    let infoHash = raw;
    let magnet = raw;

    // Check if it's a magnet link
    if (raw.startsWith("magnet:?")) {
      const match = raw.match(/xt=urn:btih:([a-fA-F0-9]{40})/i);
      if (match) {
        infoHash = match[1];
      }
    } else if (/^[a-fA-F0-9]{40}$/.test(raw)) {
      infoHash = raw;
      magnet = `magnet:?xt=urn:btih:${raw}`;
    }

    const idxNum = fileIdx.trim() !== "" ? parseInt(fileIdx.trim(), 10) : undefined;

    onPlayStream(
      {
        title: "Direct Stream",
        infoHash,
        magnet,
        fileIdx: isNaN(idxNum as any) ? undefined : idxNum,
      },
      `Direct Stream (${infoHash.slice(0, 8)}...)`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[#1f2537] bg-[#0f121a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b202e] bg-[#141824] px-6 py-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Magnet className="h-4 w-4 text-red-500 rotate-45" />
            Direct Stream
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#737c92] hover:bg-[#1f2639] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleStartStream} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8e97ab] mb-1.5">
              Magnet Link or 40-character InfoHash
            </label>
            <textarea
              rows={3}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder="magnet:?xt=urn:btih:... or 03dd34fea0ff15a451c1723062a901aa3a0ad458"
              className="w-full rounded-lg border border-[#22283a] bg-[#131722] p-3 text-xs text-white placeholder-[#5a6378] focus:border-red-500/60 focus:outline-none focus:ring-1 focus:ring-red-500/60 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8e97ab] mb-1.5">
              File Index <span className="text-[#555d72]">(Optional — defaults to largest video file)</span>
            </label>
            <input
              type="number"
              min={0}
              value={fileIdx}
              onChange={(e) => setFileIdx(e.target.value)}
              placeholder="e.g. 0 or 2"
              className="w-full rounded-lg border border-[#22283a] bg-[#131722] px-3 py-2 text-xs text-white placeholder-[#5a6378] focus:border-red-500/60 focus:outline-none focus:ring-1 focus:ring-red-500/60 font-mono"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#22283a] bg-[#141824] px-4 py-2 text-xs font-medium text-[#8e97ab] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-500 transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Stream Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
