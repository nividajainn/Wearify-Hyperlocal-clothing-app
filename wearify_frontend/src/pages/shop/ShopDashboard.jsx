import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getShopProducts, getShopOrders } from '../../services/shopService'

const ShopDashboard = () => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, o] = await Promise.allSettled([getShopProducts(), getShopOrders()])
        setProducts(p.status === 'fulfilled' && Array.isArray(p.value) ? p.value : [
          { id: 1, name: 'Floral Dress', price: 99, available: true },
          { id: 2, name: 'Denim Jacket', price: 199, available: true },
          { id: 3, name: 'Formal Blazer', price: 299, available: false },
        ])
        setOrders(o.status === 'fulfilled' && Array.isArray(o.value) ? o.value : [
          { id: 101, customerName: 'Priya S.', total: 447, status: 'DELIVERED' },
          { id: 102, customerName: 'Rahul M.', total: 850, status: 'PROCESSING' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const revenue = orders.reduce((s, o) => s + (o.total ?? 0), 0)

  if (loading) return <LoadingSpinner text="Loading dashboard…" accent="var(--accent-shop)" />

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Shop Dashboard</h1>
          <p className="page-header-subtitle">Your store performance at a glance</p>
        </div>
        <Link to="/shop/add-product" className="btn btn-shop">+ Add Product</Link>
      </div>

      <div className="stats-grid">
        <StatCard icon="👔" label="Total Products" value={products.length} color="amber" />
        <StatCard icon="✅" label="Available Items" value={products.filter(p => p.available).length} color="teal" />
        <StatCard icon="📦" label="Total Orders" value={orders.length} color="purple" />
        <StatCard icon="💰" label="Total Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} color="teal" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <Link to="/shop/orders" style={{ fontSize: 13, color: 'var(--accent-shop)', fontWeight: 600 }}>View All →</Link>
          </div>
          {orders.slice(0, 5).map(order => (
            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Order #{order.id}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.customerName || 'Customer'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-user)' }}>₹{order.total}</div>
                <span className={`badge badge-${(order.status || '').toLowerCase()}`} style={{ fontSize: 11 }}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Product List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">My Products</h3>
            <Link to="/shop/products" style={{ fontSize: 13, color: 'var(--accent-shop)', fontWeight: 600 }}>Manage →</Link>
          </div>
          {products.slice(0, 5).map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>👗</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--accent-shop)' }}>₹{p.price}</span>
                <span className={`badge ${p.available ? 'badge-approved' : 'badge-pending'}`} style={{ fontSize: 11 }}>
                  {p.available ? 'Live' : 'Unavail.'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShopDashboard
