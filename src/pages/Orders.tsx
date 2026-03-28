import { getOrders } from "../api/order";
import { useEffect, useState } from "react";
import { Table, message, Input, Tag, Button, Popconfirm } from "antd";
import { updateOrderStatus } from "../api/order";

function Orders() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

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
      render: (status: string) => (
        <Tag color={colorStatus[status]} style={{ color: "#333" }}>
          {orderStatus[status]}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: "操作",
      align: "center" as const,
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {record.status === "paid" && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleStatusChange(record._id, "shipped")}
            >
              发货
            </Button>
          )}
          {record.status === "shipped" && (
            <Button
              size="small"
              onClick={() => handleStatusChange(record._id, "completed")}
            >
              确认完成
            </Button>
          )}
          {record.status === "pending" && (
            <Popconfirm
              title="确定要取消此订单吗？"
              onConfirm={() => handleStatusChange(record._id, "cancelled")}
            >
              <Button size="small" danger>
                取消
              </Button>
            </Popconfirm>
          )}
          {(record.status === "completed" || record.status === "cancelled") && (
            <span style={{ color: "#999" }}>-</span>
          )}
        </div>
      ),
    },
  ];

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status);
      message.success("状态更新成功");
      fetchOrders(keyword);
    } catch (e) {}
  };

  const fetchOrders = async (search?: string, page = 1) => {
    setLoading(true);
    // 去后端获取数据
    const res: any = await getOrders({ keyword: search, page, limit: 10 });
    // 更新表格渲染所需要的数据
    setOrder(res.data);
    setPagination(res.pagination);
    setLoading(false);
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          marginBottom: "10px",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>订单管理</h1>
        <Input.Search
          placeholder="搜索订单号"
          onSearch={(value) => {
            setKeyword(value);
            fetchOrders(value);
          }}
          style={{ width: 600, height: 40, marginLeft: "-10%" }}
          size="large"
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={order}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          onChange: (page) => fetchOrders(keyword, page),
        }}
      ></Table>
    </div>
  );
}

export default Orders;
