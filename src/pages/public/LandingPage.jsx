import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Digital Banking',
    description:
      'Manage your account, view balances, and handle everyday banking entirely online — no branch visits required.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
        <path d="M7 13h4" />
      </svg>
    ),
  },
  {
    title: 'Secure Transfers',
    description:
      'Move money between SFB accounts instantly, with every transfer validated, recorded, and confirmed by email.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 10l5-5 5 5" />
        <path d="M12 5v14" />
        <path d="M17 14l-5 5-5-5" />
      </svg>
    ),
  },
  {
    title: 'Transaction Monitoring',
    description:
      'Track every transaction through its full lifecycle — pending, processing, successful, or reversed — in real time.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12h4l3 8 4-16 3 8h4" />
      </svg>
    ),
  },
  {
    title: 'Account Management',
    description:
      'Update your profile, manage security settings, and keep your account information current — all in one place.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
];

const LandingPage = () => {
  return (
    <>
      {/* --- Hero --- */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="hero-eyebrow">Now accepting new accounts</span>
            <h1>Banking built on trust, not trends.</h1>
            <p className="lead">
              Spring Financial Bank gives you a secure, transparent way to
              hold, move, and monitor your money — with the stability of a
              traditional bank and the convenience of digital-first tools.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-accent btn-lg">
                Open an account
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Log in to online banking
              </Link>
            </div>
          </div>

          <div className="hero-card" aria-hidden="true">
            <div className="hero-card-header">
              <div>
                <div className="hero-card-balance-label">Available balance</div>
                <div className="hero-card-balance">NGN 482,150.00</div>
                <div className="hero-card-account">ACCT •••• 7890 · SFB-20481032</div>
              </div>
              <span className="badge badge-success">Active</span>
            </div>
            <div className="hero-card-rows">
              <div className="hero-card-row">
                <div className="hero-card-row-label">
                  <span>Transfer to Ada Eze</span>
                  <span>SFB-TX-1718-AB12CD</span>
                </div>
                <span className="hero-card-amount negative">- NGN 25,000.00</span>
              </div>
              <div className="hero-card-row">
                <div className="hero-card-row-label">
                  <span>Salary credit</span>
                  <span>SFB-TX-1716-9F2E1A</span>
                </div>
                <span className="hero-card-amount positive">+ NGN 350,000.00</span>
              </div>
              <div className="hero-card-row">
                <div className="hero-card-row-label">
                  <span>Transfer to Spring Stores</span>
                  <span>SFB-TX-1712-7C3B90</span>
                </div>
                <span className="hero-card-amount negative">- NGN 8,500.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Trust strip --- */}
      <div className="trust-strip">
        <div className="container">
          <span className="trust-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2 3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6l-9-4z" />
            </svg>
            256-bit encrypted sessions
          </span>
          <span className="trust-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Real-time transaction monitoring
          </span>
          <span className="trust-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            OTP-verified registration
          </span>
          <span className="trust-strip-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16v4H4z" />
              <path d="M4 12h16v8H4z" />
            </svg>
            Full audit trail on every account
          </span>
        </div>
      </div>

      {/* --- About --- */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-grid">
            <div>
              <span className="section-eyebrow">About SFB</span>
              <h2>A bank built for how people actually manage money today.</h2>
              <p>
                Spring Financial Bank was founded on a simple idea: digital
                banking should feel as dependable as walking into a branch —
                without the wait. We combine bank-grade security practices
                with a clean, modern interface so customers always know
                exactly where their money is and where it's going.
              </p>
              <p>
                Our mission is to make secure digital banking accessible to
                everyone, with full transparency over every transaction,
                every status change, and every notification — backed by a
                team that treats your account with the same care as our own.
              </p>
              <Link to="/register" className="btn btn-primary">
                Get started with SFB
              </Link>
            </div>

            <div className="about-panel">
              <h3>Why customers choose SFB</h3>
              <div className="about-stat">
                <strong>&lt; 2 min</strong>
                <span>Average transfer processing time</span>
              </div>
              <div className="about-stat">
                <strong>24/7</strong>
                <span>Account access &amp; monitoring</span>
              </div>
              <div className="about-stat">
                <strong>100%</strong>
                <span>Transactions logged with audit trails</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features --- */}
      <section className="section" id="features" style={{ backgroundColor: 'var(--sfb-surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">What you get</span>
            <h2>Everything you need to bank with confidence</h2>
            <p>
              From day-to-day transfers to long-term account oversight, SFB
              gives you the tools to stay informed and in control.
            </p>
          </div>

          <div className="grid grid-4">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Ready to bank differently?</h2>
            <p>
              Open your Spring Financial Bank account in minutes. Verify your
              email, and you're ready to send, receive, and track your money
              securely.
            </p>
            <Link to="/register" className="btn btn-accent btn-lg">
              Open an account
            </Link>
          </div>
        </div>
      </section>

      {/* --- Contact --- */}
      <section className="section" id="contact" style={{ backgroundColor: 'var(--sfb-surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Get in touch</span>
            <h2>We're here to help</h2>
          </div>

          <div className="contact-grid">
            <div>
              <div className="contact-info-item">
                <span className="contact-info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16v16H4z" />
                    <path d="M4 4l8 8 8-8" />
                  </svg>
                </span>
                <div>
                  <h4>Email support</h4>
                  <p>support@springfinancialbank.com</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.91.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <div>
                  <h4>Phone support</h4>
                  <p>+234 700 000 0000 (Mon–Fri, 8am–6pm)</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <div>
                  <h4>Head office</h4>
                  <p>4 Marina Crescent, Lagos, Nigeria</p>
                </div>
              </div>
            </div>

            <form className="card" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Full name</label>
                  <input className="form-input" id="contact-name" name="name" type="text" placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email address</label>
                  <input className="form-input" id="contact-email" name="email" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input className="form-input" id="contact-subject" name="subject" type="text" placeholder="How can we help?" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea className="form-textarea" id="contact-message" name="message" rows="4" placeholder="Tell us more about your inquiry" />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
