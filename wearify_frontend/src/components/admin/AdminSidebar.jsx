import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin/dashboard', icon: 'D', label: 'Dashboard' },
  { to: '/admin/users', icon: 'U', label: 'Users' },
  { to: '/admin/shops', icon: 'S', label: 'Shops' },
  { to: '/admin/delivery', icon: 'A', label: 'Delivery' },
  { to: '/admin/orders', icon: 'O', label: 'Orders' },
]

const AdminSidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Wearify" className="sidebar-logo-icon" style={{ objectFit: 'contain' }} />
        <span className="sidebar-logo-text">Wearify</span>
        <span className="sidebar-logo-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>Admin</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            style={({ isActive }) => isActive ? { '--active-color': 'var(--accent-admin)' } : {}}
          >
            {({ isActive }) => (
              <>
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-admin)' }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-card" onClick={handleLogout} title="Click to logout">
          <div className="sidebar-avatar" style={{ background: '#eff6ff', color: '#2563eb' }}>{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Admin'}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>→</span>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
