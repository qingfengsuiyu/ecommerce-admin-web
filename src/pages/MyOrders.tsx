import { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import { getOrders } from "../api/order";
function MyOrders() {
  const [order, setOrder] = useState<any>(null);
  const columns = [
    {
      title: "订单号",
      dataIndex: "orderNo",
    },
    {
      title: "总金额",
      dataIndex: "totalAmount",
      render: (amount: string) => `¥${amount}`,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={colorStatus[status]}>{orderStatus[status]}</Tag>
      ),
    },
    {
      title: "下单时间",
      dataIndex: "createdAt",
      render: (time: string) => new Date(time).toLocaleString(),
    },
  ];
  // 英文映射中文
  const orderStatus = {
    pending: "待支付",
    paid: "已支付",
    shipped: "运输中",
    completed: "已完成",
    cancelled: "已取消",
  };
  // 状态映射颜色
  const colorStatus = {
    pending: "#FAC775",
    paid: "#B5D4F4",
    shipped: "#CECBF6",
    completed: "#9FE1CB",
    cancelled: "#D3D1C7",
  };

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrder(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div
      style={{
        maxWidth: 1200,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <h2>订单状态:</h2>
      <div style={{ marginTop: 10 }}>
        {" "}
        <Table columns={columns} dataSource={order} rowKey="_id"></Table>
      </div>
    </div>
  );
}

export default MyOrders;
