import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { getShopProducts, deleteShopProduct } from '../../services/shopService'

const ShopProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [msg, setMsg] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await getShopProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setProducts([
        { id: 1, name: 'Floral Summer Dress', category: 'Dresses', price: 299, rentalPrice: 99, available: true, stock: 3 },
        { id: 2, name: 'Classic Formal Blazer', category: 'Formals', price: 1200, rentalPrice: 299, available: true, stock: 2 },
        { id: 3, name: 'Denim Jacket', category: 'Jackets', price: 899, rentalPrice: 199, available: false, stock: 0 },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    setDeletingId(id)
    try {
      await deleteShopProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      setMsg('Product deleted.')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg('Failed to delete. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <LoadingSpinner text="Loading products…" accent="var(--accent-shop)" />

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">My Products</h1>
          <p className="page-header-subtitle">{products.length} items in your inventory</p>
        </div>
        <Link to="/shop/add-product" className="btn btn-shop">+ Add Product</Link>
      </div>

      {msg && <div className={`alert-strip ${msg.startsWith('Failed') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

      {products.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="👔"
            title="No products yet"
            text="Start by adding your first product to attract customers."
            action={<Link to="/shop/add-product" className="btn btn-shop">+ Add First Product</Link>}
          />
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Buy Price</th>
                  <th>Rental/day</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>👗</span>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td><span className="tag">{p.category || '—'}</span></td>
                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>₹{p.price}</td>
                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-user)' }}>₹{p.rentalPrice ?? '—'}</td>
                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{p.stock ?? '—'}</td>
                    <td>
                      <span className={`badge ${p.available ? 'badge-approved' : 'badge-pending'}`}>
                        {p.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                        >
                          {deletingId === p.id ? '…' : '🗑'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopProducts
