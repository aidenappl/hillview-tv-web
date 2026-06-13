// Shared video-URL resolution — single source of truth for the watch page,
// the sitemap video extension, and VideoObject structured data.

const CLOUDFLARE_CUSTOMER = "customer-nakrsdfbtn3mdz5z.cloudflarestream.com";

export interface VideoUrlInput {
  url?: string | null;
  download_url?: string | null;
  cloudflare_id?: string | null;
}

// Player/embed URL (iframe), or null if the source can't be embedded.
export const getEmbedUrl = (video: VideoUrlInput): string | null => {
  const url = video.url ?? "";

  if (url.includes("cloudflarestream.com") || url.includes("videodelivery.net")) {
    return url.replaceAll("/manifest/video.m3u8", "/iframe");
  }

  if (video.cloudflare_id) {
    return `https://${CLOUDFLARE_CUSTOMER}/${video.cloudflare_id}/iframe`;
  }

  if (url.includes("vimeo")) {
    const match = url.match(/\/external\/(\d+)\.m3u8/);
    if (match) return `https://player.vimeo.com/video/${match[1]}`;
  }

  return null;
};

// Direct media file URL (preferred by Google as VideoObject.contentUrl / video
// sitemap content_loc). Only a real downloadable file qualifies — an HLS .m3u8
// manifest is not a media file, so we return null and rely on the embed/player URL.
export const getContentUrl = (video: VideoUrlInput): string | null => {
  return video.download_url || null;
};

// Seconds -> human clock (e.g. 202 -> "3:22", 3725 -> "1:02:05"). "" if missing.
export const formatDuration = (seconds: number | null | undefined): string => {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return "";
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

export interface Cue {
  start: number; // seconds
  text: string;
}

// Seconds -> clock for a transcript timestamp; unlike formatDuration, 0 -> "0:00".
export const formatTimestamp = (seconds: number): string => {
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

// Parse a "HH:MM:SS.mmm" / "MM:SS.mmm" WebVTT timestamp into seconds.
const parseTimestamp = (ts: string): number => {
  const parts = ts.trim().split(":");
  if (parts.length < 2) return 0;
  const secs = parseFloat(parts[parts.length - 1]) || 0;
  const mins = parseInt(parts[parts.length - 2], 10) || 0;
  const hours = parts.length >= 3 ? parseInt(parts[parts.length - 3], 10) || 0 : 0;
  return hours * 3600 + mins * 60 + secs;
};

// Parse WebVTT into cues (start time + text), collapsing consecutive duplicate
// lines that auto-generated captions often emit.
export const parseVtt = (vtt: string | null | undefined): Cue[] => {
  if (!vtt) return [];
  const blocks = vtt.replace(/\r\n/g, "\n").split("\n\n");
  const cues: Cue[] = [];
  let lastText = "";
  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const timingIdx = lines.findIndex((l) => l.includes("-->"));
    if (timingIdx === -1) continue;
    const start = parseTimestamp(lines[timingIdx].split("-->")[0]);
    const text = lines
      .slice(timingIdx + 1)
      .join(" ")
      .trim();
    if (!text || text === lastText) continue;
    cues.push({ start, text });
    lastText = text;
  }
  return cues;
};

// Seconds -> ISO 8601 duration (e.g. 202 -> "PT3M22S"). null for missing/invalid.
export const toIso8601Duration = (
  seconds: number | null | undefined,
): string | null => {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return null;
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}` || "PT0S";
};
