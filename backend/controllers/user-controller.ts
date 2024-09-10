import axios from "axios";

import { User, ResultResponse } from "@/types/index";

const API_URL = "/api/users";

export const createUser = async (user: User): Promise<ResultResponse> => {
  try {
    const response = await axios.post<ResultResponse>(API_URL, user);

    return response.data;
  } catch (error) {
    return handleError("Failed to create user");
  }
};

export const getUser = async (id: string): Promise<ResultResponse> => {
  try {
    const response = await axios.get<ResultResponse>(API_URL, {
      params: { id },
    });

    return response.data;
  } catch (error) {
    return handleError("Error fetching user");
  }
};

export const updateUser = async (user: User): Promise<ResultResponse> => {
  try {
    const response = await axios.patch<ResultResponse>(API_URL, user);

    return response.data;
  } catch (error) {
    return handleError("Failed to update user");
  }
};

export const deleteUser = async (id: string): Promise<ResultResponse> => {
  try {
    const response = await axios.delete<ResultResponse>(API_URL, {
      data: { id },
    });

    return response.data;
  } catch (error) {
    return handleError("Failed to delete user");
  }
};

// Common error handler for unknown errors (axios level)
const handleError = (defaultMessage: string): ResultResponse => ({
  data: { error: "Axios error: " + defaultMessage },
  status: 500,
  isError: true,
});
