import api from './api.js';

function unwrap(promise) {
  return promise.then((res) => res.data.data);
}

// The backend stores one ledger entry per account with `counterpartyName` /
// `counterpartyAccountNumber` and `createdAt` fields. The UI was built
// around a slightly friendlier shape (a single `counterparty` string, a
// `date` field) — mapping happens here, once, so no page component needs
// to know about the backend's raw document shape.
function mapTransaction(tx) {
  return {
    id: tx._id,
    reference: tx.reference,
    type: tx.type,
    direction: tx.direction,
    amount: tx.amount,
    currency: tx.currency,
    status: tx.status,
    description: tx.description,
    counterparty: tx.counterpartyName
      ? `${tx.counterpartyName}${tx.counterpartyAccountNumber ? ` · ${tx.counterpartyAccountNumber}` : ''}`
      : tx.performedByAdmin
        ? 'SFB Admin'
        : 'SFB System',
    date: tx.createdAt,
  };
}

export async function listTransactions({ type } = {}) {
  const data = await unwrap(api.get('/transactions', { params: { type } }));
  return data.transactions.map(mapTransaction);
}

export async function getTransaction(id) {
  const data = await unwrap(api.get(`/transactions/${id}`));
  return mapTransaction(data.transaction);
}

export function transfer({ recipientAccountNumber, amount, currency, description, transactionPin }) {
  return unwrap(
    api.post('/transactions/transfer', {
      recipientAccountNumber,
      amount,
      currency,
      description,
      transactionPin,
    })
  );
}
