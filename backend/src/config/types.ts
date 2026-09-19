export interface TorrentioUrl {
  filterParams?: string
  streamType: string
  id: string
}

export interface Stream {
  title: string
  infoHash: string
  fileIdx?: number
  sources?: string[]
}

export interface TorrentMetaData {
  streams?: Stream[]
} 