/**
 * Formats a numeric amount as currency, e.g. 1500.5 -> "1,500.50"
 */
export const formatAmount = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return '0.00';
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/**
 * Formats a currency amount with its currency code, e.g. "NGN 1,500.50"
 */
export const formatCurrency = (value, currency = 'NGN') => `${currency} ${formatAmount(value)}`;

/**
 * Formats a date string/Date into a readable date + time.
 */
export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats a date string/Date into a readable date only.
 */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Masks an account number, showing only the last 4 digits, e.g. "******7890"
 */
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 4) return accountNumber || '';
  return `${'*'.repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`;
};

/**
 * Returns initials from a full name, e.g. "Jane Doe" -> "JD"
 */
export const getInitials = (fullName = '') => {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
};

/**
 * Capitalizes the first letter of a string.
 */
export const capitalize = (str = '') => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

/**
 * Generates a random idempotency key for transfer requests.
 */
export const generateIdempotencyKey = () => {
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};
