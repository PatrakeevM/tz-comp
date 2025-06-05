import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { Link } from "react-router-dom";
import BackIcon from "../../assets/svg/back-icon.svg?react";
import styles from "./Cart.module.scss";
import { useCart } from "../../context/CartContext";

const Cart: React.FC = () => {
  const { cartItems, products, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [phone, setPhone] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
      // Сбросить сообщение об ошибке при редактировании
      setIsValid(true);
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

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    // На мобильных устройствах показываем числовую клавиатуру
    if (isMobile && inputRef.current) {
      // Для Android и iOS сделаем числовую клавиатуру по умолчанию
      e.currentTarget.inputMode = 'tel';
      
      if (!phone) {
        setPhone("+7 (");
        setTimeout(() => {
          inputRef.current?.setSelectionRange(4, 4);
        }, 50);
      }
    }
  };

  const handleInputBlur = () => {
    // Проверяем формат при потере фокуса
    if (phone && phone.length < 15) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const handleOrder = async () => {
    // Проверка на полный номер телефона (должен содержать 15 символов с форматированием)
    if (phone.length < 15) {
      setIsValid(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    if (cartItems.length === 0) {
      alert("Корзина пуста. Добавьте товары для оформления заказа.");
      return;
    }

    setIsValid(true);
    
    try {
      // Имитация отправки заказа
      setTimeout(() => {
        setOrderSuccess(true);
        // Очищаем корзину после успешного оформления заказа
        clearCart();
        // Здесь был бы реальный запрос к API
      }, 1000);
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
    }
  };

  const handleQuantityChange = (productId: number, value: number) => {
    if (value <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, value);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Вы уверены, что хотите очистить корзину?")) {
      clearCart();
    }
  };

  const totalPrice = getTotalPrice();

  if (orderSuccess) {
    return (
      <div className={styles.cart}>
        <div className={styles.successMessage}>
          <h2>Заказ успешно оформлен!</h2>
          <p>Ваш заказ принят и будет обработан в ближайшее время.</p>
          <p>Мы свяжемся с вами по номеру: {phone}</p>
          <Link className="link" to={"/"}>
            <button className={styles.backButton}>
              <BackIcon className={styles.backIcon} />
              <span>Вернуться к покупкам</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cart}>
      <h2>Корзина</h2>
      {cartItems.length > 0 ? (
        <div className={styles.products}>
          <div className={styles.cartHeader}>
            <h3>Товары в корзине</h3>
            <button 
              className={styles.clearCartButton} 
              onClick={handleClearCart}
            >
              Очистить корзину
            </button>
          </div>
          <div className={styles.productsList}>
            {cartItems.map((item) => {
              const product = products.get(item.id);
              if (!product) return null;
              
              return (
                <div key={item.id} className={styles.productItem}>
                  <div className={styles.productInfo}>
                    <div className={styles.productImage}>
                      <img src={product.image_url} alt={product.title} />
                    </div>
                    <div className={styles.productDetails}>
                      <h3>{product.title}</h3>
                      <p>{product.description}</p>
                    </div>
                  </div>
                  <div className={styles.productActions}>
                    <div className={styles.quantityControl}>
                      <button 
                        className={styles.quantityButton} 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                        className={styles.quantityInput}
                      />
                      <button 
                        className={styles.quantityButton} 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className={styles.productPrice}>
                      <span>{product.price * item.quantity}₽</span>
                    </div>
                    <button 
                      className={styles.removeButton} 
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.cartSummary}>
            <div className={styles.totalPrice}>
              <span>Итого:</span>
              <span>{totalPrice}₽</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyCart}>
          <p>Ваша корзина пуста</p>
          <Link className="link" to={"/"}>
            <button className={styles.backButton}>
              <BackIcon className={styles.backIcon} />
              <span>Перейти к покупкам</span>
            </button>
          </Link>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className={styles.orderSection}>
          <div className={styles.phoneInputWrapper}>
            <input
              ref={inputRef}
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              onClick={handleInputClick}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="+7 (___) ___-__-__"
              className={`${styles.phoneInput} ${!isValid ? styles.invalid : ""}`}
              autoComplete="tel"
              inputMode="tel"
            />
            {!isValid && <div className={styles.errorMessage}>Введите корректный номер телефона</div>}
          </div>
          <button className={styles.orderButton} onClick={handleOrder}>
            Оформить заказ
          </button>
        </div>
      )}

      {cartItems.length > 0 && (
        <Link className="link" to={"/"}>
          <button className={styles.backButton}>
            <BackIcon className={styles.backIcon} />
            <span>Продолжить покупки</span>
          </button>
        </Link>
      )}
    </div>
  );
};

export default Cart;
