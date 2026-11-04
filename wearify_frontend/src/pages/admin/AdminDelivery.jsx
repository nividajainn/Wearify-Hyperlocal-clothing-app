import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllDeliveryAgents } from '../../services/adminService'
import { errorMessage } from '../../services/api'

const AdminDelivery = () => {
  const [agents, setAgents] = useState([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDeliveryAgents()
        setAgents(Array.isArray(data) ? data : [])
      } catch (err) {
        setLoadError(errorMessage(err, 'Could not load data.'))
        setAgents([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSpinner text="Loading agents…" accent="var(--accent-admin)" />

  return (
    <div>
      {loadError && <div className="alert-strip alert-error">{loadError}</div>}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Delivery Agents</h1>
          <p className="page-header-subtitle">{agents.length} registered delivery partners</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Agent</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Deliveries</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon="🛵" title="No delivery agents" /></td></tr>
              ) : agents.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--accent-delivery)' }}>
                        {a.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{a.email}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{a.phone || '—'}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-user)' }}>
                      {a.deliveredCount ?? 0}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>delivered</span>
                  </td>
                  <td><StatusBadge status={a.status || 'ACTIVE'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDelivery
