import styles from "./Product.module.scss";

const Product: React.FC = () => {
  return (
    <div className={styles.product}>
      <img src="!#" alt="Товар" />
      <h3>Название</h3>
      <p>Оисание описание описание описание</p>
      <div>
        <span>Цена:</span>
        <span>1215₽</span>
      </div>
      <button>Купить</button>
    </div>
  );
};

export default Product;
