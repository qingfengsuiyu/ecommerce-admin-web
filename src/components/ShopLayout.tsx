import { Layout, Menu, Button } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

function ShopLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginRight: 40,
                cursor: "pointer",
                color: "#1CA4D6",
              }}
              onClick={() => navigate("/")}
            >
              XY电商
            </div>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={[
                { key: "/", label: "商品首页" },
                { key: "/cart", label: "购物车" },
              ]}
              style={{ border: "none", color: "##1A9AD0" }}
            />
          </div>
          <div>
            {token ? (
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  navigate("/login");
                }}
              >
                退出
              </Button>
            ) : (
              <Button type="primary" onClick={() => navigate("/login")}>
                登录
              </Button>
            )}
            <Button
              style={{ marginLeft: 16 }}
              onClick={() => navigate("/admin")}
            >
              后台管理
            </Button>
          </div>
        </div>
      </Layout.Header>
      <Layout.Content
        style={{
          padding: "24px",
          minHeight: "calc(100vh - 64px)",
          background: "#f5f5f5",
        }}
      >
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}

export default ShopLayout;
