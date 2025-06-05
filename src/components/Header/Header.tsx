import { Link } from "react-router-dom";
import CartIcon from "../../assets/svg/cart-icon.svg?react";
import ReviewsIcon from "../../assets/svg/reviews-icon.svg?react";
import styles from "./Header.module.scss";
import { useCart } from "../../context/CartContext";

const Header: React.FC = () => {
  const { getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <h1>Тестовое задание</h1>
      </Link>
      <nav className={styles.nav}>
        <Link className="link" to="/reviews">
          <li className={styles.reviewsButton}>
            <span>Отзывы</span>
            <ReviewsIcon width={26} height={24} className={styles.icon} />
          </li>
        </Link>
        <Link className="link" to="/cart">
          <li className={`${styles.cartButton} ${totalItems > 0 ? styles.hasItems : ""}`}>
            <div className={styles.cartInfo}>
              <span>Корзина</span>
              {totalItems > 0 && (
                <div className={styles.cartDetails}>
                  <span>{totalItems} шт.</span>
                  <span>{totalPrice}₽</span>
                </div>
              )}
            </div>
            <div className={styles.cartIconWrapper}>
              <CartIcon width={26} className={styles.icon} />
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </div>
          </li>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
