import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ec-course-api.hexschool.io/v2",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const match = document.cookie.match(/(^|;)\s*hexToken\s*=\s*([^;]+)/);
    const token = match ? match[2] : null;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;