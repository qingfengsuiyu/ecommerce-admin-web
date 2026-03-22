import { Table, Button, InputNumber, message, Popconfirm } from "antd";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/order";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } =
    useCart();
  const navigate = useNavigate();
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
                width: 50,
                height: 50,
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
          <span>{name}</span>
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
          value={quantity}
          onChange={(value) => updateQuantity(record._id, value as number)}
        />
      ),
    },
    {
      title: "小计",
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
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
              padding: "16px 0",
            }}
          >
            <Popconfirm title="确定要清空购物车吗？" onConfirm={clearCart}>
              <Button danger>清空购物车</Button>
            </Popconfirm>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <span style={{ fontSize: 18 }}>
                合计：
                <span
                  style={{ color: "#ff4d4f", fontSize: 24, fontWeight: "bold" }}
                >
                  ¥{totalAmount}
                </span>
              </span>
              <Button type="primary" size="large" onClick={handleCheckout}>
                去结算
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
