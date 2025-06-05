import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import "./App.scss";
import CartPage from "./pages/CartPage";
import Products from "./components/Products";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <div className="app-container">
        <Header />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </div>
    </CartProvider>
  );
}

export default App;
