import React from 'react';

const TermsPage = () => (
  <section className="section">
    <div className="container" style={{ maxWidth: '760px' }}>
      <span className="section-eyebrow">Legal</span>
      <h1>Terms and Conditions</h1>
      <p className="text-muted">Last updated: January 2026</p>

      <h3>1. Acceptance of terms</h3>
      <p>
        By creating an account with Spring Financial Bank (SFB) and using our
        digital banking services, you agree to be bound by these Terms and
        Conditions and our Privacy Policy.
      </p>

      <h3>2. Account eligibility</h3>
      <p>
        You must provide accurate and complete information during
        registration and verify your email address via the one-time
        passcode (OTP) sent to you before your account can be activated.
      </p>

      <h3>3. Account security</h3>
      <p>
        You are responsible for maintaining the confidentiality of your
        login credentials. Notify us immediately if you suspect unauthorized
        access to your account. SFB will never ask for your password via
        email or phone.
      </p>

      <h3>4. Transfers and transaction processing</h3>
      <p>
        Fund transfers between SFB accounts are processed using validated
        account information and are subject to available balance checks.
        Transactions move through defined statuses (pending, processing,
        successful, failed, or reversed) and are recorded with a unique
        reference number for your records.
      </p>

      <h3>5. Reversals</h3>
      <p>
        SFB may reverse a transaction where it failed to complete
        successfully, or where required for dispute resolution or regulatory
        compliance. Reversals are recorded and communicated to affected
        account holders.
      </p>

      <h3>6. Account suspension and freezing</h3>
      <p>
        SFB reserves the right to suspend or freeze an account where
        suspicious activity is detected, where required by law, or to
        protect the security of our platform and customers.
      </p>

      <h3>7. Limitation of liability</h3>
      <p>
        SFB is not liable for losses arising from unauthorized access to your
        account resulting from your failure to safeguard your credentials,
        except where such loss is caused by our negligence.
      </p>

      <h3>8. Changes to these terms</h3>
      <p>
        We may update these Terms from time to time. Continued use of SFB
        after changes are posted constitutes acceptance of the revised Terms.
      </p>

      <h3>9. Contact us</h3>
      <p>
        For questions about these Terms, contact
        support@springfinancialbank.com.
      </p>
    </div>
  </section>
);

export default TermsPage;
