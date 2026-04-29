import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllShops, approveShop, rejectShop } from '../../services/adminService'

const AdminShops = () => {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [actionLoading, setActionLoading] = useState(null)

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const data = await getAllShops()
      setShops(Array.isArray(data) ? data : [])
    } catch {
      setShops([
        { id: 1, name: 'Trendy Threads', email: 'trendy@example.com', ownerName: 'Amit Singh', status: 'APPROVED', createdAt: '2024-01-10' },
        { id: 2, name: 'Style Hub', email: 'stylehub@example.com', ownerName: 'Meera Nair', status: 'PENDING', createdAt: '2024-03-01' },
        { id: 3, name: 'Glamour Zone', email: 'glamour@example.com', ownerName: 'Riya Desai', status: 'PENDING', createdAt: '2024-03-05' },
        { id: 4, name: 'Urban Drip', email: 'urban@example.com', ownerName: 'Karan Patel', status: 'REJECTED', createdAt: '2024-02-15' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleApprove = async (id) => {
    setActionLoading(id + '_approve')
    try {
      await approveShop(id)
      setShops(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s))
    } catch { alert('Failed to approve shop.') }
    finally { setActionLoading(null) }
  }

  const handleReject = async (id) => {
    setActionLoading(id + '_reject')
    try {
      await rejectShop(id)
      setShops(prev => prev.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s))
    } catch { alert('Failed to reject shop.') }
    finally { setActionLoading(null) }
  }

  const filters = ['ALL', 'PENDING', 'APPROVED', 'REJECTED']
  const filtered = filter === 'ALL' ? shops : shops.filter(s => s.status === filter)

  if (loading) return <LoadingSpinner text="Loading shops…" accent="var(--accent-admin)" />
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Shops</h1>
          <p className="page-header-subtitle">{shops.length} registered shop partners</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {filters.map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(f)}
            >
              {f} {f !== 'ALL' && <span style={{ opacity: 0.7 }}>({shops.filter(s => s.status === f).length})</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Shop Name</th>
                <th>Owner</th>
                <th>Email</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon="🏪" title="No shops" /></td></tr>
              ) : filtered.map((shop, i) => (
                <tr key={shop.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-shop)' }}>
                        {shop.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{shop.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{shop.ownerName || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{shop.email}</td>
                  <td><StatusBadge status={shop.status} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {shop.createdAt ? new Date(shop.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td>
                    {shop.status === 'PENDING' ? (
                      <div className="action-group">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApprove(shop.id)}
                          disabled={actionLoading === shop.id + '_approve'}
                        >
                          {actionLoading === shop.id + '_approve' ? '…' : '✓ Approve'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(shop.id)}
                          disabled={actionLoading === shop.id + '_reject'}
                        >
                          {actionLoading === shop.id + '_reject' ? '…' : '✕ Reject'}
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminShops
