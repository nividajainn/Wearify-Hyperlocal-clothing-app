import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { getAssignedOrders, markPickup, markOutForDelivery, markDelivered } from '../../services/deliveryService'

const NEXT_ACTION = {
  ASSIGNED: { label: '📦 Mark Picked Up', action: 'pickup', btnClass: 'btn-shop' },
  OUT_FOR_DELIVERY: { label: '✓ Mark Delivered', action: 'delivered', btnClass: 'btn-success' },
}

const DeliveryAssigned = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [msg, setMsg] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await getAssignedOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      setOrders([
        { id: 201, customerName: 'Priya Sharma', address: '12, MG Road, Andheri East, Mumbai – 400069', shopName: 'Trendy Threads', total: 447, status: 'ASSIGNED', items: [{ name: 'Floral Dress', qty: 1 }] },
        { id: 202, customerName: 'Rahul Mehta', address: '34, Linking Road, Bandra West, Mumbai – 400050', shopName: 'Style Hub', total: 850, status: 'OUT_FOR_DELIVERY', items: [{ name: 'Formal Blazer', qty: 1 }] },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleAction = async (order) => {
    const actionMap = { ASSIGNED: markPickup, OUT_FOR_DELIVERY: markDelivered }
    const nextStatusMap = { ASSIGNED: 'OUT_FOR_DELIVERY', OUT_FOR_DELIVERY: 'DELIVERED' }

    const fn = actionMap[order.status]
    if (!fn) return
    setActionLoading(order.id)
    try {
      await fn(order.id)
      const nextStatus = nextStatusMap[order.status]
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: nextStatus } : o))
      setMsg(`Order #${order.id} updated to ${nextStatus.replace('_', ' ')}!`)
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg(`Failed to update Order #${order.id}.`)
    } finally {
      setActionLoading(null)
    }
  }

  const active = orders.filter(o => o.status !== 'DELIVERED')

  if (loading) return <LoadingSpinner text="Fetching assigned orders…" accent="var(--accent-delivery)" />

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Assigned Orders</h1>
          <p className="page-header-subtitle">{active.length} order{active.length !== 1 ? 's' : ''} need attention</p>
        </div>
      </div>

      {msg && <div className={`alert-strip ${msg.startsWith('Failed') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

      {active.length === 0 ? (
        <div className="card">
          <EmptyState icon="🛵" title="All clear!" text="You have no pending orders right now. Check back later." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {active.map(order => {
            const nextAction = NEXT_ACTION[order.status]
            return (
              <div key={order.id} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--accent-delivery)' }}>
                        Order #{order.id}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                      👤 {order.customerName}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      📍 {order.address}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      🏪 From: {order.shopName}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--accent-user)' }}>
                      ₹{(order.total ?? 0).toLocaleString('en-IN')}
                    </div>
                    {order.items?.length > 0 && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                        {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {nextAction && (
                  <button
                    className={`btn ${nextAction.btnClass}`}
                    onClick={() => handleAction(order)}
                    disabled={actionLoading === order.id}
                    style={{ width: '100%' }}
                  >
                    {actionLoading === order.id ? (
                      <>
                        <span style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        Updating…
                      </>
                    ) : nextAction.label}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DeliveryAssigned
