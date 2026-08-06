import type { Peer, AnnounceRequest, AnnounceResponse } from "../../../shared";
import bencode from "bencode";

function percentEncodeInfohashBuffer(infoHashBuffer: Uint8Array): string {
  return Array.from(infoHashBuffer)
    .map(b => '%' + b.toString(16).padStart(2, '0').toUpperCase())
    .join('');
}

function constructAnnounceUrl(
  announceUrl: string,
  req: AnnounceRequest,
) : string {

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

function parseTrackerResponse(response: Uint8Array): AnnounceResponse {
  const decoded = bencode.decode(response);
  if (decoded["failure reason"]) {
      throw new Error(decoded["failure reason"].toString());
  }

  const interval = Number(decoded.interval);
  const complete = Number(decoded.complete);
  const incomplete = Number(decoded.incomplete);

  let parsedPeers: Peer[] = [];
  
  if (Buffer.isBuffer(decoded.peers) || decoded.peers instanceof Uint8Array) {
      parsedPeers = parseCompactPeers(decoded.peers);

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

function parseCompactPeers(peersBuffer: Uint8Array): Peer[] {
  const peers: Array<{ ip: string; port: number }> = [];
  
  for (let i = 0; i < peersBuffer.length; i += 6) {
    const ip = `${peersBuffer[i]}.${peersBuffer[i + 1]}.${peersBuffer[i + 2]}.${peersBuffer[i + 3]}`;
    const port = (peersBuffer[i + 4] << 8) | peersBuffer[i + 5];
    
    peers.push({ ip, port });
  }

  return peers;
}
 
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
    
    // if (!response.ok) {
    //   throw new Error(`Tracker ${announceUrl} returned ${response.status}`);
    // }

    console.log(response);
    
    const arrBuff = await response.arrayBuffer();
    const result = parseTrackerResponse(new Uint8Array(arrBuff));
    return result;
    
  } finally {
    clearTimeout(timer);
  }
}