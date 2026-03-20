import { Card, Form, Input, Button, message } from "antd";
import { login } from "../api/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log(values);
    setLoading(true);
    try {
      const res: any = await login(values);
      localStorage.setItem("token", res.data.token);
      // 存储用户id
      localStorage.setItem("userId", res.data.id);
      message.success("登录成功");
      navigate("/");
    } catch (e) {
      // 错误有拦截器统一处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card title="电商管理平台 - 登录" style={{ width: 400 }}>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            email: "xiaoyi@test.com",
            password: "123456",
          }}
        >
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: "请输入邮箱" }]}
          >
            <Input placeholder="请输入邮箱"></Input>
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input type="password" placeholder="请输入密码"></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
