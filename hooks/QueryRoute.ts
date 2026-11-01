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

  // Checking for a short link
  const response = await FetchAPI<RouteRedirect>({
    url: `/links/v1.1/check/${encodeURIComponent(path)}`,
    method: "GET",
    params: {
      recordClick: true,
    },
  });

  //   Validating response
  if (response.success) {
    return response.data;
  } else {
    // A path with no short link is an empty-body 404 (error_code 0): a
    // routine miss, mostly bots. Only log real failures.
    if (response.error_code !== 0 && response.error_code !== 404) {
      console.error("Error checking route:", response.error);
    }
    return null;
  }
};

export default QueryRoute;
