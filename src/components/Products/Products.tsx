import Product from "../Product/Product";
import styles from "./Products.module.scss";

const Products: React.FC = () => {
  return (
    <main className={styles.products}>
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
    </main>
  );
};

export default Products;
