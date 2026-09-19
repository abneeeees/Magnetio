"use client";

import React, { useRef, useState, useEffect } from "react";
import { TorrentStream } from "@/types";
import { buildStreamUrl } from "@/lib/api";
import { X, ExternalLink, Copy, Check, AlertCircle, RefreshCw } from "lucide-react";

interface VideoPlayerModalProps {
  stream: TorrentStream;
  title: string;
  onClose: () => void;
}

export function VideoPlayerModal({
  stream,
  title,
  onClose,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(true);

  const streamUrl = buildStreamUrl(
    stream.infoHash,
    stream.magnet,
    stream.fileIdx
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCopyMagnet = () => {
    navigator.clipboard.writeText(stream.magnet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRetry = () => {
    setError(null);
    setIsBuffering(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-[#1f2434] bg-[#0c0e14] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-sm font-semibold text-white truncate max-w-md sm:max-w-xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMagnet}
            className="flex items-center gap-1.5 rounded-lg border border-[#22293d] bg-[#141824] px-2.5 py-1.5 text-xs text-[#8d97ac] hover:text-white hover:border-[#323c56] transition-colors"
            title="Copy Magnet Link"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Copy Magnet</span>
              </>
            )}
          </button>

          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[#22293d] bg-[#141824] px-2.5 py-1.5 text-xs text-[#8d97ac] hover:text-white hover:border-[#323c56] transition-colors"
            title="Open stream in new tab / VLC"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Raw Stream</span>
          </a>

          <button
            onClick={onClose}
            className="rounded-lg bg-[#1a1f2e] p-1.5 text-[#8d97ac] hover:bg-red-600 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Video Viewport */}
      <div className="relative flex flex-1 items-center justify-center bg-black">
        <video
          ref={videoRef}
          src={streamUrl}
          controls
          autoPlay
          playsInline
          className="h-full w-full max-h-[calc(100vh-60px)] object-contain"
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => {
            setIsBuffering(false);
            setError(null);
          }}
          onCanPlay={() => setIsBuffering(false)}
          onError={() => {
            setIsBuffering(false);
            setError(
              "Unable to play video stream. The torrent may still be connecting to peers or the format requires transcoding."
            );
          }}
        />

        {/* Buffering Indicator */}
        {isBuffering && !error && (
          <div className="pointer-events-none absolute flex flex-col items-center justify-center rounded-xl bg-black/75 px-6 py-4 backdrop-blur-sm border border-[#22293d]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent mb-3" />
            <span className="text-xs font-medium text-white">
              Buffering torrent stream from peers...
            </span>
            <span className="text-[10px] text-[#788298] mt-1">
              Initial piece download takes a few seconds
            </span>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute max-w-md rounded-xl border border-red-500/30 bg-[#140b0e]/95 p-6 text-center backdrop-blur-md">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
            <h3 className="text-sm font-semibold text-white mb-1">Playback Error</h3>
            <p className="text-xs text-[#a87f87] mb-4">{error}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Stream
              </button>
              <a
                href={streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-[#3b232a] bg-[#221217] px-4 py-2 text-xs text-white hover:bg-[#2c171e]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in VLC / External Player
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
