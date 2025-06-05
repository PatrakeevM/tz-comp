import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { IProduct } from '../types/product';
import type { ICartItem } from '../types/order';

interface CartContextType {
  cartItems: ICartItem[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getProductQuantity: (productId: number) => number;
  products: Map<number, IProduct>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [products, setProducts] = useState<Map<number, IProduct>>(new Map());

  // Загрузка корзины из localStorage при инициализации
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedProducts = localStorage.getItem('cartProducts');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Ошибка при загрузке корзины из localStorage:', error);
      }
    }

    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        const productsMap = new Map();
        parsedProducts.forEach((product: IProduct) => {
          productsMap.set(product.id, product);
        });
        setProducts(productsMap);
      } catch (error) {
        console.error('Ошибка при загрузке продуктов из localStorage:', error);
      }
    }
  }, []);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    localStorage.setItem('cartProducts', JSON.stringify(Array.from(products.values())));
  }, [cartItems, products]);

  const addToCart = (product: IProduct) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    // Сохраняем информацию о продукте
    setProducts(prev => {
      const newProducts = new Map(prev);
      newProducts.set(product.id, product);
      return newProducts;
    });

    if (existingItem) {
      setCartItems(
        cartItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { id: product.id, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(
      cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setProducts(new Map());
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const product = products.get(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getProductQuantity = (productId: number) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getProductQuantity,
    products
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 