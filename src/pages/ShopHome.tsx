import { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import { getProducts } from "../api/products";
import { useNavigate } from "react-router-dom";

function ShopHome() {
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await getProducts({ limit: 20 });
      setProducts(res.data);
    };
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16, color: "#1CA4D6" }}>全部商品</h2>
      <Row gutter={[16, 16]}>
        {products.map((item) => (
          <Col key={item._id} xs={12} sm={8} md={6} lg={4}>
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
                    style={{
                      minHeight: 150,
                      maxHeight: 150,
                      objectFit: "cover",
                    }}
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
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 8,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={item.name}
              >
                {item.name}
              </div>
              <div
                style={{
                  color: "#ff4d4f",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                ¥{item.price}
              </div>
              <div style={{ color: "#999", fontSize: 13, marginBottom: 8 }}>
                {item.description || "暂无描述"}
              </div>
              <Card.Meta description={`原价:¥${item.price}`} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ShopHome;
