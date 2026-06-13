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
