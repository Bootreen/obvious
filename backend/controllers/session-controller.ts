import axios from "axios";

import {
  StatusDetail,
  ErrorDetail,
  SessionDetail,
  ResultResponse,
} from "@/types/index";

const API_URL = "/api/sessions";

export const createSession = async (
  userId: string,
): Promise<ResultResponse<SessionDetail | ErrorDetail>> => {
  try {
    const response = await axios.post<ResultResponse<SessionDetail>>(API_URL, {
      userId,
    });

    return response.data;
  } catch (error) {
    return handleError("Failed to create session");
  }
};

export const getSession = async (
  id: number,
): Promise<ResultResponse<SessionDetail | ErrorDetail>> => {
  try {
    const response = await axios.get<ResultResponse<SessionDetail>>(API_URL, {
      params: { id },
    });

    return response.data;
  } catch (error) {
    return handleError("Error fetching session");
  }
};

export const deleteSession = async (
  id: number,
): Promise<ResultResponse<StatusDetail | ErrorDetail>> => {
  try {
    const response = await axios.delete<ResultResponse<StatusDetail>>(API_URL, {
      data: { id },
    });

    return response.data;
  } catch (error) {
    return handleError("Failed to delete session");
  }
};

// Common error handler for axios errors
const handleError = (defaultMessage: string): ResultResponse<ErrorDetail> => ({
  data: { error: "Axios error: " + defaultMessage },
  status: 500,
  isError: true,
});
