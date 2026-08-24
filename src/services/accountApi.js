import api from './api.js';

function unwrap(promise) {
  return promise.then((res) => res.data.data);
}

export function getMyAccount() {
  return unwrap(api.get('/accounts/me')).then((d) => d.account);
}

export function getMyBalances() {
  return unwrap(api.get('/accounts/balances'));
}

export function lookupAccount(accountNumber) {
  return unwrap(api.get(`/accounts/lookup/${accountNumber}`));
}
