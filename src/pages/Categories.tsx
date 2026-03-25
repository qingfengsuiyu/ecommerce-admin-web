import { Button, Modal, Table, message, Form, Input, Popconfirm } from "antd";
import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../api/categories";
function Categories() {
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const [form] = Form.useForm();
  const role = localStorage.getItem("role");
  const columns = [
    { title: "分类名称", dataIndex: "name" },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      render: (time: any) => new Date(time).toDateString(),
    },
    {
      title: "操作",
      align: "center" as const,
      render: (_: any, record: any) =>
        role === "admin" ? (
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        ) : (
          <span style={{ color: "#999" }}>-</span>
        ),
    },
  ];

  const handleDelete = async (record: any) => {
    await deleteCategory(record._id);
    message.success("删除成功");
    handleCategories(); // 刷新列表
  };

  const handleCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleSubmit = async (value: any) => {
    await createCategory(value);
    message.success("创建成功");
    setModelOpen(false);
    form.resetFields(); //重置表单
    handleCategories(); // 刷新列表
  };

  useEffect(() => {
    handleCategories();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1>分类管理</h1>
        {role === "admin" && (
          <Button type="primary" onClick={() => setModelOpen(true)}>
            新增分类
          </Button>
        )}
      </div>
      <Table columns={columns} dataSource={categories} rowKey="_id"></Table>
      <Modal
        open={modelOpen}
        onCancel={() => {
          setModelOpen(false);
        }}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: "类别不能为空" }]}
            style={{ marginTop: 16 }}
          >
            <Input placeholder="请输入类名"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Categories;
