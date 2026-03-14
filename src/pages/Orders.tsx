import { getOrders, updateOrderStatus } from "../api/order";
import { useEffect, useState } from "react";
import { Select, Table, message } from "antd";

function Orders() {
  const [order, setOrder] = useState<any>(null);

  const columns = [
    { title: "订单号", dataIndex: "orderNo" },
    {
      title: "用户",
      dataIndex: "user",
      render: (user: any) => user?.username || "-",
    },
    {
      title: "总金额",
      dataIndex: "totalAmount",
      render: (amount: number) => `¥${amount}`,
    },
    {
      title: "状态",
      dataIndex: "status",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: "操作",
      render: (_: any, record: any) => (
        <Select
          value={record.status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          options={[
            { label: "待支付", value: "pending" },
            { label: "已支付", value: "paid" },
            { label: "已发货", value: "shipped" },
            { label: "已完成", value: "completed" },
            { label: "已取消", value: "cancelled" },
          ]}
        />
      ),
    },
  ];

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status);
      message.success("状态更新成功");
      fetchOrders();
    } catch (e) {}
  };
  const fetchOrders = async () => {
    const res: any = await getOrders();
    setOrder(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div>
      <h1 style={{ marginBottom: "10px" }}>订单管理</h1>
      <Table columns={columns} dataSource={order} rowKey="_id"></Table>
    </div>
  );
}

export default Orders;
