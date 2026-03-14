import request from "../utils/request";

// 获取订单列表
export const getOrders = () => {
  return request.get("/orders");
};

// 更新订单状态
export const updateOrderStatus = (id: string, status: string) => {
  return request.put(`/orders/${id}/status`, { status });
};
