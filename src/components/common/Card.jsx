import styles from './Card.module.css';

export default function Card({ children, className = '', padded = true, ...rest }) {
  return (
    <div className={`${styles.card} ${padded ? styles.padded : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}
