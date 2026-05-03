import type { NextApiRequest, NextApiResponse } from "next";

const BASE = "https://hillview.tv";

function escapeXml(s: string): string {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const [videosRes, playlistsRes] = await Promise.all([
		fetch("https://api.hillview.tv/video/v1.1/list/videos?limit=500&offset=0&sort=desc&by=views"),
		fetch("https://api.hillview.tv/video/v1.1/list/playlists?limit=100&offset=0"),
	]);

	const videos: any[] = videosRes.ok ? await videosRes.json() : [];
	const playlists: any[] = playlistsRes.ok ? await playlistsRes.json() : [];

	const staticPages = [
		{ loc: `${BASE}/`, priority: "1.0", changefreq: "daily" },
		{ loc: `${BASE}/content`, priority: "0.9", changefreq: "daily" },
		{ loc: `${BASE}/playlists`, priority: "0.8", changefreq: "weekly" },
	];

	const videoPages = videos.map((v) => ({
		loc: `${BASE}/watch?v=${escapeXml(v.uuid)}`,
		priority: "0.7",
		changefreq: "monthly",
		lastmod: v.inserted_at
			? new Date(v.inserted_at).toISOString().split("T")[0]
			: undefined,
	}));

	const playlistPages = playlists.map((p) => ({
		loc: `${BASE}/playlist/${escapeXml(p.route)}`,
		priority: "0.6",
		changefreq: "weekly",
	}));

	const allPages: Array<{ loc: string; priority: string; changefreq: string; lastmod?: string }> = [
		...staticPages,
		...videoPages,
		...playlistPages,
	];

	const urls = allPages
		.map(
			(p) =>
				`  <url>\n    <loc>${p.loc}</loc>${
					p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ""
				}\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
		)
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

	res.setHeader("Content-Type", "application/xml");
	res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
	res.status(200).send(xml);
}
