/* eslint-disable no-console */
import axios from "axios";

import { User } from "@/types/index";

const API_URL = "/api/users";

export const createUser = async (user: User): Promise<User> => {
  try {
    const response = await axios.post<User>(API_URL, user);

    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUser = async (id: string): Promise<User> => {
  try {
    const response = await axios.get<User>(API_URL, {
      data: { id },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  username: string,
  email: string,
): Promise<User> => {
  try {
    const response = await axios.patch<User>(API_URL, { id, username, email });

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(API_URL, {
      data: { id },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
