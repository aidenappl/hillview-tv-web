import { FetchAPI } from "../services/http/requestHandler";
import { Video } from "../pages/content";

const QueryVideo = async (query?: string): Promise<Video | null> => {
  if (!query) {
    return null;
  }
  const response = await FetchAPI<Video>({
    url: `/video/v1.1/video/${query}`,
    method: "GET",
  });

  //   Validating response
  if (response.success) {
    return response.data;
  } else {
    console.error("Error fetching video:", response.error);
    return null;
  }
};

export default QueryVideo;
