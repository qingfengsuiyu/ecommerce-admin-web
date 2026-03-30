import { Layout, Menu, Button, Popconfirm } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  UserOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const menuItems = [
    {
      key: "/admin",
      label: "数据总览",
      roles: ["admin"],
      icon: <DashboardOutlined />,
    },
    {
      key: "/admin/products",
      label: "商品管理",
      roles: ["admin", "editor", "viewer"],
      icon: <ShoppingOutlined />,
    },
    {
      key: "/admin/categories",
      label: "分类管理",
      roles: ["admin"],
      icon: <AppstoreOutlined />,
    },
    {
      key: "/admin/orders",
      label: "订单管理",
      roles: ["admin"],
      icon: <OrderedListOutlined />,
    },
    {
      key: "/admin/users",
      label: "用户管理",
      roles: ["admin"],
      icon: <UserOutlined />,
    },
    {
      key: "/admin/cardkeys",
      label: "卡密管理",
      roles: ["admin"],
      icon: <IdcardOutlined />,
    },
  ];

  const filteredItems = menuItems
    .filter((item) => item.roles.includes(role || ""))
    .map(({ key, label, icon }) => ({ key, label, icon }));

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
          items={filteredItems}
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
