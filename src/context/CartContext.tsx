import { createContext, useContext, useState, useEffect } from "react";

// 定义购物车商品的类型
interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// 定义Context的类型
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | null>(null);

// Provider组件,提供数据的组件，管理购物车的所有状态和操作
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // 每次cartItem变化,同步到localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 添加商品到购物车
  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image || "",
          quantity: 1,
        },
      ];
    });
  };

  // 从购物车移除
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // 修改数量
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item)),
    );
  };

  // 清空购物车
  const clearCart = () => {
    setCartItems([]);
  };

  // 计算总金额
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 自定义Hook 方便使用
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart 必须在 CartProvider 内使用");
  }
  return context;
}
