import axios from "axios";

// Create an instance of axios
const axiosInstance = axios.create({
  // You can set default options here
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    console.log(error);
    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;

      // Return a unified error format
      return Promise.reject({
        data: { error: data.message || "An unknown error occurred" },
        status: status || 500,
        isError: true,
      });
    }

    // Handle unknown errors
    return Promise.reject({
      data: { error: "An unknown error occurred" },
      status: 500,
      isError: true,
    });
  },
);

export default axiosInstance;
