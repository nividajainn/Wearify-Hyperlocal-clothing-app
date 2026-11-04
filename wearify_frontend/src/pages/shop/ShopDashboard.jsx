import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getShopProducts, getShopOrders, getMyShop } from '../../services/shopService'

const ShopDashboard = () => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [shop, setShop] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, o, sh] = await Promise.allSettled([getShopProducts(), getShopOrders(), getMyShop()])
        setProducts(p.status === 'fulfilled' && Array.isArray(p.value) ? p.value : [])
        setOrders(o.status === 'fulfilled' && Array.isArray(o.value) ? o.value : [])
        if (sh.status === 'fulfilled') setShop(sh.value)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const revenue = orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + (o.subtotal ?? 0), 0)

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

      {shop && shop.status !== 'APPROVED' && (
        <div className={`alert-strip ${shop.status === 'REJECTED' ? 'alert-error' : 'alert-warning'}`}>
          {shop.status === 'REJECTED'
            ? `${shop.name} was not approved. Contact the Wearify team for details.`
            : `${shop.name} is waiting for admin approval. You can add products now; customers will see them once you're approved.`}
        </div>
      )}

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
          {orders.length === 0 && <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: 14 }}>No orders yet.</div>}
          {orders.slice(0, 5).map(order => (
            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Order #{order.id}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.customerName || 'Customer'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-user)' }}>₹{order.total}</div>
                <span className={`badge badge-${(order.status || '').toLowerCase().replace(/_/g, '-')}`} style={{ fontSize: 11 }}>{order.status}</span>
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
                {p.image ? <img src={p.image} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} /> : <span style={{ fontSize: 20 }}>👗</span>}
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
