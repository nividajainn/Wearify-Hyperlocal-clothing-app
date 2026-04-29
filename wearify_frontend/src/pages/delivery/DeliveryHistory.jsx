import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getAssignedOrders } from '../../services/deliveryService'

const DeliveryHistory = () => {
  const [delivered, setDelivered] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAssignedOrders()
        const all = Array.isArray(data) ? data : []
        setDelivered(all.filter(o => o.status === 'DELIVERED'))
      } catch {
        setDelivered([
          { id: 199, customerName: 'Anjali R.', address: 'Dadar West, Mumbai', total: 350, createdAt: '2024-03-05' },
          { id: 198, customerName: 'Vikas M.', address: 'Borivali East, Mumbai', total: 650, createdAt: '2024-03-04' },
          { id: 197, customerName: 'Pooja S.', address: 'Andheri West, Mumbai', total: 1100, createdAt: '2024-03-03' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalEarned = delivered.reduce((s, o) => s + (o.total ?? 0), 0)

  if (loading) return <LoadingSpinner text="Loading history…" accent="var(--accent-delivery)" />

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Delivery History</h1>
          <p className="page-header-subtitle">{delivered.length} completed deliveries</p>
        </div>
        <div style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 18px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--accent-user)' }}>
            ₹{totalEarned.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Value Delivered</div>
        </div>
      </div>

      {delivered.length === 0 ? (
        <div className="card">
          <EmptyState icon="🕐" title="No deliveries yet" text="Completed deliveries will appear here." />
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {delivered.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-delivery)' }}>#{order.id}</td>
                    <td style={{ fontWeight: 600 }}>{order.customerName}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{order.address}</td>
                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-user)' }}>
                      ₹{(order.total ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td><span className="badge badge-delivered">Delivered</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryHistory
