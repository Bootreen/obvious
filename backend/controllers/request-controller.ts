import axios from "axios";

import { ResultResponse } from "@/types/index";

const API_URL = "/api/requests";

export const createRequest = async (
  sessionId: number,
  requestData: Record<string, any>,
): Promise<ResultResponse> => {
  try {
    const response = await axios.post<ResultResponse>(API_URL, {
      sessionId,
      requestData,
    });

    return response.data;
  } catch (error) {
    return handleError("Failed to create request");
  }
};

export const getRequest = async (id: number): Promise<ResultResponse> => {
  try {
    const response = await axios.get<ResultResponse>(API_URL, {
      params: { id },
    });

    return response.data;
  } catch (error) {
    return handleError("Error fetching request");
  }
};

export const getRequestsBySessionId = async (
  sessionId: number,
): Promise<ResultResponse> => {
  try {
    const response = await axios.get<ResultResponse>(API_URL, {
      params: { sessionId },
    });

    return response.data;
  } catch (error) {
    return handleError("Failed to fetch requests by session ID");
  }
};

export const updateRequest = async (
  id: number,
  requestData: Record<string, any>,
): Promise<ResultResponse> => {
  try {
    const response = await axios.patch<ResultResponse>(API_URL, {
      id,
      requestData,
    });

    return response.data;
  } catch (error) {
    return handleError("Failed to update request");
  }
};

export const deleteRequest = async (id: number): Promise<ResultResponse> => {
  try {
    const response = await axios.delete<ResultResponse>(API_URL, {
      data: { id },
    });

    return response.data;
  } catch (error) {
    return handleError("Failed to delete request");
  }
};

// Common error handler for axios errors
const handleError = (defaultMessage: string): ResultResponse => ({
  data: { error: "Axios error: " + defaultMessage },
  status: 500,
  isError: true,
});
