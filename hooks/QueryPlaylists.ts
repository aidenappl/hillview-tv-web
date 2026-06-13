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
    // Go marshals nil slices as null — normalize so pages never see null videos
    return (response.data ?? []).map((p) => ({ ...p, videos: p.videos ?? [] }));
  } else {
    console.error("Error fetching playlists:", response.error);
    return [];
  }
};

export default QueryPlaylists;
