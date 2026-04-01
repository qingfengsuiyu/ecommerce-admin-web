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
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // 进行移动端适配
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchProducts = async (
    category?: string,
    search?: string,
    pageNum = 1,
  ) => {
    if (loading) return;
    setLoading(true);
    const res: any = await getProducts({
      limit: 18,
      category,
      keyword: search,
      page: pageNum,
    });
    if (pageNum === 1) {
      setProducts(res.data);
    } else {
      setProducts((prev) => {
        const existingIds = new Set(prev.map((item: any) => item._id));
        const newItems = res.data.filter(
          (item: any) => !existingIds.has(item._id),
        );
        return [...prev, ...newItems];
      });
    }
    setHasMore(res.data.length === 18);
    setPage(pageNum);
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      // 距离底部不到 100px
      if (fullHeight - (scrollTop + windowHeight) < 100) {
        if (!loading && hasMore) {
          fetchProducts(activeCategory, searchValue, page + 1);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    // 如果内容不够高，自动加载更多
    if (
      document.documentElement.scrollHeight <= window.innerHeight &&
      hasMore &&
      !loading
    ) {
      fetchProducts(activeCategory, searchValue, page + 1);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, activeCategory, searchValue, fetchProducts]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* 移动端适配 */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // 手机纵向，电脑横向
          gap: isMobile ? 8 : 0,
          alignItems: isMobile ? "stretch" : "center",

          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0, color: "#1CA4D6" }}>全部商品</h2>
        <Input.Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="搜索商品"
          allowClear
          style={{ width: isMobile ? "100%" : 400, height: 32 }}
          onSearch={(value) => {
            setActiveCategory("");
            setPage(1);
            setHasMore(true);
            fetchProducts("", value, 1);
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
            setSearchValue("");
            setPage(1);
            setHasMore(true);
            fetchProducts("", "", 1);
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
              setPage(1);
              setHasMore(true);
              fetchProducts(cat._id, searchValue, 1);
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
