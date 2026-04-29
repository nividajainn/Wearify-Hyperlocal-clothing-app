import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkoutOrder } from '../../services/orderService'

const UserCheckout = () => {
  const [form, setForm] = useState({ address: '', city: '', pincode: '', phone: '', paymentMethod: 'COD' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.address || !form.city || !form.pincode || !form.phone) {
      setError('Please fill in all delivery details.')
      return
    }
    setLoading(true); setError('')
    try {
      await checkoutOrder(form)
      setSuccess(true)
      setTimeout(() => navigate('/user/orders'), 2500)
    } catch {
      setError('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 64 }}>🎉</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900 }}>Order Placed!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Your order has been successfully placed. Redirecting to orders…</p>
        <div className="spinner" style={{ borderTopColor: 'var(--accent-user)' }} />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Checkout</h1>
          <p className="page-header-subtitle">Complete your order</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="alert-strip alert-error">{error}</div>}

          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="card-title" style={{ marginBottom: 20 }}>Delivery Address</h3>
            <div className="form-group">
              <label className="form-label">Full Address</label>
              <input className="form-input user" name="address" placeholder="House no, Street, Locality" value={form.address} onChange={handleChange} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input user" name="city" placeholder="Mumbai" value={form.city} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">PIN Code</label>
                <input className="form-input user" name="pincode" placeholder="400001" value={form.pincode} onChange={handleChange} maxLength={6} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input user" name="phone" type="tel" placeholder="+91 99999 99999" value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 20 }}>Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'COD', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                { id: 'UPI', icon: '📱', label: 'UPI Payment', desc: 'Pay using any UPI app' },
                { id: 'CARD', icon: '💳', label: 'Credit / Debit Card', desc: 'All major cards accepted' },
              ].map(p => (
                <label
                  key={p.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    borderRadius: 'var(--radius-md)', border: `1.5px solid ${form.paymentMethod === p.id ? 'var(--accent-user)' : 'var(--border-default)'}`,
                    background: form.paymentMethod === p.id ? 'rgba(0,212,170,0.06)' : 'var(--bg-secondary)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <input type="radio" name="paymentMethod" value={p.id} checked={form.paymentMethod === p.id} onChange={handleChange} style={{ accentColor: 'var(--accent-user)' }} />
                  <span style={{ fontSize: 22 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-user btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: 20 }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: 'currentColor', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Placing Order…
              </>
            ) : '✓ Place Order'}
          </button>
        </form>

        <div className="card" style={{ position: 'sticky', top: 80 }}>
          <h3 className="card-title" style={{ marginBottom: 16 }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹398</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery</span><span>₹49</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Taxes</span><span>₹20</span></div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--accent-user)' }}>₹467</span>
            </div>
          </div>
          <div className="divider" />
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            🔒 Your payment info is secure and encrypted. By placing an order you agree to our Terms & Conditions.
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCheckout
