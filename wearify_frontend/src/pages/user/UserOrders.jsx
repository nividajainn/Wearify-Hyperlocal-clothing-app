import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { getMyOrders, cancelMyOrder } from '../../services/orderService'
import { errorMessage } from '../../services/api'

const TIMELINE_STEPS = ['PENDING', 'PROCESSING', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED']

const UserOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(null)

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return
    setCancelling(id); setError('')
    try {
      const updated = await cancelMyOrder(id)
      setOrders(prev => prev.map(o => o.id === id ? updated : o))
    } catch (err) {
      setError(errorMessage(err, 'Could not cancel the order.'))
    } finally {
      setCancelling(null)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(errorMessage(err, 'Could not load your orders.'))
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

      {error && <div className="alert-strip alert-error">{error}</div>}

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
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.paymentMethod === 'COD' ? 'Cash on delivery' : order.paymentMethod}</div>
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

                {order.status === 'PENDING' && (
                  <button className="btn btn-sm btn-danger" style={{ marginBottom: 16 }} onClick={() => handleCancel(order.id)} disabled={cancelling === order.id}>
                    {cancelling === order.id ? 'Cancelling…' : 'Cancel order'}
                  </button>
                )}

                {/* Timeline */}
                {order.status === 'CANCELLED' ? (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>This order was cancelled.</div>
                ) : <div className="order-timeline">
                  {TIMELINE_STEPS.map((step, i) => (
                    <div key={step} className={`order-timeline-step${i <= stepIdx ? ' done' : ''}`}>
                      <div className="timeline-dot">{i <= stepIdx ? '✓' : ''}</div>
                      <div className="timeline-label">{step.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                </div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UserOrders
