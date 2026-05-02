import type { NextApiRequest, NextApiResponse } from "next";

const EMBED_URL = "https://vimeo.com/event/1646883/embed/d175f00f9b";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(EMBED_URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      return res.json({ live: false });
    }

    const html = await response.text();

    const isLive =
      html.includes('"live_event"') &&
      !html.includes("ended") &&
      !html.includes("not_started");

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");
    return res.json({ live: isLive });
  } catch {
    return res.json({ live: false });
  }
}
