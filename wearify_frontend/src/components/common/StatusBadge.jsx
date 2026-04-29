import React from 'react'

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase().replace(/_/g, '-') || ''
  return (
    <span className={`badge badge-${normalized}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  )
}

export default StatusBadge
