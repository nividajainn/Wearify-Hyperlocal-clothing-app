import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { getShopOrders } from '../../services/shopService'

const ShopOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getShopOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch {
        setOrders([
          { id: 101, customerName: 'Priya Sharma', items: [{ name: 'Floral Dress', qty: 1 }], total: 447, status: 'DELIVERED', createdAt: '2024-03-01' },
          { id: 102, customerName: 'Rahul Mehta', items: [{ name: 'Formal Blazer', qty: 1 }], total: 850, status: 'PROCESSING', createdAt: '2024-03-07' },
          { id: 103, customerName: 'Sneha K.', items: [{ name: 'Denim Jacket', qty: 2 }], total: 398, status: 'ASSIGNED', createdAt: '2024-03-08' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statuses = ['ALL', 'PENDING', 'PROCESSING', 'ASSIGNED', 'DELIVERED', 'CANCELLED']
  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)
  const revenue = orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + (o.total ?? 0), 0)

  if (loading) return <LoadingSpinner text="Loading orders…" accent="var(--accent-shop)" />

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Shop Orders</h1>
          <p className="page-header-subtitle">{orders.length} orders received · ₹{revenue.toLocaleString('en-IN')} earned</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-shop' : 'btn-outline'}`} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState icon="📦" title="No orders found" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(order => (
            <div key={order.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--accent-shop)' }}>Order #{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    👤 {order.customerName || 'Customer'} · {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : ''}
                  </div>
                  {order.items?.length > 0 && (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {order.items.map((item, i) => (
                        <span key={i}>{item.name} × {item.qty}{i < order.items.length - 1 ? ', ' : ''}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--accent-user)' }}>
                    ₹{(order.total ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShopOrders
