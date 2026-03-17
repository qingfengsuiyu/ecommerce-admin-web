import { useState, useEffect, useRef } from "react";
import { getStarts } from "../api/dashboard";
import { getProducts } from "../api/products";
import { Card, Statistic, Row, Col } from "antd";
import * as echarts from "echarts";

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any>([]);

  const chartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await getStarts();
      setStats(res.data);
      const prodRes: any = await getProducts({ limit: 10 });
      setProducts(prodRes.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (stats && chartRef.current) {
      // 渲染图标
      if (chartRef.current) {
        const chart = echarts.init(chartRef.current);
        chart.setOption({
          title: {
            text: "订单状态分布",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          series: [
            {
              type: "pie",
              radius: "60%",
              data: stats.orderStatusStats.map((item: any) => ({
                name: item._id,
                value: item.count,
              })),
            },
          ],
        });
      }
    }

    if (products.length > 0 && barChartRef.current) {
      const barChart = echarts.init(barChartRef.current);
      barChart.setOption({
        title: { text: "商品价格Top10", left: "center" },
        tooltip: { trigger: "axis" },
        xAxis: {
          type: "category",
          data: products.map((p: any) => p.name),
          axisLabel: { rotate: 30 },
        },
        yAxis: { type: "value", name: "价格(¥)" },
        series: [
          {
            type: "bar",
            data: products.map((p: any) => p.price),
            itemStyle: { color: "#1677ff" },
          },
        ],
      });
    }
  }, [stats, products]);

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
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <div ref={chartRef} style={{ height: 400 }}></div>
        </Col>
        <Col span={12}>
          <div ref={barChartRef} style={{ height: 400 }}></div>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
