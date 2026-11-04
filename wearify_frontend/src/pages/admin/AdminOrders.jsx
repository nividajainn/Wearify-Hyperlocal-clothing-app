import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllOrders } from '../../services/adminService'
import { errorMessage } from '../../services/api'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        setLoadError(errorMessage(err, 'Could not load data.'))
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statuses = ['ALL', 'PENDING', 'PROCESSING', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

  if (loading) return <LoadingSpinner text="Loading orders…" accent="var(--accent-admin)" />

  return (
    <div>
      {loadError && <div className="alert-strip alert-error">{loadError}</div>}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">All Orders</h1>
          <p className="page-header-subtitle">{orders.length} total orders across the platform</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(s)}
          >{s}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Shop</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon="📦" title="No orders found" /></td></tr>
              ) : filtered.map(order => (
                <tr key={order.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-admin)' }}>
                      #{order.id}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{order.userName || `User #${order.userId}`}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{order.shopName || '—'}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-user)' }}>
                      ₹{(order.total ?? 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td><StatusBadge status={order.status} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
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

export default AdminOrders
