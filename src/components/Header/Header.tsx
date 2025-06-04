import { Link } from "react-router-dom";
import CartIcon from "../../assets/svg/cart-icon.svg?react";
import ReviewsIcon from "../../assets/svg/reviews-icon.svg?react";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1>Тестовое задание</h1>
      <nav className={styles.nav}>
        <li>
          <span>Отзывы</span>
          <ReviewsIcon width={22} height={20} />
        </li>
        <Link className="link" to={"/cart"}>
          <li>
            <span>Корзина</span>
            <CartIcon width={22} />
          </li>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
