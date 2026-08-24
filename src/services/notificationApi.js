import api from './api.js';

function unwrap(promise) {
  return promise.then((res) => res.data.data);
}

function mapNotification(n) {
  return { id: n._id, title: n.title, body: n.body, read: n.read, date: n.createdAt };
}

export async function listNotifications() {
  const data = await unwrap(api.get('/notifications'));
  return data.notifications.map(mapNotification);
}

export async function markRead(id) {
  const data = await unwrap(api.patch(`/notifications/${id}/read`));
  return mapNotification(data.notification);
}
