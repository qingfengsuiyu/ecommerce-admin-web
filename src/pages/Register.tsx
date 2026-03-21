import { Card, Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../api/auth";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (value: any) => {
    setLoading(true);
    try {
      // 收集数据
      const res = await register(value);
      navigate("/login");
      console.log(res);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          background: "#f0f2f5",
        }}
      >
        <Card title="电商平台 - 用户注册" style={{ width: 400 }}>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input placeholder="请输入用户名"></Input>
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ required: true, message: "请输入正确的邮箱" }]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                注册
              </Button>
            </Form.Item>
          </Form>
          <div style={{ textAlign: "center" }}>
            已有账号？<Link to="/login">去登录</Link>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Register;
