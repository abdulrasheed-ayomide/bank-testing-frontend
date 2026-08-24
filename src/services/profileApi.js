import api from './api.js';

function unwrap(promise) {
  return promise.then((res) => res.data.data);
}

export function getProfile() {
  return unwrap(api.get('/profile')).then((d) => d.user);
}

export function updateProfile(updates) {
  return unwrap(api.patch('/profile', updates)).then((d) => d.user);
}
