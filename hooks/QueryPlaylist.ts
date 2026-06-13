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
    if (!response.data) return null;
    // Go marshals nil slices as null — normalize so pages never see null videos
    return { ...response.data, videos: response.data.videos ?? [] };
  } else {
    console.error("Error fetching playlist:", response.error);
    return null;
  }
};

export default QueryPlaylist;
