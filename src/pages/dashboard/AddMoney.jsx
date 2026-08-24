import { FiInfo } from 'react-icons/fi';
import Card from '../../components/common/Card';
import CopyableField from '../../components/common/CopyableField';
import { useAuth } from '../../context/useAuth';
import { formatAccountNumber } from '../../utils/formatCurrency';
import styles from './AddMoney.module.css';

export default function AddMoney() {
  const { account } = useAuth();

  return (
    <Card className={styles.card}>
      <div className={styles.icon}><FiInfo size={20} /></div>
      <h2>Add Money</h2>
      <p className={styles.body}>
        SFB does not currently support direct online deposits. To request a balance credit,
        please contact Spring Financial Bank customer support with your account number.
      </p>

      <div className={styles.accountBlock}>
        <span className={styles.label}>Your account number</span>
        <CopyableField value={account?.accountNumber} display={formatAccountNumber(account?.accountNumber)} />
      </div>
    </Card>
  );
}
