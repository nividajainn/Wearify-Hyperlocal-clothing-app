import React from 'react'

const LoadingSpinner = ({ text = 'Loading...', accent }) => {
  return (
    <div className="loading-container">
      <div
        className="spinner"
        style={accent ? { borderTopColor: accent } : undefined}
      />
      <p className="loading-text">{text}</p>
    </div>
  )
}

export default LoadingSpinner
