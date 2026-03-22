import { Layout, Menu, Button, Badge, Popconfirm } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCartOutlined } from "@ant-design/icons";

function ShopLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { cartItems } = useCart();

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
              items={[{ key: "/", label: "商品首页" }]}
              style={{ border: "none", color: "##1A9AD0" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Badge count={cartItems.length} size="medium">
              <ShoppingCartOutlined
                style={{ fontSize: 22, cursor: "pointer" }}
                onClick={() => navigate("/cart")}
              />
            </Badge>
            <div style={{ marginRight: 10 }}></div>
            {token ? (
              <Popconfirm
                title="确定要退出吗？"
                onConfirm={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  navigate("/login");
                }}
              >
                <Button>退出</Button>
              </Popconfirm>
            ) : (
              <Button type="primary" onClick={() => navigate("/login")}>
                登录
              </Button>
            )}
            <Button onClick={() => navigate("/admin")}>后台管理</Button>
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
        <p
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
            color: "#ACB7BD",
          }}
        >
          待到瑁珑树叶飘落,春天尚未到来之际,阿尔玟最终长眠在凯林阿姆洛斯山上.那就是她的绿色坟茔.
          直到沧海桑田,她的全部生平都被后人彻底遗忘,而埃拉诺花与妮芙瑞迪尔花再也没有在大海以东绽放.
          这就是故事的结尾,自南方传来便是这样.
          随着暮星的陨落,本书不再叙述那些古时的日子.
        </p>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}

export default ShopLayout;
