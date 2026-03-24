import request from "../utils/request";

// 获取订单列表
export const getOrders = (params?: {
  page?: number;
  limit?: number;
  keyword?: string;
}) => {
  return request.get("/orders", { params });
};

// 创建订单
export const createOrder = (data: any) => {
  return request.post("/orders", data);
};

// 获取单个订单详情
export const getOrderById = (id: string) => {
  return request.get(`/orders/${id}`);
};

// 支付订单
export const payOrder = (id: string) => {
  return request.put(`/orders/${id}/pay`);
};

// 取消订单
export const cancelOrder = (id: string) => {
  return request.put(`/orders/${id}/cancel`);
};
