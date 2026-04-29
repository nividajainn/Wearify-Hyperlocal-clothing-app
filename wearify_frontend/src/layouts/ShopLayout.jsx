import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ShopSidebar from '../components/shop/ShopSidebar'

const titleMap = {
  '/shop/dashboard': { title: 'Shop Dashboard', sub: 'Overview of your store performance' },
  '/shop/products': { title: 'My Products', sub: 'Manage your inventory' },
  '/shop/add-product': { title: 'Add Product', sub: 'List a new item on Wearify' },
  '/shop/orders': { title: 'Shop Orders', sub: 'Orders received for your products' },
}

const ShopLayout = () => {
  const { pathname } = useLocation()
  const meta = titleMap[pathname] || { title: 'Shop', sub: '' }

  return (
    <div className="app-shell">
      <ShopSidebar />
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

export default ShopLayout
