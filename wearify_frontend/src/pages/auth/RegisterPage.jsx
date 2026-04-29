import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, registerShop, registerDelivery } from '../../services/authService'

const ROLES = [
  { id: 'USER', icon: 'C', label: 'Customer', className: 'user', desc: 'Browse & rent clothes' },
  { id: 'SHOP', icon: 'S', label: 'Shop Owner', className: 'shop', desc: 'List & sell clothes' },
  { id: 'DELIVERY', icon: 'D', label: 'Delivery', className: 'delivery', desc: 'Deliver orders' },
]

const RegisterPage = () => {
  const [role, setRole] = useState('USER')
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Name, email, and password are required.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true); setError(''); setSuccess('')
    try {
      const payload = { ...form }
      if (role === 'USER') await registerUser(payload)
      else if (role === 'SHOP') await registerShop(payload)
      else await registerDelivery(payload)

      setSuccess(
        role === 'SHOP'
          ? 'Registration submitted! Your shop account is pending admin approval.'
          : 'Account created successfully! Please sign in.'
      )
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <img src="/logo.png" alt="Wearify" className="auth-logo-icon" style={{ objectFit: 'contain' }} />
          <span className="auth-logo-name">Wearify</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Choose your role to get started</p>

        {/* Role Selector */}
        <div className="role-selector">
          {ROLES.map(r => (
            <div
              key={r.id}
              className={`role-option ${r.className}${role === r.id ? ' selected' : ''}`}
              onClick={() => { setRole(r.id); setError('') }}
            >
              <span className="role-option-icon">{r.icon}</span>
              <span className="role-option-label">{r.label}</span>
            </div>
          ))}
        </div>

        {error && <div className="alert-strip alert-error">Error: {error}</div>}
        {success && <div className="alert-strip alert-success">Success: {success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className={`form-input ${ROLES.find(r => r.id === role)?.className}`}
              name="name" type="text" placeholder="Your full name"
              value={form.name} onChange={handleChange} autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className={`form-input ${ROLES.find(r => r.id === role)?.className}`}
              name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
            <input
              className={`form-input ${ROLES.find(r => r.id === role)?.className}`}
              name="phone" type="tel" placeholder="+91 99999 99999"
              value={form.phone} onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={`form-input ${ROLES.find(r => r.id === role)?.className}`}
              name="password" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange} autoComplete="new-password"
            />
          </div>

          {role === 'SHOP' && (
            <div className="alert-strip alert-warning" style={{ marginBottom: 16 }}>
              Note: Shop accounts require admin approval before activation.
            </div>
          )}

          <button
            className={`btn btn-full btn-lg ${role === 'USER' ? 'btn-user' : role === 'SHOP' ? 'btn-shop' : 'btn-delivery'}`}
            type="submit"
            disabled={loading || Boolean(success)}
            style={{ marginTop: 4 }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: 'currentColor', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Creating account…
              </>
            ) : `Register as ${ROLES.find(r => r.id === role)?.label}`}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
