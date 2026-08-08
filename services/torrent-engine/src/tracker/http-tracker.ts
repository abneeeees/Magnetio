import type { Peer, AnnounceRequest, AnnounceResponse } from "../../../shared";
import bencode from "bencode";

// converts an infohash buffer to a percent-encoded string
function percentEncodeInfohashBuffer(infoHashBuffer: Uint8Array): string {
  return Array.from(infoHashBuffer)
    .map(b => '%' + b.toString(16).padStart(2, '0').toUpperCase())
    .join('');
}

// constructs the announce URL from the request parameters
function constructAnnounceUrl(
  announceUrl: string,
  req: AnnounceRequest,
) : string {

  // constructs the query parameters for the announce URL
  const query_params = [
    `peer_id=${req.peerId}`,
    `port=${req.port}`,
    req.uploaded !== undefined ? `uploaded=${req.uploaded}` : null,
    req.downloaded !== undefined ? `downloaded=${req.downloaded}` : null,
    req.left !== undefined ? `left=${req.left}` : null,
    req.compact !== undefined ? `compact=${req.compact ? 1 : 0}` : null,
    req.event ? `event=${req.event}` : null,
  ].filter(Boolean);

  const info_hash = percentEncodeInfohashBuffer(req.infoHash);
  
  const separator = announceUrl.includes("?") ? "&" : "?";
  const fullUrl = `${announceUrl}${separator}info_hash=${info_hash}&${query_params.join("&")}`;
  return fullUrl;
}

// parses the tracker response and returns an AnnounceResponse object
function parseTrackerResponse(response: Uint8Array): AnnounceResponse {
  const decoded = bencode.decode(response);
  if (decoded["failure reason"]) {
      throw new Error(decoded["failure reason"].toString());
  }

  const interval = Number(decoded.interval);
  const complete = Number(decoded.complete);
  const incomplete = Number(decoded.incomplete);

  let parsedPeers: Peer[] = [];

  // parses the peers from the response when the peers field is a buffer or Uint8Array
  if (Buffer.isBuffer(decoded.peers) || decoded.peers instanceof Uint8Array) {
      parsedPeers = parseCompactPeers(decoded.peers);

  // parses the peers from the response when the peers field is an array of objects
  } else if (Array.isArray(decoded.peers)) {
      parsedPeers = decoded.peers.map(p => ({
        ip: p.ip.toString(),
        port: p.port
    }));
  }

  const finalResponse:AnnounceResponse = {
    interval,
    complete,
    incomplete,
    peers: parsedPeers
  }

  return finalResponse;
}

// parses the peers from the response when the peers field is a buffer or Uint8Array
function parseCompactPeers(peersBuffer: Uint8Array): Peer[] {
  const peers: Array<{ ip: string; port: number }> = [];

  if (peersBuffer.length % 6 != 0) {
    throw new Error("peersBuffer length is not a multiple of 6");
  }
  
  for (let i = 0; i < peersBuffer.length; i += 6) {
    // ip structure here is 4 bytes for the IP address and 2 bytes for the port
    const ip = `${peersBuffer[i]}.${peersBuffer[i + 1]}.${peersBuffer[i + 2]}.${peersBuffer[i + 3]}`;
    const port = (peersBuffer[i + 4] << 8) | peersBuffer[i + 5];
    
    peers.push({ ip, port });
  }

  return peers;
}

// main function that makes the HTTP tracker request and returns the parsed response
export async function httpTrackerClient(
  announceUrl: string,
  req: AnnounceRequest,
  timeoutMs = 8000
): Promise<AnnounceResponse> {
  
  const url = constructAnnounceUrl(announceUrl, req);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    
    if (!response.ok) {
      throw new Error(`Tracker ${announceUrl} returned ${response.status}`);
    }
    
    const arrBuff = await response.arrayBuffer();
    const result = parseTrackerResponse(new Uint8Array(arrBuff));
    return result;
    
  } finally {
    clearTimeout(timer);
  }
}