import request from "../utils/request";

// 获取商品列表
export const getProducts = (params?: {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
}) => {
  return request.get("/products", { params });
};

// 添加商品
export const createProduct = (data: {
  name: string;
  price: number;
  description?: string;
}) => {
  return request.post("/products", data);
};

// 删除商品
export const deleteProduct = (id: string) => {
  return request.delete(`/products/${id}`);
};

// 更新商品
export const updateProduct = (id: string, data: any) => {
  return request.put(`/products/${id}`, data);
};

// 获取单个商品
export const getProductById = (id: string) => {
  return request.get(`/products/${id}`);
};
