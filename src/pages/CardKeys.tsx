import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
} from "antd";
import { getCardKeys, createCardKey, updateCardKey } from "../api/cardkeys";
import { getProducts } from "../api/products";
function CardKeys() {
  const [keys, setKeys] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const columns = [
    { title: "商品名称", dataIndex: ["product", "name"] },
    {
      title: "最大使用次数",
      dataIndex: "maxUsageTime",
    },
    {
      title: "当前使用次数",
      dataIndex: "currentUsageTime",
    },
    {
      title: "是否有效",
      dataIndex: "isValid",
      render: (val: boolean) => (
        <Tag color={val ? "green" : "red"}>{val ? "有效" : "已失效"}</Tag>
      ),
    },
    {
      title: "创建日期",
      dataIndex: "createdAt",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      title: "卡密",
      dataIndex: "content",
    },
    {
      title: "操作",
      render: (_: any, row: any) => (
        <Button type="primary" onClick={(val: any) => handleUpdate(row._id)}>
          退货
        </Button>
      ),
    },
  ];

  const [products, setProducts] = useState<any>([]);
  const handleCardKeys = async () => {
    const cardKeys = await getCardKeys();
    setKeys(cardKeys.data);
  };

  const handleProducts = async () => {
    const products = await getProducts({ limit: 999 });
    setProducts(products.data);
  };

  const handleAdd = async (data: any) => {
    await createCardKey(data);
    message.success("卡密添加成功");
    setIsModalOpen(false);
    handleCardKeys();
    form.resetFields();
  };

  const handleUpdate = async (id: string) => {
    await updateCardKey(id);
    message.success("退货成功");
    handleCardKeys();
  };

  useEffect(() => {
    handleCardKeys();
    handleProducts();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: 16,
        }}
      >
        <h1>卡密管理</h1>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          添加卡密
        </Button>
      </div>
      <Table columns={columns} dataSource={keys} rowKey="_id"></Table>
      <Modal
        title="新增卡密"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        onOk={() => form.submit()}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleAdd}
          style={{ marginTop: 16 }}
          initialValues={{
            maxUsageTime: 4, // 👈 默认值
          }}
        >
          <Form.Item label="关联商品:" name="product">
            <Select
              placeholder="请选择商品"
              allowClear
              showSearch={{
                filterOption: (input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
              options={products.map((item) => ({
                label: item.name,
                value: item._id,
              }))}
            />
          </Form.Item>
          <Form.Item label="卡密内容:" name="content">
            <TextArea placeholder="请输入卡密信息" rows={4} />
          </Form.Item>
          <Form.Item label="最大使用次数:" name="maxUsageTime">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Button type="primary" block htmlType="submit">
            提交
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default CardKeys;
