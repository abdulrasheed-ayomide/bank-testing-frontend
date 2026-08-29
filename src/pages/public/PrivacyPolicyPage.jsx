import React from 'react';

const PrivacyPolicyPage = () => (
  <section className="section">
    <div className="container" style={{ maxWidth: '760px' }}>
      <span className="section-eyebrow">Legal</span>
      <h1>Privacy Policy</h1>
      <p className="text-muted">Last updated: January 2026</p>

      <h3>1. Information we collect</h3>
      <p>
        When you open an account with Spring Financial Bank (SFB), we collect
        identifying information such as your full name, email address, phone
        number, and account credentials. We also collect transactional data
        generated through your use of our services, including transfer
        history, account balances, and login activity.
      </p>

      <h3>2. How we use your information</h3>
      <p>
        We use your information to provide and secure our banking services,
        verify your identity, process transactions, send account
        notifications (such as debit, credit, and security alerts), and
        comply with applicable financial regulations.
      </p>

      <h3>3. How we protect your information</h3>
      <p>
        SFB employs industry-standard security measures including encrypted
        password storage, rate limiting, and continuous monitoring of account
        activity through audit logging. Access to customer data is restricted
        to authorized personnel under role-based access controls.
      </p>

      <h3>4. Sharing of information</h3>
      <p>
        We do not sell your personal information. Information may be shared
        with regulatory authorities where required by law, or with service
        providers strictly necessary to operate our platform (such as email
        delivery providers for transactional notifications).
      </p>

      <h3>5. Your rights</h3>
      <p>
        You may request access to, correction of, or deletion of your
        personal data, subject to our regulatory record-keeping obligations.
        Contact our support team to exercise these rights.
      </p>

      <h3>6. Contact us</h3>
      <p>
        For privacy-related questions, contact us at
        support@springfinancialbank.com.
      </p>
    </div>
  </section>
);

export default PrivacyPolicyPage;
