import { useState, useEffect } from "react";
import { getStarts } from "../api/dashboard";
import { Card, Statistic, Row, Col } from "antd";

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const res: any = await getStarts();
      console.log("统计数据:", res);
      setStats(res.data);
    };
    fetchData();
  }, []);
  if (!stats) return <div>加载中...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>数据总览</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="商品总数" value={stats.totalProducts}></Statistic>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="订单总数" value={stats.totalOrders}></Statistic>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="用户总数" value={stats.totalUsers}></Statistic>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="总收入" value={stats.totalRevenue}></Statistic>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
