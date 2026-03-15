import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../api/products";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [fileList, setFileList] = useState<any>([]);

  const handleSubmit = async (values: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, values);
        message.success("更新成功");
      } else {
        await createProduct(values);
        message.success("添加成功");
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts(keyword);
    } catch (e) {}
  };

  const handleEdit = (record: any) => {
    // 设置是编辑标记
    setEditingProduct(record);
    form.setFieldsValue(record);
    if (record.image) {
      setFileList([
        {
          uid: "-1",
          name: "image",
          status: "done",
          url: `https://ecommerce-admin-server.onrender.com${record.image}`,
        },
      ]);
    } else {
      setFileList([]);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success("删除成功");
      fetchProducts(keyword);
    } catch (e) {}
  };

  const fetchProducts = async (search?: string, page = 1) => {
    setLoading(true);
    const res: any = await getProducts({ keyword: search, page, limit: 10 });
    setProducts(res.data);
    setPagination(res.pagination);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    {
      title: "商品名称",
      dataIndex: "name",
    },
    {
      title: "价格",
      dataIndex: "price",
      render: (value: number) => `¥${value}`,
    },
    {
      title: "描述",
      dataIndex: "description",
    },
    {
      title: "图片",
      dataIndex: "image",
      render: (image: string) =>
        image ? (
          <img
            src={`https://ecommerce-admin-server.onrender.com${image}`}
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "操作",
      render: (_: any, record: any) => (
        <div style={{ marginLeft: "-18px" }}>
          <Button
            type="link"
            onClick={() => {
              handleEdit(record);
              setIsModalOpen(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

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
        <h1 style={{ margin: 0 }}>商品管理</h1>
        <Input.Search
          placeholder="搜索商品"
          size="large"
          onSearch={(value) => {
            setKeyword(value);
            fetchProducts(value);
          }}
          allowClear
          style={{ width: 600, marginRight: 16 }}
        ></Input.Search>
        <Button
          type="primary"
          onClick={() => {
            setEditingProduct(null);
            form.resetFields();
            setFileList([]);
            setIsModalOpen(true);
          }}
        >
          新增商品
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          onChange: (page) => {
            fetchProducts(keyword, page);
          },
        }}
      />
      <Modal
        title={editingProduct ? "编辑商品" : "新增商品"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <Form.Item
            label="商品名称"
            name="name"
            rules={[{ required: true, message: "请输入商品名称" }]}
          >
            <Input placeholder="请输入此商品名称" />
          </Form.Item>

          <Form.Item
            label="价格"
            name="price"
            rules={[{ required: true, message: "请输入价格" }]}
          >
            <Input type="number" placeholder="请输入价格" />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea placeholder="请输入描述" />
          </Form.Item>

          <Form.Item label="商品图片" name="image">
            <Upload
              name="image"
              action="https://ecommerce-admin-server.onrender.com/api/products/upload"
              headers={{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }}
              listType="picture-card"
              maxCount={1}
              fileList={fileList}
              onChange={(info) => {
                setFileList(info.fileList);
                if (info.file.status === "done") {
                  const imageUrl = info.file.response.data.imageUrl;
                  form.setFieldsValue({ image: imageUrl });
                  message.success("上传成功");
                }
              }}
            >
              {fileList.length < 1 && <PlusOutlined />}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Products;
