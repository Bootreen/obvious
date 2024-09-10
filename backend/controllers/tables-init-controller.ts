import axios from "axios";

import { ResultResponse } from "@/types/index";

const API_URL = "/api/tables";

export const createTables = async (): Promise<ResultResponse> => {
  try {
    const response = await axios.post<ResultResponse>(API_URL);

    return response.data;
  } catch (error) {
    return {
      data: { error: "Unknown error creating tables" },
      status: 500,
      isError: true,
    };
  }
};
