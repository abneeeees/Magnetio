import type { MagnetLink } from '../../shared/index';

export function parseMagnetLink(uri: string): MagnetLink {
  if (!uri.startsWith("magnet:?")) {
    throw new Error("Invalid magnet link");
  }

  const url = new URL(uri);
  const params = new URLSearchParams(url.search);
  const infoHash = params.get("xt");
  const displayName = params.get("dn") ?? undefined;
  if (!infoHash) {
    throw new Error("Missing info hash");
  }

  return {
    infoHash,
    displayName,
    trackers: params.getAll("tr"),
    webSeeds: params.getAll("ws"),
    exactLength: params.get("xl") ? parseInt(params.get("xl")!) : undefined,
    keywords: params.get("kt") ? params.get("kt")!.split(",") : [],
  };
}
