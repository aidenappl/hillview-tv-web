import { FetchAPI } from "../services/http/requestHandler";
import { Playlist } from "../pages/playlists";

const QueryPlaylists = async (): Promise<Playlist[]> => {
  const response = await FetchAPI<Playlist[]>({
    url: `/video/v1.1/list/playlists`,
    method: "GET",
    params: {
      limit: 100,
      offset: 0,
    },
  });

  //   Validating response
  if (response.success) {
    return response.data;
  } else {
    console.error("Error fetching playlists:", response.error);
    return [];
  }
};

export default QueryPlaylists;
