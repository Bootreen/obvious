import axios from "axios";

import { ResultResponse } from "@/types/index";

const API_URL = "/api/sessions";

export const createSession = async (
  userId: string,
): Promise<ResultResponse> => {
  try {
    const response = await axios.post<ResultResponse>(API_URL, {
      userId,
    });

    return response.data;
  } catch (error) {
    return handleError("Failed to create session");
  }
};

export const getSession = async (id: number): Promise<ResultResponse> => {
  try {
    const response = await axios.get<ResultResponse>(API_URL, {
      params: { id },
    });

    return response.data;
  } catch (error) {
    return handleError("Error fetching session");
  }
};

export const getSessionsByUserId = async (
  userId: string,
): Promise<ResultResponse> => {
  try {
    const response = await axios.get<ResultResponse>(API_URL, {
      params: { userId },
    });

    return response.data;
  } catch (error) {
    return handleError("Failed to fetch sessions by user ID");
  }
};

export const deleteSession = async (id: number): Promise<ResultResponse> => {
  try {
    const response = await axios.delete<ResultResponse>(API_URL, {
      data: { id },
    });

    return response.data;
  } catch (error) {
    return handleError("Failed to delete session");
  }
};

// Common error handler for axios errors
const handleError = (defaultMessage: string): ResultResponse => ({
  data: { error: "Axios error: " + defaultMessage },
  status: 500,
  isError: true,
});
