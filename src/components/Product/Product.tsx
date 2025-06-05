import { useEffect, useState } from "react";
import type { IProduct } from "../../types/product";
import styles from "./Product.module.scss";
import { useCart } from "../../context/CartContext";

interface ProductProps {
  product: IProduct;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const { addToCart, updateQuantity, getProductQuantity } = useCart();
  const [quantity, setQuantity] = useState<number>(0);
  const [isInCart, setIsInCart] = useState<boolean>(false);

  useEffect(() => {
    const currentQuantity = getProductQuantity(product.id);
    setQuantity(currentQuantity);
    setIsInCart(currentQuantity > 0);
  }, [product.id, getProductQuantity]);

  const handleAddToCart = () => {
    addToCart(product);
    setQuantity(1);
    setIsInCart(true);
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    updateQuantity(product.id, newQuantity);
    setQuantity(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      updateQuantity(product.id, newQuantity);
      setQuantity(newQuantity);
    } else {
      updateQuantity(product.id, 0);
      setIsInCart(false);
      setQuantity(0);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      if (value === 0) {
        setIsInCart(false);
      } else {
        setIsInCart(true);
      }
      setQuantity(value);
      updateQuantity(product.id, value);
    }
  };

  return (
    <div className={styles.product}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img src={product.image_url} alt={product.title} />
        </div>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className={styles.priceContainer}>
          <span>Цена:</span>
          <span>{product.price}₽</span>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        {isInCart ? (
          <div className={styles.quantityControl}>
            <button 
              className={styles.quantityButton} 
              onClick={handleDecrement}
            >
              -
            </button>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={handleQuantityChange}
              className={styles.quantityInput}
            />
            <button 
              className={styles.quantityButton} 
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
        ) : (
          <button onClick={handleAddToCart}>Купить</button>
        )}
      </div>
    </div>
  );
};

export default Product;
