import type { IReview } from "../../types/review";
import styles from "./Review.module.scss";
import DOMPurify from 'dompurify';

interface ReviewProps {
  review: IReview;
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  // Очищаем HTML от потенциально опасных скриптов
  const sanitizedHtml = DOMPurify.sanitize(review.text);
  
  return (
    <div className={styles.review}>
      <div 
        className={styles.content} 
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
      />
    </div>
  );
};

export default Review; 