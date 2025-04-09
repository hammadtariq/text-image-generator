import axios from "axios";
// import { API_ENDPOINTS } from "../constants";

export const fetcher = async (url, params) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/${url}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        params: {
          ...params,
          store_id: 15641879,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};
