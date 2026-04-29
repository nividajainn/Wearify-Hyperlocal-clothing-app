import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'

const titleMap = {
  '/admin/dashboard': { title: 'Dashboard', sub: 'Welcome back, Admin' },
  '/admin/users': { title: 'Users', sub: 'Manage all registered users' },
  '/admin/shops': { title: 'Shops', sub: 'Manage shop partners' },
  '/admin/delivery': { title: 'Delivery Agents', sub: 'Manage delivery partners' },
  '/admin/orders': { title: 'Orders', sub: 'All platform orders' },
}

const AdminLayout = () => {
  const { pathname } = useLocation()
  const meta = titleMap[pathname] || { title: 'Admin', sub: '' }

  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="main-content">
        <header className="navbar">
          <div className="navbar-title">
            {meta.title}
            {meta.sub && <span className="navbar-subtitle">{meta.sub}</span>}
          </div>
          <div className="navbar-actions">
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
