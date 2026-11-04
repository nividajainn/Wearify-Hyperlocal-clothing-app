import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import { getAllProducts } from '../../services/productService'
import { errorMessage } from '../../services/api'

const UserProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'All'
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const data = await getAllProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(errorMessage(err, 'Could not load products.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort()]
  const q = search.toLowerCase()
  const filtered = products.filter(p =>
    (category === 'All' || p.category === category) && (
      p.name?.toLowerCase().includes(q) ||
      p.shopName?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
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

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button
            key={c}
            className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setParams(c === 'All' ? {} : { category: c })}
          >{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No products found" text={products.length ? 'Try a different search or category.' : 'Shops near you haven\'t listed anything yet.'} />
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
                  {product.rentalPrice != null && <div><span style={{ color: 'var(--text-muted)' }}>Rent</span> ₹{product.rentalPrice}/day</div>}
                  {product.price != null && <div><span style={{ color: 'var(--text-muted)' }}>Buy</span> ₹{product.price}</div>}
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
