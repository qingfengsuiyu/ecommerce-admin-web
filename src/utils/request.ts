import axios from "axios";

const request = axios.create({
  baseURL: "https://ecommerce-admin-server.onrender.com/api",
  // baseURL: "http://localhost:3000/api",
  timeout: 60000, // 因为 Render 免费套餐休眠后第一次
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

export default request;
