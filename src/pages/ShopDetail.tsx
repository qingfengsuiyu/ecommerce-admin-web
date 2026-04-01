import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, message, InputNumber, Tag, Row, Col } from "antd";
import { getProductById, getProducts } from "../api/products";
import { useCart } from "../context/CartContext";

function ShopDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await getProductById(id as string);
      setProduct(res.data);

      if (res.data.category) {
        const relRes: any = await getProducts({
          limit: 6,
          category: res.data.category._id,
        });
        setRelatedProducts(relRes.data.filter((item: any) => item._id !== id));
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!product) return <div>加载中...</div>;
  const imgSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://ecommerce-admin-server.onrender.com${product.image}`
    : "";

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: isMobile ? "0" : "0 40px",
      }}
    >
      <Button style={{ marginBottom: 16 }} onClick={() => navigate("/")}>
        ←返回
      </Button>
      <Card>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row", // 手机纵向
            gap: 32,
          }}
        >
          {/* 图片 */}
          <div style={{ width: isMobile ? "100%" : 360 }}>
            {imgSrc ? (
              <img
                src={imgSrc}
                style={{
                  width: "100%", // 手机上占满宽度
                  borderRadius: 8,
                }}
              />
            ) : (
              <div
                style={{
                  width: isMobile ? "100px" : "100%",
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
            <h3 style={{ marginBottom: 16 }}>{product.name}</h3>
            {product.category && (
              <Tag color="blue" style={{ marginBottom: 12 }}>
                {product.category.name}
              </Tag>
            )}

            <div
              style={{
                color: "#ff4d4f",
                fontSize: isMobile ? 18 : 28,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              ¥{product.price}
            </div>

            <div style={{ color: "#666", marginBottom: 24 }}>
              {product.description || "暂无描述"}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <span style={{ minWidth: "50px", display: "inline-block" }}>
                数量：
              </span>
              <InputNumber
                min={1}
                value={quantity}
                size={isMobile ? "small" : "large"}
                style={isMobile ? { width: 60 } : {}}
                onChange={(val) => setQuantity(val as number)}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <Button
                type="primary"
                size="large"
                style={{ flex: isMobile ? 1 : "none" }}
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart(product);
                  }
                  message.success(`已加入${quantity}件到购物车`);
                }}
              >
                加入购物车
              </Button>

              <Button
                size="large"
                style={{ flex: isMobile ? 1 : "none" }}
                onClick={() => navigate("/cart")}
              >
                去购物车
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 商品推荐 */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ marginBottom: 16 }}>同类商品推荐</h2>
          <Row gutter={[16, 16]}>
            {relatedProducts.map((item) => (
              <Col key={item._id} xs={12} sm={8} md={6}>
                <Card
                  hoverable
                  cover={
                    item.image ? (
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `https://ecommerce-admin-server.onrender.com${item.image}`
                        }
                        style={{ height: 150, objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 150,
                          background: "#f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#999",
                        }}
                      >
                        暂无图片
                      </div>
                    )
                  }
                  onClick={() => navigate(`/${item._id}`)}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </div>
                  <div style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                    ¥{item.price}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}

export default ShopDetail;
