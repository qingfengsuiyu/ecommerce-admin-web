import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/AdminLayout";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Register from "./pages/Register";
import AuthGuard from "./components/AuthGuard";
import ShopLayout from "./components/ShopLayout";
import ShopHome from "./pages/ShopHome";
import ShopDetail from "./pages/ShopDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>

        {/* 前台商城- 默认首页 */}
        <Route path="/" element={<ShopLayout />}>
          <Route index element={<ShopHome />} />
          <Route path="cart" element={<div>购物车（待开发）</div>} />
          <Route path=":id" element={<ShopDetail />} />
        </Route>

        {/* 后台管理 */}
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
