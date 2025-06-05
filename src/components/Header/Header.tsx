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
      <h1>Тестовое задание</h1>
      <nav className={styles.nav}>
        <li>
          <span>Отзывы</span>
          <ReviewsIcon width={22} height={20} />
        </li>
        <Link className="link" to={"/cart"}>
          <li className={totalItems > 0 ? styles.hasItems : ""}>
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
              <CartIcon width={22} />
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
