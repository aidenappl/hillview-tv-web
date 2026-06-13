import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { promisify } from "util";
import { pipeline } from "stream";

export const config = {
  api: {
    responseLimit: false,
  },
};

const ALLOWED_HOSTS = [
  "content.hillview.tv",
  "customer-nakrsdfbtn3mdz5z.cloudflarestream.com",
];

const isAllowedUrl = (raw: string): boolean => {
  try {
    const parsed = new URL(raw);
    return (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      ALLOWED_HOSTS.includes(parsed.hostname)
    );
  } catch {
    return false;
  }
};

// Sanitized base name (no extension) for Content-Disposition, per RFC 6266:
// an ASCII-only fallback `filename` plus a UTF-8 `filename*`.
const buildContentDisposition = (rawTitle: string): string => {
  const cleaned = rawTitle
    .replace(/[\x00-\x1f]/g, "")
    .replace(/[/\\"';%]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.+$/, "")
    .slice(0, 150);
  const base = cleaned || "video";
  const ascii = base.replace(/[^\x20-\x7e]/g, "_");
  const encoded = encodeURIComponent(base).replace(
    /['()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase(),
  );
  return `attachment; filename="${ascii}.mp4"; filename*=UTF-8''${encoded}.mp4`;
};

const downloadFile = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).send("Method not allowed");
    return;
  }

  const { url, filename } = req.query;

  if (!url || typeof url !== "string") {
    res.status(400).send("URL is required");
    return;
  }

  if (!isAllowedUrl(url)) {
    res.status(400).send("Invalid download URL");
    return;
  }

  try {
    const range = req.headers.range;
    const response = await axios.get(url, {
      responseType: "stream",
      headers: range ? { Range: range } : undefined,
      validateStatus: (status) => status === 200 || status === 206,
    });

    res.status(response.status);
    if (response.headers["content-type"]) {
      res.setHeader("Content-Type", response.headers["content-type"]);
    }
    if (response.headers["content-length"]) {
      res.setHeader("Content-Length", response.headers["content-length"]);
    }
    if (response.headers["accept-ranges"]) {
      res.setHeader("Accept-Ranges", response.headers["accept-ranges"]);
    }
    if (response.headers["content-range"]) {
      res.setHeader("Content-Range", response.headers["content-range"]);
    }
    res.setHeader(
      "Content-Disposition",
      buildContentDisposition(typeof filename === "string" ? filename : ""),
    );

    const streamPipeline = promisify(pipeline);
    await streamPipeline(response.data, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error downloading file:", message);
    if (!res.headersSent) {
      res.status(500).send("Error downloading file");
    } else {
      res.destroy();
    }
  }
};

export default downloadFile;
