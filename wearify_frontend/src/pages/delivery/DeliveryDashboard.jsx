import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatusBadge from '../../components/common/StatusBadge'
import { getAssignedOrders } from '../../services/deliveryService'

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAssignedOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch {
        setOrders([
          { id: 201, customerName: 'Priya Sharma', address: '12, MG Road, Mumbai', status: 'ASSIGNED', total: 447 },
          { id: 202, customerName: 'Rahul Mehta', address: '34, Bandra West, Mumbai', status: 'OUT_FOR_DELIVERY', total: 850 },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const assigned = orders.filter(o => o.status === 'ASSIGNED')
  const outForDelivery = orders.filter(o => o.status === 'OUT_FOR_DELIVERY')
  const delivered = orders.filter(o => o.status === 'DELIVERED')

  if (loading) return <LoadingSpinner text="Loading…" accent="var(--accent-delivery)" />

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Delivery Dashboard</h1>
          <p className="page-header-subtitle">Today's delivery overview</p>
        </div>
        <Link to="/delivery/assigned-orders" className="btn btn-delivery">View Assigned →</Link>
      </div>

      <div className="stats-grid">
        <StatCard icon="📋" label="Awaiting Pickup" value={assigned.length} color="amber" />
        <StatCard icon="🛵" label="Out for Delivery" value={outForDelivery.length} color="red" />
        <StatCard icon="✅" label="Delivered Today" value={delivered.length} color="teal" />
        <StatCard icon="📦" label="Total Assigned" value={orders.length} color="purple" />
      </div>

      {/* Active Orders */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Active Orders</h3>
          <Link to="/delivery/assigned-orders" style={{ fontSize: 13, color: 'var(--accent-delivery)', fontWeight: 600 }}>Manage All →</Link>
        </div>
        {orders.filter(o => o.status !== 'DELIVERED').length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)', fontSize: 14 }}>
            🎉 No active orders right now. Great work!
          </div>
        ) : (
          orders.filter(o => o.status !== 'DELIVERED').map(order => (
            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-default)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-delivery)', fontSize: 15 }}>Order #{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>👤 {order.customerName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>📍 {order.address}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-user)' }}>₹{order.total}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DeliveryDashboard
