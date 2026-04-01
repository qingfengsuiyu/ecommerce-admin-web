import { Layout, Menu, Button, Badge, Dropdown } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

function ShopLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { cartItems } = useCart();
  // 进行移动端适配
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 40px",
          height: isMobile ? "auto" : 64, // 手机上自动高度
          paddingTop: isMobile ? 8 : 0,
          paddingBottom: isMobile ? 8 : 0,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div
            style={{
              marginTop: "10px",
              fontSize: isMobile ? 18 : 24,
              fontWeight: "bold",
              cursor: "pointer",
              color: "#1CA4D6",
              marginLeft: isMobile ? -10 : 0,
            }}
            onClick={() => navigate("/")}
          >
            XY电商
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={[
                { key: "/", label: "商品首页" },
                { key: "/orders", label: "我的订单" },
              ]}
              style={{
                border: "none",
                color: "##1A9AD0",
                flex: "none",
                minWidth: 0,
                marginLeft: isMobile ? -30 : 0, // 手机上往左移抵消默认padding
              }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Badge count={cartItems.length} size="medium">
                <ShoppingCartOutlined
                  style={{ fontSize: 22, cursor: "pointer" }}
                  onClick={() => navigate("/cart")}
                />
              </Badge>

              <div style={{ marginRight: 10 }}></div>
              {token ? (
                <Dropdown
                  menu={{
                    items: [
                      { key: "profile", label: "个人信息" },
                      { key: "orders", label: "我的订单" },
                      { key: "admin", label: "后台管理" },
                      { type: "divider" },
                      { key: "logout", label: "退出登录", danger: true },
                    ],
                    onClick: ({ key }) => {
                      if (key === "logout") {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("role");
                        navigate("/login");
                      } else if (key === "profile") {
                        navigate("/profile");
                      } else if (key === "orders") {
                        navigate("/orders");
                      } else if (key === "admin") {
                        navigate("/admin");
                      }
                    },
                  }}
                >
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <UserOutlined style={{ fontSize: 18 }} />
                  </div>
                </Dropdown>
              ) : (
                <Button type="primary" onClick={() => navigate("/login")}>
                  登录
                </Button>
              )}
            </div>
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
            marginTop: isMobile ? -20 : 0,
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
