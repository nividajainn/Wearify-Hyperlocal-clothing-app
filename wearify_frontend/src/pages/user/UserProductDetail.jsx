import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getProductById } from '../../services/productService'
import { addToCart } from '../../services/cartService'
import { errorMessage } from '../../services/api'

const UserProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [cartLoading, setCartLoading] = useState(false)
  const [cartMsg, setCartMsg] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        setError(errorMessage(err, 'Could not load this product.'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleAddToCart = async (type) => {
    if (!selectedSize && product?.sizes?.length) { setCartMsg('Error: Please select a size.'); return }
    setCartLoading(true); setCartMsg('')
    try {
      await addToCart({ productId: product.id, quantity: qty, size: selectedSize, type })
      setCartMsg(`Success: Added to cart to ${type.toLowerCase()}.`)
      setTimeout(() => setCartMsg(''), 3000)
    } catch (err) {
      setCartMsg(`Error: ${errorMessage(err, 'Failed to add to cart.')}`)
    } finally {
      setCartLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading product…" accent="var(--accent-user)" />
  if (error) return <ErrorMessage message={error} onRetry={() => navigate('/user/products')} />
  if (!product) return null

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ← Back to Products
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 36, alignItems: 'start' }}>
        {/* Image */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, color: 'var(--text-muted)', overflow: 'hidden' }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            'No Image'
          )}
        </div>

        {/* Info */}
        <div>
          <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{product.category}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, margin: '12px 0 8px' }}>{product.name}</h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 8 }}>{product.shopName}</p>

          <div style={{ display: 'flex', gap: 30, margin: '24px 0', alignItems: 'baseline' }}>
            {product.rentalPrice != null && <div>
              <div style={{ fontSize: 28, fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--text-primary)' }}>
                ₹{product.rentalPrice} <span style={{fontSize: 16, color: 'var(--text-muted)'}}>/ DAY RENT</span>
              </div>
            </div>}
            {product.price != null && (
              <div>
                <div style={{ fontSize: 28, fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--text-primary)' }}>
                  ₹{product.price} <span style={{fontSize: 16, color: 'var(--text-muted)'}}>BUY</span>
                </div>
              </div>
            )}
          </div>

          {product.description && (
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>{product.description}</p>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, letterSpacing: '0.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Select Size</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${selectedSize === s ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                      background: selectedSize === s ? 'var(--accent-primary)' : 'var(--bg-card)',
                      color: selectedSize === s ? 'var(--text-inverse)' : 'var(--text-primary)',
                      fontSize: 15, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity</div>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-value" style={{ fontSize: 16 }}>{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock || 1, q + 1))}>+</button>
            </div>
            <span style={{ fontSize: 13, color: product.available ? 'var(--text-muted)' : '#dc2626' }}>
              {product.available ? `${product.stock} in stock` : 'Currently unavailable'}
            </span>
          </div>

          {cartMsg.startsWith('Success') && (
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/user/cart')} style={{ marginBottom: 8 }}>Go to cart →</button>
          )}
          {cartMsg && (
            <div className={`alert-strip ${cartMsg.startsWith('Success') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 12 }}>
              {cartMsg}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            {product.rentalPrice != null && <button
              className="btn btn-outline btn-lg"
              onClick={() => handleAddToCart('RENT')}
              disabled={cartLoading || !product.available}
              style={{ flex: 1 }}
            >
              {cartLoading ? '...' : `RENT - ₹${product.rentalPrice}/DAY`}
            </button>}
            {product.price != null && (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => handleAddToCart('BUY')}
                disabled={cartLoading || !product.available}
                style={{ flex: 1 }}
              >
                {cartLoading ? '...' : `BUY NOW - ₹${product.price}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProductDetail
