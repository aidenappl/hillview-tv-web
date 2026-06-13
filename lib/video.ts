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

// A parsed WebVTT cue payload node: either plain text or a markup tag with
// children (voice/class/b/i/u/lang/ruby). On-video-only features (positioning,
// regions, ::cue STYLE) are intentionally not modeled — irrelevant to a transcript.
export type VttNode =
  | { type: "text"; value: string }
  | {
      type: "tag";
      tag: string;
      classes: string[];
      annotation?: string;
      children: VttNode[];
    };

export interface Cue {
  start: number; // seconds
  end: number; // seconds
  voice?: string; // speaker from <v Speaker>
  nodes: VttNode[]; // styled payload tree
  text: string; // plain text (transcript / JSON-LD / search)
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  lrm: "‎",
  rlm: "‏",
};

const decodeEntities = (s: string): string =>
  s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, e: string) => {
    if (e[0] === "#") {
      const code =
        e[1] === "x" || e[1] === "X"
          ? parseInt(e.slice(2), 16)
          : parseInt(e.slice(1), 10);
      return Number.isNaN(code) ? m : String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[e] ?? m;
  });

// Tokenize a cue payload into a node tree. Unclosed tags (common for <v>) stay
// open to end-of-cue; inline timestamp tags (<00:00:01.000>) are dropped since
// we highlight at cue granularity.
const tokenizePayload = (payload: string): VttNode[] => {
  const root: Extract<VttNode, { type: "tag" }> = {
    type: "tag",
    tag: "root",
    classes: [],
    children: [],
  };
  const stack: Extract<VttNode, { type: "tag" }>[] = [root];
  const top = () => stack[stack.length - 1];
  const pushText = (t: string) => {
    if (t) top().children.push({ type: "text", value: decodeEntities(t) });
  };

  const re = /<([^>]*)>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(payload))) {
    pushText(payload.slice(last, m.index));
    last = re.lastIndex;
    const raw = m[1].trim();
    if (raw === "") continue;
    if (raw.startsWith("/")) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    // Inline timestamp tag — ignore (cue-level highlighting).
    if (/^\d{1,2}:\d{2}/.test(raw) || /^\d+(\.\d+)?$/.test(raw)) continue;
    const spaceIdx = raw.indexOf(" ");
    const namePart = spaceIdx === -1 ? raw : raw.slice(0, spaceIdx);
    const annotation =
      spaceIdx === -1 ? undefined : raw.slice(spaceIdx + 1).trim();
    const dotParts = namePart.split(".");
    const node: Extract<VttNode, { type: "tag" }> = {
      type: "tag",
      tag: dotParts[0].toLowerCase(),
      classes: dotParts.slice(1),
      annotation,
      children: [],
    };
    top().children.push(node);
    stack.push(node);
  }
  pushText(payload.slice(last));
  return root.children;
};

const collectText = (nodes: VttNode[]): string =>
  nodes
    .map((n) => (n.type === "text" ? n.value : collectText(n.children)))
    .join("");

const findVoice = (nodes: VttNode[]): string | undefined => {
  for (const n of nodes) {
    if (n.type === "tag") {
      if (n.tag === "v" && n.annotation) return n.annotation;
      const nested = findVoice(n.children);
      if (nested) return nested;
    }
  }
  return undefined;
};

// Binary search for the index of the latest cue whose start <= t (keeps the last
// line highlighted through inter-cue gaps). Returns -1 before the first cue.
export const findActiveCueIndex = (cues: Cue[], t: number): number => {
  let lo = 0;
  let hi = cues.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cues[mid].start <= t) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
};

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

// Parse WebVTT into styled cues, collapsing consecutive duplicate lines that
// auto-generated rolling captions often emit. Skips header/NOTE/STYLE/REGION.
export const parseVtt = (vtt: string | null | undefined): Cue[] => {
  if (!vtt) return [];
  const blocks = vtt.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split(/\n\n+/);
  const cues: Cue[] = [];
  let lastText = "";
  for (const block of blocks) {
    const lines = block.split("\n");
    const head = (lines[0] ?? "").trim();
    if (
      head.startsWith("WEBVTT") ||
      head.startsWith("NOTE") ||
      head.startsWith("STYLE") ||
      head.startsWith("REGION")
    ) {
      continue;
    }
    const timingIdx = lines.findIndex((l) => l.includes("-->"));
    if (timingIdx === -1) continue;
    const [startRaw, restRaw = ""] = lines[timingIdx].split("-->");
    const endRaw = restRaw.trim().split(/\s+/)[0]; // drop cue settings
    const payload = lines
      .slice(timingIdx + 1)
      .join("\n")
      .trim();
    if (!payload) continue;
    const nodes = tokenizePayload(payload);
    const text = collectText(nodes).replace(/\s+/g, " ").trim();
    if (!text || text === lastText) continue;
    cues.push({
      start: parseTimestamp(startRaw),
      end: parseTimestamp(endRaw),
      voice: findVoice(nodes),
      nodes,
      text,
    });
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
