import axios from "axios";

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000/api"
  : "https://ecommerce-admin-server.onrender.com/api";

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

// 请求拦截器:每次请求自动带上token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器:统一处理错误
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || "请求失败";
    alert(message);
    return Promise.reject(error);
  },
);

export { BASE_URL };
export default request;
