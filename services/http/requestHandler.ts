import axios from "axios";
import { GeneralResponse } from "../../models/generalResponse.model";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type RequestReq = {
  route: string;
  method: HTTPMethod;
  url?: string;
  params?: object;
  auth?: boolean;
  body?: object;
  headers?: object[];
  authToken?: string | null;
};

const NewRequest = async (req: RequestReq): Promise<GeneralResponse> => {
  try {
    const headers: any = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (req.headers && req.headers.length > 0) {
      req.headers.forEach((header: any) => {
        headers[Object.keys(header)[0]] = Object.values(header)[0];
      });
    }

    if (req.authToken) {
      headers["Authorization"] = "Bearer " + req.authToken;
    }

    const response = await axios.request({
      url: req.route,
      method: req.method,
      baseURL: req.url,
      headers,
      data: req.body || {},
      params: req.params || {},
      validateStatus: () => true,
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        status: response.status,
        data: response.data,
        success: true,
        message: "success",
      };
    } else if (response.status == 404) {
      return {
        status: response.status,
        data: response,
        success: false,
        message: response.data,
      };
    } else {
      return {
        status: response.status,
        data: response,
        success: false,
        message: response.data.data.error,
      };
    }
  } catch (error: any) {
    return {
      status: 500,
      data: error,
      success: false,
      message: "failed to make request: " + error.message,
    };
  }
};

export { NewRequest };
