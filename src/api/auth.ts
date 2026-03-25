import request from "../utils/request";

// 登录
export const login = (data: { email: string; password: string }) => {
  return request.post("/auth/login", data);
};

// 注册
export const register = (data: {
  username: string;
  email: string;
  password: string;
}) => {
  return request.post("/auth/register", data);
};

// 获取当前用户信息
export const getMe = () => {
  return request.get("/auth/me");
};

export const updateProfile = (data: {
  username?: string;
  phone?: string;
  address?: string;
}) => {
  return request.put("/auth/profile", data);
};
