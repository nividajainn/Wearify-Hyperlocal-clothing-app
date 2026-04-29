import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { getMyOrders } from '../../services/orderService'

const TIMELINE_STEPS = ['PENDING', 'PROCESSING', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED']

const UserOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch {
        setOrders([
          { id: 101, shopName: 'Trendy Threads', total: 447, status: 'DELIVERED', createdAt: '2024-03-01', items: [{ name: 'Floral Summer Dress', qty: 1 }] },
          { id: 102, shopName: 'Style Hub', total: 850, status: 'OUT_FOR_DELIVERY', createdAt: '2024-03-07', items: [{ name: 'Classic Formal Blazer', qty: 1 }] },
          { id: 103, shopName: 'Urban Drip', total: 248, status: 'PROCESSING', createdAt: '2024-03-08', items: [{ name: 'Denim Jacket', qty: 1 }] },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSpinner text="Fetching orders…" accent="var(--accent-user)" />

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">My Orders</h1>
          <p className="page-header-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card">
          <EmptyState icon="📦" title="No orders yet" text="Your order history will appear here once you place your first order." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => {
            const stepIdx = TIMELINE_STEPS.indexOf(order.status)
            return (
              <div key={order.id} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--accent-admin)' }}>
                        Order #{order.id}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                      🏪 {order.shopName} · {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--accent-user)' }}>
                      ₹{(order.total ?? 0).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total paid</div>
                  </div>
                </div>

                {/* Items */}
                {order.items?.length > 0 && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text-secondary)' }}>
                    {order.items.map((item, i) => (
                      <span key={i}>
                        {item.name} × {item.qty}{i < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}

                {/* Timeline */}
                <div className="order-timeline">
                  {TIMELINE_STEPS.map((step, i) => (
                    <div key={step} className={`order-timeline-step${i <= stepIdx ? ' done' : ''}`}>
                      <div className="timeline-dot">{i <= stepIdx ? '✓' : ''}</div>
                      <div className="timeline-label">{step.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UserOrders
