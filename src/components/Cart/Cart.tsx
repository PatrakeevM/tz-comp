import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import BackIcon from "../../assets/svg/back-icon.svg?react";
import styles from "./Cart.module.scss";

const Cart: React.FC = () => {
  const [phone, setPhone] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      let formattedValue = "";

      if (value.length > 0) {
        formattedValue = "+7 ";
      }

      if (value.length > 1) {
        formattedValue += `(${value.slice(1, 4)}`;
      }

      if (value.length > 4) {
        formattedValue += `) ${value.slice(4, 7)}`;
      }

      if (value.length > 7) {
        formattedValue += `-${value.slice(7, 9)}`;
      }

      if (value.length > 9) {
        formattedValue += `-${value.slice(9, 11)}`;
      }

      setPhone(formattedValue);
    }
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      const input = inputRef.current;
      // Если поле пустое, заполняем его шаблоном и ставим курсор в нужную позицию
      if (!phone) {
        setPhone("+7 (");
        setTimeout(() => {
          input.setSelectionRange(4, 4);
        }, 0);
      } else {
        // Для случая, когда поле уже содержит номер
        const cursorPosition = phone.indexOf("(") + 1;
        if (phone.length >= cursorPosition) {
          setTimeout(() => {
            input.setSelectionRange(cursorPosition, cursorPosition);
          }, 0);
        }
      }
    }
  };

  const handleOrder = () => {
    // Проверка на полный номер телефона (должен содержать 15 символов с форматированием)
    if (phone.length < 15) {
      setIsValid(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    setIsValid(true);
    // Здесь будет логика оформления заказа
    console.log("Заказ оформлен на номер:", phone);
  };

  return (
    <div className={styles.cart}>
      <h2>Корзина</h2>
      <div className={styles.products}>
        <h3>Добавленные товары</h3>
        <div className={styles.productInfo}>
          <span>Товар</span>
          <span>x1</span>
          <span>3645₽</span>
        </div>
      </div>

      <div className={styles.orderSection}>
        <div className={styles.phoneInputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            onClick={handleInputClick}
            placeholder="+7 (___) ___-__-__"
            className={`${styles.phoneInput} ${!isValid ? styles.invalid : ""}`}
          />
        </div>
        <button className={styles.orderButton} onClick={handleOrder}>
          Оформить заказ
        </button>
      </div>
      <Link className="link" to={"/"}>
        <button className={styles.backButton}>
          <BackIcon className={styles.backIcon} />
          <span>Вернуться на главную</span>
        </button>
      </Link>
    </div>
  );
};

export default Cart;
