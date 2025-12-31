import { FetchAPI } from "./../services/http/requestHandler";
import { Video } from "../pages/content";

const QueryVideos = async (
  query?: string,
  limit?: number,
  offset?: number,
): Promise<Video[]> => {
  if (!limit) limit = 24;
  if (!offset) offset = 0;
  if (!query) query = "";
  const response = await FetchAPI<Video[]>({
    url: `/video/v1.1/list/videos`,
    method: "GET",
    params: {
      limit,
      offset,
      search: query,
      sort: "desc",
    },
  });

  //   Validating response
  if (response.success) {
    return response.data;
  } else {
    console.error("Error fetching videos:", response.error);
    return [];
  }
};

export default QueryVideos;
