import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import { getAllProducts } from '../../services/productService'

const DEMO_PRODUCTS = [
  { id: 1, name: 'Floral Summer Dress', shopName: 'Trendy Threads', price: 299, rentalPrice: 99, category: 'Dresses', available: true, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80' },
  { id: 2, name: 'Classic Formal Blazer', shopName: 'Style Hub', price: 1200, rentalPrice: 299, category: 'Formals', available: true, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80' },
  { id: 3, name: 'Denim Jacket', shopName: 'Urban Drip', price: 899, rentalPrice: 199, category: 'Jackets', available: true, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80' },
  { id: 4, name: 'Silk Saree', shopName: 'Ethnic Elegance', price: 2500, rentalPrice: 499, category: 'Ethnic', available: true, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80' },
  { id: 5, name: 'Casual Linen Shirt', shopName: 'Trendy Threads', price: 450, rentalPrice: 120, category: 'Casuals', available: false, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80' },
  { id: 6, name: 'Party Gown', shopName: 'Style Hub', price: 3200, rentalPrice: 799, category: 'Dresses', available: true, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80' },
  { id: 7, name: 'Leather Biker Jacket', shopName: 'Urban Drip', price: 2800, rentalPrice: 450, category: 'Jackets', available: true, image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&q=80' },
  { id: 8, name: 'Cotton Kurta Set', shopName: 'Ethnic Elegance', price: 1500, rentalPrice: 350, category: 'Ethnic', available: true, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' },
]

const UserProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const data = await getAllProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setProducts(DEMO_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.shopName?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner text="Fetching products…" accent="var(--accent-user)" />
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title" style={{ fontSize: 30 }}>Browse Products</h1>
          <p className="page-header-subtitle" style={{ fontSize: 16 }}>{filtered.length} items available near you</p>
        </div>
        <input
          className="form-input"
          style={{ width: 300, fontSize: 15 }}
          placeholder="Search products, shops…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No products found" text="Try a different search term." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {filtered.map(product => (
            <div
              key={product.id}
              onClick={() => navigate(`/user/products/${product.id}`)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ height: 220, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 20 }}>No Image</div>
                )}
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{product.name}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>{product.shopName || 'Local Shop'}</div>
                {product.category && (
                  <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{product.category}</span>
                )}
                <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 15, fontWeight: 500 }}>
                  {product.rentalPrice && <div><span style={{ color: 'var(--text-muted)' }}>Rent</span> ₹{product.rentalPrice}/day</div>}
                  {product.price && <div><span style={{ color: 'var(--text-muted)' }}>Buy</span> ₹{product.price}</div>}
                </div>
                {!product.available && (
                  <span className="badge badge-pending" style={{ marginTop: 8 }}>Unavailable</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserProducts
