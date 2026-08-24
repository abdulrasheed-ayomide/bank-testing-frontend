import { useId } from 'react';
import styles from './Input.module.css';

export default function Input({
  label,
  error,
  hint,
  type = 'text',
  icon,
  rightSlot,
  ...rest
}) {
  const id = useId();
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={`${styles.inputWrap} ${error ? styles.errorWrap : ''}`}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input id={id} type={type} className={styles.input} {...rest} />
        {rightSlot && <span className={styles.rightSlot}>{rightSlot}</span>}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      {!error && hint && <p className={styles.hintText}>{hint}</p>}
    </div>
  );
}
