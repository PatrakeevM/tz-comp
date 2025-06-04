import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import "./App.scss";
import CartPage from "./pages/CartPage";
import Products from "./components/Products";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
}

export default App;
