import { useEffect, useRef, useState } from "react";
import Product from "../Product/Product";
import styles from "./Products.module.scss";
import { getProducts } from "../../services/api";
import type { IProduct } from "../../types/product";
import Loader from "../Loader";

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  const loadProducts = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await getProducts(pageNumber);
      
      if (response.items && response.items.length > 0) {
        console.log(`Получено ${response.items.length} товаров`);
        
        if (pageNumber === 1) {
          setProducts(response.items);
        } else {
          setProducts(prev => [...prev, ...response.items]);
        }
        
        setTotalProducts(response.total);
        setHasMore(response.items.length > 0 && products.length + response.items.length < response.total);
      } else {
        console.warn('Получен пустой список товаров');
        if (pageNumber === 1) {
          setProducts([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error("Ошибка при загрузке товаров:", error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка первой страницы при монтировании
  useEffect(() => {
    loadProducts(1);
  }, []);

  // Настройка IntersectionObserver для бесконечной прокрутки
  useEffect(() => {
    if (loading || !hasMore) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (lastProductRef.current) {
      observer.current.observe(lastProductRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore]);

  // Загрузка следующей страницы при изменении page
  useEffect(() => {
    if (page > 1) {
      loadProducts(page);
    }
  }, [page]);

  return (
    <main className={styles.products}>
      {products.map((product, index) => {
        if (products.length === index + 1) {
          return (
            <div key={product.id} ref={lastProductRef}>
              <Product product={product} />
            </div>
          );
        }
        return <Product key={product.id} product={product} />;
      })}
      {loading && <Loader />}
      {!loading && !hasMore && products.length > 0 && (
        <div className={styles.endMessage}>
          <p>Вы просмотрели все товары</p>
        </div>
      )}
      {!loading && products.length === 0 && (
        <div className={styles.noProducts}>
          <p>Нет доступных товаров</p>
        </div>
      )}
    </main>
  );
};

export default Products;
