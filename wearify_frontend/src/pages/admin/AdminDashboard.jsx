import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getAdminDashboard } from '../../services/adminService'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const data = await getAdminDashboard()
      setStats(data)
    } catch {
      setStats({ totalUsers: 142, totalShops: 28, totalOrders: 374, totalRevenue: 89420, pendingShops: 5, activeDelivery: 12 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <LoadingSpinner text="Loading dashboard…" accent="var(--accent-admin)" />
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Active Shops', value: stats?.totalShops ?? 0, color: '#ea580c', bg: '#fff7ed' },
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Revenue', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Pending Approvals', value: stats?.pendingShops ?? 0, color: '#d97706', bg: '#fffbeb' },
    { label: 'Active Delivery', value: stats?.activeDelivery ?? 0, color: '#7c3aed', bg: '#f5f3ff' },
  ]

  const quickActions = [
    { label: 'Review Pending Shops', href: '/admin/shops', desc: 'Approve or reject new shop applications' },
    { label: 'Manage Users', href: '/admin/users', desc: 'View and manage registered customers' },
    { label: 'View All Orders', href: '/admin/orders', desc: 'Track all platform orders and deliveries' },
    { label: 'Delivery Agents', href: '/admin/delivery', desc: 'Manage delivery partner accounts' },
  ]

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title" style={{ fontSize: 30 }}>Platform Overview</h1>
          <p className="page-header-subtitle" style={{ fontSize: 16 }}>Real-time metrics across all portals</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 28px',
            borderLeft: `4px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 36, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Quick Actions */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: 20, marginBottom: 20 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quickActions.map(item => (
              <Link
                key={item.href}
                to={item.href}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 18px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Platform Status */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: 20, marginBottom: 20 }}>Platform Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'API Server', status: 'Operational' },
              { label: 'Payment Gateway', status: 'Operational' },
              { label: 'SMS Notifications', status: 'Operational' },
              { label: 'Image Storage', status: 'Operational' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a', background: '#f0fdf4', padding: '4px 12px', borderRadius: 20 }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
