import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginUser } from '../../services/authService'
import { getRoleRedirect } from '../../utils/getRoleRedirect'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError('')
    try {
      const data = await loginUser(form)
      login(data)
      navigate(getRoleRedirect(data.role), { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="Wearify" className="auth-logo-icon" style={{ objectFit: 'contain' }} />
          <span className="auth-logo-name">Wearify</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {error && <div className="alert-strip alert-error">Error: {error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Signing in…
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </div>

        <div className="divider" style={{ marginTop: 24 }} />
        <button
          className="btn btn-outline btn-full"
          style={{ marginTop: 16, borderColor: 'var(--accent-admin)', color: 'var(--accent-admin)' }}
          onClick={(e) => {
            e.preventDefault();
            setForm({ email: 'admin@wearify.com', password: 'admin123' });
            setTimeout(() => {
              // Programmatically trigger submit after state updates
              document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }, 50);
          }}
        >
          Demo Admin Login
        </button>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16 }}>
          Admin accounts are provisioned by the system.<br />
          Shop & Delivery partners can self-register.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
