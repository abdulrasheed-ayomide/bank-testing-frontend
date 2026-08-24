const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
  CAD: 'CA$',
  AUD: 'A$',
};

/**
 * Formats a numeric amount for display only.
 * This is presentation-only — the backend is the source of truth for all
 * balances and conversions. Never use this to compute authoritative values.
 */
export function formatCurrency(amount, currency = 'USD') {
  const symbol = CURRENCY_SYMBOLS[currency] || '';
  const value = Number(amount ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${value}`;
}

export function formatAccountNumber(accountNumber = '') {
  return String(accountNumber).replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default CURRENCY_SYMBOLS;
