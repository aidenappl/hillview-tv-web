import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { promisify } from "util";
import { pipeline } from "stream";

const downloadFile = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    res.status(400).send("URL is required");
    return;
  }

  try {
    const response = await axios.get(url, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader("Content-Length", response.headers["content-length"]);
    res.setHeader("Content-Disposition", `attachment; filename=file.mp4`);

    const streamPipeline = promisify(pipeline);
    await streamPipeline(response.data, res);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error downloading file:", message);
    res.status(500).send("Error downloading file");
  }
};

export default downloadFile;
