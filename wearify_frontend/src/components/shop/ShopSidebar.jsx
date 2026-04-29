import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/shop/dashboard', icon: 'D', label: 'Dashboard' },
  { to: '/shop/products', icon: 'P', label: 'My Products' },
  { to: '/shop/add-product', icon: '+', label: 'Add Product' },
  { to: '/shop/orders', icon: 'O', label: 'Orders' },
]

const ShopSidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Wearify" className="sidebar-logo-icon" style={{ objectFit: 'contain' }} />
        <span className="sidebar-logo-text">Wearify</span>
        <span className="sidebar-logo-badge" style={{ background: '#fff7ed', color: '#ea580c' }}>Shop</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Shop Panel</div>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}>
            {({ isActive }) => (
              <>
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-shop)' }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-card" onClick={handleLogout} title="Click to logout">
          <div className="sidebar-avatar" style={{ background: '#fff7ed', color: '#ea580c' }}>{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Shop Owner'}</div>
            <div className="sidebar-user-role">Shop Partner</div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>→</span>
        </div>
      </div>
    </aside>
  )
}

export default ShopSidebar
