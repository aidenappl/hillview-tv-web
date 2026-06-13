import type { NextApiRequest, NextApiResponse } from "next";
import { getEmbedUrl, getContentUrl } from "../../lib/video";

const BASE = "https://hillview.tv";
const VIDEO_NS = "http://www.google.com/schemas/sitemap-video/1.1";

function escapeXml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
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

function isoDate(value: unknown): string | undefined {
	if (!value) return undefined;
	const d = new Date(value as string);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
}

// Builds a <video:video> block for a video, or "" if it can't be embedded.
function videoExtension(v: any): string {
	const embed = getEmbedUrl(v);
	const content = getContentUrl(v);
	if (!embed && !content) return "";

	const title = escapeXml(String(v.title ?? "").slice(0, 100) || "Video");
	const description = escapeXml(
		String(v.description ?? v.title ?? "Video").slice(0, 2048),
	);
	const pubDate = isoDate(v.inserted_at);
	const duration =
		typeof v.duration === "number" && v.duration > 0 && v.duration <= 28800
			? v.duration
			: undefined;

	const lines = [
		`    <video:video>`,
		v.thumbnail ? `      <video:thumbnail_loc>${escapeXml(v.thumbnail)}</video:thumbnail_loc>` : "",
		`      <video:title>${title}</video:title>`,
		`      <video:description>${description}</video:description>`,
		embed ? `      <video:player_loc>${escapeXml(embed)}</video:player_loc>` : "",
		content ? `      <video:content_loc>${escapeXml(content)}</video:content_loc>` : "",
		duration ? `      <video:duration>${duration}</video:duration>` : "",
		pubDate ? `      <video:publication_date>${pubDate}</video:publication_date>` : "",
		`      <video:family_friendly>yes</video:family_friendly>`,
		`    </video:video>`,
	].filter(Boolean);

	return "\n" + lines.join("\n");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const [videos, playlists] = await Promise.all([
		fetchList("https://api.hillview.tv/video/v1.1/list/videos?limit=500&offset=0&sort=desc&by=views"),
		fetchList("https://api.hillview.tv/video/v1.1/list/playlists?limit=100&offset=0"),
	]);

	const staticBlocks = [
		`  <url>\n    <loc>${BASE}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
		`  <url>\n    <loc>${BASE}/content</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`,
		`  <url>\n    <loc>${BASE}/playlists</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
	];

	const videoBlocks = videos
		.filter((v) => v.uuid)
		.map((v) => {
			const loc = `${BASE}/watch?v=${escapeXml(v.uuid)}`;
			const lastmod = isoDate(v.inserted_at)?.split("T")[0];
			return `  <url>\n    <loc>${loc}</loc>${
				lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
			}\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>${videoExtension(
				v,
			)}\n  </url>`;
		});

	const playlistBlocks = playlists
		.filter((p) => p.route)
		.map((p) => {
			const loc = `${BASE}/playlist/${escapeXml(p.route)}`;
			const lastmod = isoDate(p.updated_at ?? p.inserted_at)?.split("T")[0];
			return `  <url>\n    <loc>${loc}</loc>${
				lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
			}\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
		});

	const urls = [...staticBlocks, ...videoBlocks, ...playlistBlocks].join("\n");
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="${VIDEO_NS}">\n${urls}\n</urlset>`;

	const degraded = videos.length === 0 && playlists.length === 0;
	res.setHeader("Content-Type", "application/xml");
	res.setHeader(
		"Cache-Control",
		degraded
			? "s-maxage=300, stale-while-revalidate=600"
			: "public, s-maxage=3600, stale-while-revalidate=86400"
	);
	res.status(200).send(xml);
}
