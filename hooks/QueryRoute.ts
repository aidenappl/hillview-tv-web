import { FetchAPI } from "../services/http/requestHandler";

interface RouteRedirect {
  id: number;
  route: string;
  destination: string;
  created_by: number;
  active: boolean;
  created_at: Date; // ISO 8601 date string
}

const QueryRoute = async (path: string): Promise<RouteRedirect | null> => {
  // Validate request
  if (!path) {
    return null;
  }

  // Fetching playlist
  const response = await FetchAPI<RouteRedirect>({
    url: `/links/v1.1/check/${path}`,
    method: "GET",
    params: {
      recordClick: true
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

export default QueryRoute;
