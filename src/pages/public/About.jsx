import styles from './StaticPage.module.css';

export default function About() {
  return (
    <div className={`container ${styles.wrap}`}>
      <span className={styles.eyebrow}>About SFB</span>
      <h1>A bank built for how people actually manage money today.</h1>
      <p className={styles.lead}>
        Spring Financial Bank was founded on a simple idea: digital banking should feel as
        dependable as walking into a branch — without the wait. We combine bank-grade
        security practices with a clean, modern interface so customers always know exactly
        where their money is and where it's going.
      </p>

      <p>
        Our mission is to make secure digital banking accessible to everyone, with full
        transparency over every transaction, status change, and notification — backed by
        a team that treats your account with the same care as our own.
      </p>

      <div className={styles.grid}>
        <div>
          <h4>What SFB is</h4>
          <p>
            A secure, customer-focused digital bank offering modern account management,
            verified onboarding, instant notifications, PIN-protected transfers, and
            responsive customer support.
          </p>
        </div>
        <div>
          <h4>What SFB is not</h4>
          <p>
            Certain services (for example, cash-in-branch deposits or some wire transfer
            corridors) may be subject to additional agreements or availability by market.
            Please contact customer support for details on available services in your
            region.
          </p>
        </div>
      </div>
    </div>
  );
}
