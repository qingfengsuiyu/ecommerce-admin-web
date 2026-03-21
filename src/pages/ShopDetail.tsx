import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, message } from "antd";
import { getProductById } from "../api/products";

function ShopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await getProductById(id as string);
      setProduct(res.data);
    };
    fetchData();
  }, [id]);
  if (!product) return <div>加载中...</div>;
  const imgSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://ecommerce-admin-server.onrender.com${product.image}`
    : "";
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
      <Button style={{ marginBottom: 16 }} onClick={() => navigate("/shop")}>
        ←返回
      </Button>
      <Card>
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ width: 360 }}>
            {imgSrc ? (
              <img src={imgSrc} style={{ width: "100%", borderRadius: 8 }} />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 300,
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  color: "#999",
                }}
              >
                暂无图片
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ marginBottom: 16 }}>{product.name}</h1>
            <div
              style={{
                color: "#ff4d4f",
                fontSize: 28,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              ¥{product.price}
            </div>
            <div style={{ color: "#666", marginBottom: 24 }}>
              {product.description || "暂无描述"}
            </div>
            <Button
              type="primary"
              size="large"
              onClick={() => message.info("购物车功能下一步实现")}
            >
              加入购物车
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ShopDetail;
