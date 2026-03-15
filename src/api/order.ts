import request from "../utils/request";

// 获取订单列表
export const getOrders = (params?: {
  page?: number;
  limit?: number;
  keyword?: string;
}) => {
  return request.get("/orders", { params });
};

// 更新订单状态
export const updateOrderStatus = (id: string, status: string) => {
  return request.put(`/orders/${id}/status`, { status });
};
