import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import styles from './CopyableField.module.css';

export default function CopyableField({ value, display }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className={styles.wrap} onClick={handleCopy}>
      <span className={`${styles.value} mono`}>{display || value}</span>
      {copied ? <FiCheck className={styles.iconSuccess} /> : <FiCopy className={styles.icon} />}
    </button>
  );
}
