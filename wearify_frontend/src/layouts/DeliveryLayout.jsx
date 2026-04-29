import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import DeliverySidebar from '../components/delivery/DeliverySidebar'

const titleMap = {
  '/delivery/dashboard': { title: 'Delivery Dashboard', sub: 'Your daily delivery overview' },
  '/delivery/assigned-orders': { title: 'Assigned Orders', sub: 'Orders waiting for pickup or delivery' },
  '/delivery/history': { title: 'Delivery History', sub: 'Completed deliveries' },
}

const DeliveryLayout = () => {
  const { pathname } = useLocation()
  const meta = titleMap[pathname] || { title: 'Delivery', sub: '' }

  return (
    <div className="app-shell">
      <DeliverySidebar />
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

export default DeliveryLayout
