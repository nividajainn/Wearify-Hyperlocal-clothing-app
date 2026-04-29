# Wearify – Hyperlocal Fashion Rental Platform

A production-ready React frontend for Wearify, a hyperlocal clothing rental and buying platform with **4 role-based portals** in a single app.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then visit: **http://localhost:5173**

---

## Role Portals

| Role | Default Route | Login As |
|------|--------------|----------|
| Admin | `/admin/dashboard` | Pre-provisioned only |
| User | `/user/home` | Register as Customer |
| Shop | `/shop/dashboard` | Register as Shop Owner |
| Delivery | `/delivery/dashboard` | Register as Delivery Partner |

---

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared: ProtectedRoute, RoleProtectedRoute, StatCard, etc.
│   ├── admin/           # AdminSidebar
│   ├── user/            # UserSidebar
│   ├── shop/            # ShopSidebar
│   └── delivery/        # DeliverySidebar
├── context/
│   └── AuthContext.jsx  # Global auth state (token, role, user, login, logout)
├── layouts/
│   ├── AdminLayout.jsx
│   ├── UserLayout.jsx
│   ├── ShopLayout.jsx
│   └── DeliveryLayout.jsx
├── pages/
│   ├── auth/            # Login, Register
│   ├── admin/           # Dashboard, Users, Shops, Delivery, Orders
│   ├── user/            # Home, Products, ProductDetail, Cart, Checkout, Orders
│   ├── shop/            # Dashboard, Products, AddProduct, Orders
│   └── delivery/        # Dashboard, AssignedOrders, History
├── routes/
│   └── AppRoutes.jsx    # All routes with ProtectedRoute + RoleProtectedRoute
├── services/
│   ├── api.js           # Axios instance (baseURL, JWT interceptor, 401 redirect)
│   ├── authService.js
│   ├── adminService.js
│   ├── productService.js
│   ├── cartService.js
│   ├── orderService.js
│   ├── shopService.js
│   └── deliveryService.js
└── utils/
    ├── tokenHelper.js
    └── getRoleRedirect.js
```

---

## Backend Connection

Set base URL in `src/services/api.js`:

```js
baseURL: 'http://localhost:8081'
```

All API calls use services — no direct Axios calls in components.

JWT token is auto-attached to every request via Axios interceptor.
On 401, the user is redirected to `/login` automatically.

---

## Demo Mode

When the backend is not running, every page falls back to realistic demo data so the UI is fully explorable without a live server.

---

## Tech Stack

- React 18 + Vite
- React Router DOM v6
- Context API (AuthContext)
- Axios (with interceptors)
- Pure CSS design system (no Tailwind dependency)
- Google Fonts: Outfit + DM Sans
