import type { AnnounceRequest } from "../shared";
import { parseMagnetLink } from "./src/parser";
import { httpTrackerClient } from "./src/tracker/http-tracker";
import { udpTrackerClient } from "./src/tracker/udp-tracker";

const magnet = "magnet:?xt=urn:btih:2BEAB42339E04A1AF37D6CC3E7A52EA120AC95CF&dn=Assassin%26%23039%3Bs+Creed+Shadows%3A+Premium+Edition+%28v1.1.11+%2B+All+DLCs+%2B+5+Bonus+OSTs%2C+MULTi13%29+%5BFitGirl+Repack%2C+Selective+Download+-+from+77.3+GB%5D&tr=udp%3A%2F%2Fopentor.net%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.qu.ax%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.fnix.net%3A6969%2Fannounce&tr=udp%3A%2F%2Fevan.im%3A6969%2Fannounce&tr=udp%3A%2F%2Fmartin-gebhardt.eu%3A25%2Fannounce&tr=https%3A%2F%2Fshahidrazi.online%3A443%2Fannounce&tr=http%3A%2F%2Fwegkxfcivgx.ydns.eu%3A80%2Fannounce&tr=http%3A%2F%2Flucke.fenesisu.moe%3A6969%2Fannounce&tr=udp%3A%2F%2Fextracker.dahrkael.net%3A6969%2Fannounce&tr=https%3A%2F%2Ftracker.alaskantf.com%3A443%2Fannounce&tr=https%3A%2F%2Ftracker.qingwa.pro%3A443%2Fannounce&tr=udp%3A%2F%2Ftracker.playground.ru%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce"

function hexToUint8Array(hexString: string): Uint8Array {
  const cleanHex = hexString.replace(/^urn:btih:/i, "").trim();

  if (cleanHex.length !== 40) {
    throw new Error(
      `Invalid infoHash hex length. Expected 40 characters, got ${cleanHex.length}`,
    );
  }

  const bytes = new Uint8Array(20);
  for (let i = 0; i < 20; i++) {
    bytes[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function generatePeerId(): string {
  const prefix = "-MG0001-";
  const random = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 36).toString(36),
  ).join("");
  return prefix + random;
}

function isHttpTracker(url: string): boolean {
  return url.startsWith("http:") || url.startsWith("https:");
}

function isUdpTracker(url: string): boolean {
  return url.startsWith("udp:");
}

const parsed = parseMagnetLink(magnet);
const infohash = hexToUint8Array(parsed.infoHash);
const peerid = generatePeerId();

console.log(`trackers: ${(parsed.trackers ?? []).length} total\n`,);

for (const tracker of parsed.trackers ?? []) {
  if (!isHttpTracker(tracker)) continue;
  try {
    const response = await httpTrackerClient(tracker, {
      infoHash: infohash,
      peerId: peerid,
      port: 6881,
      uploaded: 0n,
      downloaded: 0n,
      compact: true,
      event: "started",
    });
        
    console.log(response);
  } catch (err) {
    console.error(tracker, "failed: ", err instanceof Error ? err.message : err);
  }
}
