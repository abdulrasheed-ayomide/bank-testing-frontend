export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^\+?[0-9\s-]{7,15}$/.test(phone);
}

export function isStrongPassword(password) {
  // Min 8 chars, at least one letter and one number
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

export function isValidPin(pin) {
  return /^\d{4}$/.test(pin);
}

export function isValidAccountNumber(accountNumber) {
  return /^1\d{8}$/.test(accountNumber);
}

export function isValidOtp(otp) {
  return /^\d{6}$/.test(otp);
}
