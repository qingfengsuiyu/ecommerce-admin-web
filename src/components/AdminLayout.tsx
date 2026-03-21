import { Layout, Menu, Button, Popconfirm } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider theme="dark" breakpoint="lg">
        {/* 上部分 */}
        <div
          style={{
            color: "#ffffff",
            textAlign: "center",
            padding: "16px",
            fontSize: "16px",
            marginLeft: "-50px",
          }}
        >
          电商管理平台
        </div>
        {/* 下部分 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            { key: "/admin", label: "数据总览" },
            { key: "/admin/products", label: "商品管理" },
            { key: "/admin/orders", label: "订单管理" },
            { key: "/admin/users", label: "用户管理" },
          ]}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "30px",
            width: "100%",
            padding: "0 16px",
          }}
        >
          <Popconfirm title="确定要退出吗？" onConfirm={() => handleLogout()}>
            <Button>退出登录</Button>
          </Popconfirm>
        </div>
      </Layout.Sider>
      <Layout.Content style={{ padding: "24px" }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}

export default AdminLayout;
