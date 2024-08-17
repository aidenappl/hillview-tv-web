import axios from "axios";
import { promisify } from "util";
import { pipeline } from "stream";

const downloadFile = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    res.status(400).send("URL is required");
    return;
  }

  try {
    const response = await axios.get(url, {
      responseType: "stream",
      onDownloadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100,
        );
        req.query.onProgress(progress);
      },
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader("Content-Length", response.headers["content-length"]);
    res.setHeader("Content-Disposition", `attachment; filename=file.mp4`);

    const streamPipeline = promisify(pipeline);
    await streamPipeline(response.data, res);
  } catch (error) {
    console.error("Error downloading file:", error.message);
    res.status(500).send("Error downloading file");
  }
};

export default downloadFile;
