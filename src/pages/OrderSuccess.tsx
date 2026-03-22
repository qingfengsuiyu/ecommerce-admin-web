import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 40px" }}>
      <Result
        status="success"
        title="下单成功！"
        subTitle="您的订单已创建，可在后台管理查看订单状态"
        extra={[
          <Button type="primary" key="shop" onClick={() => navigate("/")}>
            继续购物
          </Button>,
          <Button key="admin" onClick={() => navigate("/admin/orders")}>
            查看订单
          </Button>,
        ]}
      />
    </div>
  );
}

export default OrderSuccess;
