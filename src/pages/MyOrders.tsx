import { useState, useEffect } from "react";
import { Table, Tag, Button, Popconfirm, message } from "antd";
import { getOrders, payOrder, cancelOrder } from "../api/order";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [order, setOrder] = useState<any>(null);
  const navigate = useNavigate();

  const columns = [
    {
      title: "订单号",
      dataIndex: "orderNo",
    },
    {
      title: "总金额",
      dataIndex: "totalAmount",
      render: (amount: string) => `¥${amount}`,
      align: "center" as const,
    },
    {
      title: "状态",
      dataIndex: "status",
      align: "center" as const,
      render: (status: string) => (
        <Tag color={colorStatus[status]} style={{ color: "#333" }}>
          {orderStatus[status]}
        </Tag>
      ),
    },
    {
      title: "下单时间",
      dataIndex: "createdAt",
      align: "center" as const,
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: "操作",
      render: (_: any, record: any) => (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginLeft: -16,
          }}
        >
          <Button type="link" onClick={() => navigate(`/orders/${record._id}`)}>
            查看详情
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => handlePay(record._id)}
              >
                去支付
              </Button>
              <Popconfirm
                title="确定要取消订单吗？"
                onConfirm={() => handleCancel(record._id)}
              >
                <Button size="small" danger>
                  取消
                </Button>
              </Popconfirm>
            </>
          )}
        </div>
      ),
    },
  ];
  // 英文映射中文
  const orderStatus: Record<string, string> = {
    pending: "待支付",
    paid: "已支付",
    shipped: "运输中",
    completed: "已完成",
    cancelled: "已取消",
  };
  // 状态映射颜色
  const colorStatus: Record<string, string> = {
    pending: "#FAC775",
    paid: "#B5D4F4",
    shipped: "#CECBF6",
    completed: "#9FE1CB",
    cancelled: "#D3D1C7",
  };

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrder(res.data);
    console.log("订单数据:", res.data);
  };

  const handlePay = async (id: string) => {
    try {
      await payOrder(id);
      message.success("支付成功");
      fetchOrders();
    } catch (e) {}
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelOrder(id);
      message.success("订单已取消");
      fetchOrders();
    } catch (e) {}
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
