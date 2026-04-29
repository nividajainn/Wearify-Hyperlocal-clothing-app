import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addShopProduct } from '../../services/shopService'

const CATEGORIES = ['Dresses', 'Formals', 'Jackets', 'Casuals', 'Ethnic', 'Accessories', 'Sportswear', 'Party Wear']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']

const ShopAddProduct = () => {
  const [form, setForm] = useState({
    name: '', description: '', category: '', price: '', rentalPrice: '',
    stock: '', sizes: [], available: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (error) setError('')
  }

  const toggleSize = (s) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(s) ? prev.sizes.filter(x => x !== s) : [...prev.sizes, s],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.price) {
      setError('Product name, category, and buy price are required.')
      return
    }
    setLoading(true); setError('')
    try {
      await addShopProduct({
        ...form,
        price: Number(form.price),
        rentalPrice: form.rentalPrice ? Number(form.rentalPrice) : undefined,
        stock: form.stock ? Number(form.stock) : undefined,
      })
      setSuccess(true)
      setTimeout(() => navigate('/shop/products'), 1800)
    } catch {
      setError('Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 60 }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>Product Added!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting to your products…</p>
        <div className="spinner" style={{ borderTopColor: 'var(--accent-shop)' }} />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Add New Product</h1>
          <p className="page-header-subtitle">List a new item on Wearify marketplace</p>
        </div>
      </div>

      <div style={{ maxWidth: 680 }}>
        {error && <div className="alert-strip alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="card-title" style={{ marginBottom: 20 }}>Basic Info</h3>

            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className="form-input shop" name="name" placeholder="e.g. Floral Summer Dress" value={form.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input shop"
                name="description"
                placeholder="Describe the product — material, occasion, care instructions…"
                value={form.description}
                onChange={handleChange}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input form-select shop" name="category" value={form.category} onChange={handleChange}>
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="card-title" style={{ marginBottom: 20 }}>Pricing & Stock</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Buy Price (₹) *</label>
                <input className="form-input shop" name="price" type="number" min="0" placeholder="1200" value={form.price} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Rental/day (₹)</label>
                <input className="form-input shop" name="rentalPrice" type="number" min="0" placeholder="299" value={form.rentalPrice} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input className="form-input shop" name="stock" type="number" min="0" placeholder="5" value={form.stock} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="card-title" style={{ marginBottom: 16 }}>Sizes Available</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SIZES.map(s => (
                <button
                  key={s} type="button"
                  onClick={() => toggleSize(s)}
                  style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${form.sizes.includes(s) ? 'var(--accent-shop)' : 'var(--border-default)'}`,
                    background: form.sizes.includes(s) ? 'rgba(245,158,11,0.12)' : 'var(--bg-secondary)',
                    color: form.sizes.includes(s) ? 'var(--accent-shop)' : 'var(--text-secondary)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                style={{ width: 18, height: 18, accentColor: 'var(--accent-shop)' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Mark as Available</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Customers can see and order this product immediately</div>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-shop btn-lg" disabled={loading} style={{ flex: 1 }}>
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: 'currentColor', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Adding…
                </>
              ) : '+ Add Product'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/shop/products')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ShopAddProduct
