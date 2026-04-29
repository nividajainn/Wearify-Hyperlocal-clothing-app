import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getMyCart, updateCartItem, removeCartItem } from '../../services/cartService'

const UserCart = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const navigate = useNavigate()

  const fetchCart = async () => {
    setLoading(true)
    try {
      const data = await getMyCart()
      setCartItems(Array.isArray(data) ? data : (data?.items ?? []))
    } catch {
      setCartItems([
        { id: 1, productId: 1, productName: 'Floral Summer Dress', shopName: 'Trendy Threads', price: 99, quantity: 1, size: 'M' },
        { id: 2, productId: 2, productName: 'Classic Formal Blazer', shopName: 'Style Hub', price: 299, quantity: 1, size: 'L' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCart() }, [])

  const handleQtyChange = async (item, delta) => {
    const newQty = item.quantity + delta
    if (newQty < 1) return
    setUpdating(item.id)
    try {
      await updateCartItem({ cartItemId: item.id, quantity: newQty })
      setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i))
    } catch {
      // optimistic fallback
      setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i))
    } finally {
      setUpdating(null)
    }
  }

  const handleRemove = async (itemId) => {
    setUpdating(itemId)
    try {
      await removeCartItem(itemId)
    } catch { /* allow offline remove */ }
    setCartItems(prev => prev.filter(i => i.id !== itemId))
    setUpdating(null)
  }

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const delivery = subtotal > 0 ? 49 : 0
  const total = subtotal + delivery

  if (loading) return <LoadingSpinner text="Loading cart…" accent="var(--accent-user)" />

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
      {/* Cart Items */}
      <div>
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-header-title">My Cart</h1>
            <p className="page-header-subtitle">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="🛒"
              title="Your cart is empty"
              text="Browse our collection and add items you love."
              action={<button className="btn btn-user" onClick={() => navigate('/user/products')}>Browse Products</button>}
            />
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">👗</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.productName}</div>
                  <div className="cart-item-price">
                    🏪 {item.shopName}
                    {item.size && <span style={{ marginLeft: 8 }} className="tag">Size: {item.size}</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--accent-user)', marginTop: 6 }}>
                    ₹{item.price}/day
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <div className="qty-control" style={{ opacity: updating === item.id ? 0.5 : 1 }}>
                    <button className="qty-btn" onClick={() => handleQtyChange(item, -1)} disabled={updating === item.id}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => handleQtyChange(item, 1)} disabled={updating === item.id}>+</button>
                  </div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemove(item.id)}
                    disabled={updating === item.id}
                  >🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Summary */}
      {cartItems.length > 0 && (
        <div className="card" style={{ position: 'sticky', top: 80 }}>
          <h3 className="card-title" style={{ marginBottom: 20 }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
              <span>Delivery Fee</span>
              <span>₹{delivery}</span>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--accent-user)' }}>
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <button
            className="btn btn-user btn-full btn-lg"
            style={{ marginTop: 20 }}
            onClick={() => navigate('/user/checkout')}
          >
            Proceed to Checkout →
          </button>
          <button className="btn btn-ghost btn-full btn-sm" style={{ marginTop: 8 }} onClick={() => navigate('/user/products')}>
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  )
}

export default UserCart
