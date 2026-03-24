import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Tag, Table, Popconfirm, message } from "antd";
import { getOrderById, payOrder, cancelOrder } from "../api/order";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);

  const orderStatus: Record<string, string> = {
    pending: "待支付",
    paid: "已支付",
    shipped: "运输中",
    completed: "已完成",
    cancelled: "已取消",
  };

  const colorStatus: Record<string, string> = {
    pending: "#FAC775",
    paid: "#B5D4F4",
    shipped: "#CECBF6",
    completed: "#9FE1CB",
    cancelled: "#D3D1C7",
  };

  const fetchOrder = async () => {
    const res: any = await getOrderById(id as string);
    setOrder(res.data);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handlePay = async () => {
    try {
      await payOrder(id as string);
      message.success("支付成功");
      fetchOrder();
    } catch (e) {}
  };

  const handleCancel = async () => {
    try {
      await cancelOrder(id as string);
      message.success("订单已取消");
      fetchOrder();
    } catch (e) {}
  };

  if (!order) return <div>加载中...</div>;

  const columns = [
    {
      title: "商品",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {record.product?.image ? (
            <img
              src={
                record.product.image.startsWith("http")
                  ? record.product.image
                  : `https://ecommerce-admin-server.onrender.com${record.product.image}`
              }
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : (
            <div
              style={{
                width: 50,
                height: 50,
                background: "#f0f0f0",
                borderRadius: 4,
              }}
            />
          )}
          <span>{record.product?.name || "商品已删除"}</span>
        </div>
      ),
    },
    {
      title: "单价",
      dataIndex: "price",
      align: "center" as const,
      render: (price: number) => `¥${price}`,
    },
    {
      title: "数量",
      dataIndex: "quantity",
      align: "center" as const,
    },
    {
      title: "小计",
      align: "center" as const,
      render: (_: any, record: any) => (
        <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
          ¥{record.price * record.quantity}
        </span>
      ),
    },
  ];
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
      <Button style={{ marginBottom: 16 }} onClick={() => navigate("/orders")}>
        订单列表
      </Button>
      <Card title="订单信息" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <p>订单号：{order.orderNo}</p>
            <p>下单时间：{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p>
              订单状态：
              <Tag color={colorStatus[order.status]} style={{ color: "#333" }}>
                {orderStatus[order.status]}
              </Tag>
            </p>
            <p>
              订单总额：
              <span
                style={{ color: "#ff4d4f", fontSize: 20, fontWeight: "bold" }}
              >
                ¥{order.totalAmount}
              </span>
            </p>
          </div>
        </div>
      </Card>

      <Card title="商品清单" style={{ marginBottom: 16 }}>
        <Table
          columns={columns}
          dataSource={order.products}
          rowKey="_id"
          pagination={false}
        />
      </Card>

      {order.status === "pending" && (
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button type="primary" size="large" onClick={handlePay}>
            去支付
          </Button>
          <Popconfirm title="确定要取消订单吗？" onConfirm={handleCancel}>
            <Button size="large" danger>
              取消订单
            </Button>
          </Popconfirm>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
