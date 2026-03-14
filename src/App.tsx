import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/AdminLayout";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/"
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
