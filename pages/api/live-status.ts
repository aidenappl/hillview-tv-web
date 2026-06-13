import type { NextApiRequest, NextApiResponse } from "next";

const STATUS_URL = "https://vimeo.com/live_event/1646883/status?h=d175f00f9b";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(STATUS_URL, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return res.json({ live: false });
    }

    const data = await response.json();
    const isLive = data?.next_live_clip?.is_live === true;

    return res.json({ live: isLive });
  } catch {
    return res.json({ live: false });
  }
}
