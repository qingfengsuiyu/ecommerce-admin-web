import { useEffect } from "react";
import { Form, Input, Card, Button, message } from "antd";
import { getMe, updateProfile } from "../api/auth";

function Profile() {
  const [form] = Form.useForm();
  const handleUserInfo = async () => {
    const res = await getMe();

    form.setFieldsValue(res.data);
  };
  const handleSubmit = async (values: any) => {
    try {
      await updateProfile(values);
      message.success("更新成功");
    } catch (e) {}
  };

  useEffect(() => {
    handleUserInfo();
  }, []);

  return (
    <div
      style={{
        marginTop: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "50vh",
      }}
    >
      <Card title="个人信息" style={{ width: 500 }}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入用户名"></Input>
          </Form.Item>

          <Form.Item label="邮箱" name="email" rules={[{ required: true }]}>
            <Input disabled></Input>
          </Form.Item>

          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入正确手机号"></Input>
          </Form.Item>
          <Form.Item label="收货地址" name="address">
            <Input placeholder="请输入正确收货地址"></Input>
          </Form.Item>
          <Button type="primary" block htmlType="submit">
            更新信息
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Profile;
