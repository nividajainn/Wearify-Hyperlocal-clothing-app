import React from 'react'

const EmptyState = ({ icon = '📭', title = 'Nothing here', text = '', action }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3 className="empty-state-title">{title}</h3>
    {text && <p className="empty-state-text">{text}</p>}
    {action}
  </div>
)

export default EmptyState
