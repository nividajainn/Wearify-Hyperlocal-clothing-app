import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAllProducts } from '../../services/productService'

const categories = [
  { label: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80' },
  { label: 'Formals', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80' },
  { label: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80' },
  { label: 'Casuals', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80' },
  { label: 'Accessories', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80' },
  { label: 'Ethnic', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80' },
]

const UserHome = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])

  useEffect(() => {
    getAllProducts().then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  const countFor = (label) => products.filter(p => p.category === label).length

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)',
        padding: '48px 40px',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, marginBottom: 14, lineHeight: 1.1 }}>
          Welcome back, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 480, lineHeight: 1.6 }}>
          Discover hyperlocal fashion. Rent or buy outfits from shops near you — fresh styles, fair prices.
        </p>
        <div style={{ display: 'flex', gap: 14 }}>
          <Link to="/user/products" className="btn btn-primary btn-lg">Browse Products</Link>
          <Link to="/user/orders" className="btn btn-outline btn-lg">My Orders</Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 32 }}>
        {[
          { label: 'Partner Shops', value: new Set(products.map(p => p.shopId)).size },
          { label: 'Products Available', value: products.length },
          { label: 'Delivery Fee per Shop', value: '₹49' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
            <div className="stat-info">
              <div className="stat-value" style={{ fontSize: 32 }}>{s.value}</div>
              <div className="stat-label" style={{ fontSize: 15 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories with Images */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ fontSize: 22 }}>Shop by Category</h3>
          <Link to="/user/products" style={{ fontSize: 15, color: 'var(--accent-primary)', fontWeight: 600 }}>View All →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {categories.map(cat => (
            <Link
              key={cat.label}
              to={`/user/products?category=${encodeURIComponent(cat.label)}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                overflow: 'hidden',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
            >
              <img src={cat.image} alt={cat.label} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
              <div style={{ padding: '14px 12px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{cat.label}</span>
                <span style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{countFor(cat.label)} item{countFor(cat.label) === 1 ? '' : 's'}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Cards */}
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ borderLeft: '3px solid var(--accent-user)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Your Cart</h3>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 16 }}>Review your selected items and proceed to checkout.</p>
          <Link to="/user/cart" className="btn btn-primary btn-sm">Go to Cart</Link>
        </div>
        <div className="card" style={{ borderLeft: '3px solid var(--accent-admin)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Track Orders</h3>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 16 }}>Check the status of your rentals and purchases.</p>
          <Link to="/user/orders" className="btn btn-outline btn-sm">View Orders</Link>
        </div>
      </div>
    </div>
  )
}

export default UserHome
