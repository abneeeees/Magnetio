export interface TorrentioResult {
  name: string;
  title: string;
  infoHash: string;
  fileIdx: number;
  behaviorHints: BehaviorHints;
}

export interface BehaviorHints {
  bingeGroup: string;
  filename: string;
}

export interface MagnetLink {
  infoHash: string;
  displayName?: string | undefined;
  trackers?: string[];
  webSeeds?: string[];
  exactLength?: number;
  keywords?: string[];
}

export interface Peer {
    ip: string;
    port: number;
}

export interface AnnounceRequest {
    infoHash: Uint8Array;
    peerId: string;
    port: number;
    uploaded?: bigint;
    downloaded?: bigint;
    left?: bigint;
    compact?: boolean;
    event?: "started" | "completed" | "stopped";
}

export interface AnnounceResponse {
    interval: number;
    complete: number;
    incomplete: number;
    peers: Peer[];
}