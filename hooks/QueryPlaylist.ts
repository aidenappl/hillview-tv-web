import { FetchAPI } from "../services/http/requestHandler";
import { Playlist } from "../pages/playlists";

const QueryPlaylist = async (route: string): Promise<Playlist | null> => {
  // Validate request
  if (!route) {
    return null;
  }

  // Fetching playlist
  const response = await FetchAPI<Playlist>({
    url: `/video/v1.1/read/playlist`,
    method: "GET",
    params: {
      route,
    },
  });

  //   Validating response
  if (response.success) {
    return response.data;
  } else {
    console.error("Error fetching playlist:", response.error);
    return null;
  }
};

export default QueryPlaylist;
