import type { NextApiRequest, NextApiResponse } from "next";

const BASE = "https://hillview.tv";

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// API responses are wrapped in a { success, message, data } envelope.
async function fetchList(url: string): Promise<any[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const body = await res.json();
    return Array.isArray(body?.data) ? body.data : [];
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
    return [];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const [videos, playlists] = await Promise.all([
    fetchList(
      "https://api.hillview.tv/video/v1.1/list/videos?limit=500&offset=0&sort=desc&by=views",
    ),
    fetchList(
      "https://api.hillview.tv/video/v1.1/list/playlists?limit=100&offset=0",
    ),
  ]);

  const staticPages = [
    { loc: `${BASE}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${BASE}/content`, priority: "0.9", changefreq: "daily" },
    { loc: `${BASE}/playlists`, priority: "0.8", changefreq: "weekly" },
  ];

  const videoPages = videos
    .filter((v) => v.uuid)
    .map((v) => {
      const lastmodDate = v.inserted_at ? new Date(v.inserted_at) : null;
      return {
        loc: `${BASE}/watch?v=${escapeXml(v.uuid)}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod:
          lastmodDate && !isNaN(lastmodDate.getTime())
            ? lastmodDate.toISOString().split("T")[0]
            : undefined,
      };
    });

  const playlistPages = playlists
    .filter((p) => p.route)
    .map((p) => ({
      loc: `${BASE}/playlist/${escapeXml(p.route)}`,
      priority: "0.6",
      changefreq: "weekly",
    }));

  const allPages: Array<{
    loc: string;
    priority: string;
    changefreq: string;
    lastmod?: string;
  }> = [...staticPages, ...videoPages, ...playlistPages];

  const urls = allPages
    .map(
      (p) =>
        `  <url>\n    <loc>${p.loc}</loc>${
          p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ""
        }\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  const degraded = videos.length === 0 && playlists.length === 0;
  res.setHeader("Content-Type", "application/xml");
  res.setHeader(
    "Cache-Control",
    degraded
      ? "s-maxage=300, stale-while-revalidate=600"
      : "s-maxage=3600, stale-while-revalidate",
  );
  res.status(200).send(xml);
}
