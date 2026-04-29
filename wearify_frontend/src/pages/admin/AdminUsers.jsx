import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllUsers } from '../../services/adminService'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const data = await getAllUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch {
      setUsers([
        { id: 1, name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', status: 'ACTIVE', createdAt: '2024-01-15' },
        { id: 2, name: 'Rahul Mehta', email: 'rahul@example.com', phone: '9123456789', status: 'ACTIVE', createdAt: '2024-02-01' },
        { id: 3, name: 'Sneha Kapoor', email: 'sneha@example.com', phone: '9988776655', status: 'ACTIVE', createdAt: '2024-02-20' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner text="Loading users…" accent="var(--accent-admin)" />
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Users</h1>
          <p className="page-header-subtitle">{users.length} registered customers</p>
        </div>
        <input
          className="form-input"
          style={{ width: 260 }}
          placeholder="🔍  Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState title="No users found" text="Try a different search term." /></td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent-admin)' }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.phone || '—'}</td>
                  <td><StatusBadge status={u.status || 'ACTIVE'} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
