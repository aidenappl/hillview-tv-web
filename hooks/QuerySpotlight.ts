import { Rank, Video } from "../pages/content";
import { ApiResponse, FetchAPI } from "../services/http/requestHandler";

const QuerySpotlight = async (
  limit?: number,
  offset?: number,
): Promise<Rank[]> => {
  if (!limit) limit = 24;
  if (!offset) offset = 0;
  const response = await FetchAPI<Rank[]>({
    url: `/video/v1.1/spotlight`,
    method: "GET",
    params: {
      limit,
      offset,
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

export default QuerySpotlight;
