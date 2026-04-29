import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/user/home', icon: 'H', label: 'Home' },
  { to: '/user/products', icon: 'P', label: 'Browse Products' },
  { to: '/user/cart', icon: 'C', label: 'My Cart' },
  { to: '/user/orders', icon: 'O', label: 'My Orders' },
]

const UserSidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Wearify" className="sidebar-logo-icon" style={{ objectFit: 'contain' }} />
        <span className="sidebar-logo-text">Wearify</span>
        <span className="sidebar-logo-badge" style={{ background: '#f0fdf4', color: '#16a34a' }}>User</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}>
            {({ isActive }) => (
              <>
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-user)' }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-card" onClick={handleLogout} title="Click to logout">
          <div className="sidebar-avatar" style={{ background: '#f0fdf4', color: '#16a34a' }}>{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-role">Customer</div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>→</span>
        </div>
      </div>
    </aside>
  )
}

export default UserSidebar
