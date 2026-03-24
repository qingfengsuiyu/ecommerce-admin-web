import { useState, useEffect } from "react";
import { Card, Row, Col, Tag, Spin, Input, Empty } from "antd";
import { getProducts } from "../api/products";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/categories";

function ShopHome() {
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // const [keyword, setKeyword] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const fetchProducts = async (category?: string, search?: string) => {
    setLoading(true);
    const res: any = await getProducts({
      limit: 20,
      category,
      keyword: search,
    });
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    const fetchCats = async () => {
      const catRes: any = await getCategories();
      setCategories(catRes.data);
    };
    fetchCats();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0, color: "#1CA4D6" }}>全部商品</h2>
        <Input.Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="搜索商品"
          allowClear
          style={{ width: 400, height: 32 }}
          onSearch={(value) => {
            // setKeyword(value);
            setActiveCategory("");
            fetchProducts("", value);
          }}
        />
      </div>

      <div
        style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <Tag
          color={activeCategory === "" ? "#1677ff" : undefined}
          style={{ cursor: "pointer", padding: "4px 12px" }}
          onClick={() => {
            setActiveCategory("");
            fetchProducts("", "");
            setSearchValue(""); // 清掉输入框
            // setKeyword(""); // 清掉搜索词
          }}
        >
          全部
        </Tag>
        {categories.map((cat) => (
          <Tag
            key={cat._id}
            color={activeCategory === cat._id ? "#1677ff" : undefined}
            style={{ cursor: "pointer", padding: "4px 12px" }}
            onClick={() => {
              setActiveCategory(cat._id);
              fetchProducts(cat._id, searchValue);
            }}
          >
            {cat.name}
          </Tag>
        ))}
      </div>

      <Spin spinning={loading}>
        {products.length === 0 && !loading ? (
          <Empty description="暂无商品" style={{ padding: "60px 0" }} />
        ) : (
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
        )}
      </Spin>
    </div>
  );
}

export default ShopHome;
