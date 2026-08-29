# Spring Financial Bank — Frontend

A React + Vite frontend for Spring Financial Bank, a secure digital banking application fully connected to the backend API.

## Stack

React · Vite · React Router · Axios · Context API · CSS Modules · react-icons

No Tailwind. No UI kit. Custom-built components styled with the SFB design system.

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env`. During local development, `/api` is proxied to the backend at
`http://localhost:5000`, so the browser remains on the same origin and avoids CORS issues.
Set `VITE_API_URL` to a deployed API URL when the frontend is hosted outside that proxy.

## Design system

- White/warm-neutral background, neon-green accent used sparingly (buttons, active states, success)
- Space Grotesk (headings) + Inter (body) + IBM Plex Mono (account numbers, balances, amounts)
- Tokens live in `src/styles/tokens.css`

## Folder structure

```
src/
├── components/
│   ├── common/        # Button, Card, Input, Badge, Modal, PinInput, CopyableField, etc.
│   └── layout/         # Navbar, Footer, DashboardSidebar/Topbar, AdminSidebar
├── layouts/            # PublicLayout, AuthLayout, DashboardLayout, AdminLayout
├── pages/
│   ├── public/          # Landing, About, Security
│   ├── auth/             # Login, Signup, VerifyEmail, ForgotPassword, ResetPassword
│   ├── dashboard/        # Dashboard, Transactions, SendMoney, AddMoney, Notifications, Profile
│   └── admin/             # AdminLogin, AdminDashboard, AdminUsers, AdminUserDetail,
│                          #   AdminTransactions, AdminAuditLogs, PartnershipMail
├── context/             # AuthContext, AdminAuthContext, ToastContext
├── routes/              # ProtectedRoute, AdminProtectedRoute
├── services/            # api.js (axios instance) + one *Api.js file per backend resource
├── utils/               # formatCurrency.js, validators.js
└── styles/              # tokens.css, global.css
```

## Routes

| Path | Description |
|---|---|
| `/` `/about` `/security` | Public site |
| `/login` `/signup` `/verify-email` `/forgot-password` `/reset-password` | User auth |
| `/dashboard` `/dashboard/transactions` `/dashboard/send-money` `/dashboard/add-money` `/dashboard/notifications` `/dashboard/profile` | User dashboard (protected) |
| `/admin/login` | Admin auth |
| `/admin/dashboard` `/admin/users` `/admin/users/:id` `/admin/transactions` `/admin/audit-logs` `/admin/partnership-mail` | Admin dashboard (protected) |

## Connected to the real backend

Every page calls the real API through `services/*Api.js` — no mock data remains.
`AuthContext` silently restores a logged-in session on page reload via `POST /auth/refresh`
using the httpOnly cookie, so `ProtectedRoute` waits for that check to finish before deciding
whether to redirect to `/login`. `AdminAuthContext` persists the separate admin JWT in
`localStorage`, verifies it with `GET /admin/me`, and returns to the admin login after an admin 401.

## Notable implementation notes

- **Send Money** follows the required flow: recipient lookup (`GET /accounts/lookup/:accountNumber`) -> preview -> PIN confirmation modal -> `POST /transactions/transfer`. The currency selector is USD-only right now, matching the backend's rule that real fund movement only happens in the account's base currency (see the backend README for the reasoning).
- **Add Money** currently has no direct online-deposit flow — it shows the account number to
	share with customer support for assistance with balance credits.
- **Currency display** on the dashboard shows converted values for UX only, computed from placeholder rates (`MOCK_RATES` in `Dashboard.jsx`). This is intentionally still a frontend-only display convenience, not backend data — real conversion needs a real exchange-rate provider, a later enhancement.
- Admin and user auth are fully separate contexts, sessions, and tokens — no shared state.
- `api.js` automatically retries a request once with a refreshed access token if it gets a 401 (expired token), using the httpOnly refresh cookie. This is transparent to every page — no page needs to handle token expiry itself.

## Not yet built

- Real cross-currency transfers (an exchange-rate provider integration)
- Resend email delivery (the backend currently logs emails to its console in dev — see the backend README)
