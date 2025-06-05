import { useEffect, useState } from "react";
import { getReviews } from "../../services/api";
import type { IReview } from "../../types/review";
import Review from "../Review";
import Loader from "../Loader";
import styles from "./Reviews.module.scss";

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviews();
        setReviews(data);
        setError(null);
      } catch (err) {
        console.error("Ошибка при загрузке отзывов:", err);
        setError("Не удалось загрузить отзывы. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className={styles.reviews}>
      <h2>Отзывы наших клиентов</h2>
      
      {loading && (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      )}
      
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && reviews.length === 0 && (
        <div className={styles.noReviews}>
          <p>Пока нет отзывов.</p>
        </div>
      )}
      
      {!loading && !error && reviews.length > 0 && (
        <div className={styles.reviewsList}>
          {reviews.map(review => (
            <Review key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews; 