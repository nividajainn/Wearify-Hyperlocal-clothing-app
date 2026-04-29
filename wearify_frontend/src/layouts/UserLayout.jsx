import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import UserSidebar from '../components/user/UserSidebar'

const titleMap = {
  '/user/home': { title: 'Welcome to Wearify', sub: 'Discover & rent trendy outfits near you' },
  '/user/products': { title: 'Browse Products', sub: 'Explore hyperlocal fashion' },
  '/user/cart': { title: 'My Cart', sub: 'Review your selections' },
  '/user/checkout': { title: 'Checkout', sub: 'Complete your order' },
  '/user/orders': { title: 'My Orders', sub: 'Track all your rentals & purchases' },
}

const UserLayout = () => {
  const { pathname } = useLocation()
  const base = '/' + pathname.split('/').slice(1, 3).join('/')
  const meta = titleMap[base] || { title: 'Wearify', sub: '' }

  return (
    <div className="app-shell">
      <UserSidebar />
      <div className="main-content">
        <header className="navbar">
          <div className="navbar-title">
            {meta.title}
            {meta.sub && <span className="navbar-subtitle">{meta.sub}</span>}
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default UserLayout
