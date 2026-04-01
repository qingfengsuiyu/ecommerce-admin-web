import { Table, Button, InputNumber, message, Popconfirm } from "antd";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/order";
import { useEffect, useState } from "react";
function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } =
    useCart();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.warning("请先登录!");
      navigate("/login");
      return;
    }
    try {
      const orderProducts = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      }));
      await createOrder({ products: orderProducts });
      message.success("下单成功！");
      clearCart();
      navigate("/order-success");
    } catch (e) {}
  };

  const columns = [
    {
      title: "商品",
      dataIndex: "name",
      render: (name: string, record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {record.image ? (
            <img
              src={
                record.image.startsWith("http")
                  ? record.image
                  : `https://ecommerce-admin-server.onrender.com${record.image}`
              }
              style={{
                width: isMobile ? 50 : 60,
                height: isMobile ? 40 : 50,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : (
            <div
              style={{
                width: 50,
                height: 50,
                background: "#f0f0f0",
                borderRadius: 4,
              }}
            />
          )}
          <span style={{ display: "inline-block", minWidth: "50px" }}>
            {isMobile ? name.slice(0, 16) + ".." : name}
          </span>
        </div>
      ),
    },
    {
      title: "单价",
      dataIndex: "price",
      render: (price: number) => `¥${price}`,
    },
    {
      title: "数量",
      dataIndex: "quantity",
      render: (quantity: number, record: any) => (
        <InputNumber
          min={1}
          size="small"
          value={quantity}
          style={{ width: 50 }}
          onChange={(value) => updateQuantity(record._id, value as number)}
        />
      ),
    },
    {
      title: "小计",
      responsive: ["md"] as any, // 手机上隐藏
      render: (_: any, record: any) => (
        <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
          ¥{record.price * record.quantity}
        </span>
      ),
    },
    {
      title: "操作",
      render: (_: any, record: any) => (
        <Popconfirm
          title="确定要移除吗？"
          onConfirm={() => removeFromCart(record._id)}
        >
          <Button type="link" danger style={{ marginLeft: -14 }}>
            移除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 10px" }}>
      <h2 style={{ marginBottom: 16 }}>购物车</h2>
      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
          <p style={{ fontSize: 16 }}>购物车是空的</p>
          <Button type="primary" onClick={() => navigate("/")}>
            去逛逛
          </Button>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={cartItems}
            rowKey="_id"
            pagination={false}
          />
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: isMobile ? 12 : 0,
              marginTop: 24,
              padding: "16px 0",
            }}
          >
            <Popconfirm title="确定要清空购物车吗？" onConfirm={clearCart}>
              <Button danger block={isMobile}>
                清空购物车
              </Button>
            </Popconfirm>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isMobile ? "space-between" : "flex-end",
                gap: 24,
              }}
            >
              <span style={{ fontSize: 18 }}>
                合计：
                <span
                  style={{
                    color: "#ff4d4f",
                    fontSize: isMobile ? 18 : 24,
                    fontWeight: "bold",
                  }}
                >
                  ¥{totalAmount}
                </span>
              </span>
              <Button
                type="primary"
                size={isMobile ? "small" : "large"}
                onClick={handleCheckout}
              >
                结算
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
