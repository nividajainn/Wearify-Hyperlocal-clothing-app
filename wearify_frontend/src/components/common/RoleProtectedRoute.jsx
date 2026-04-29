import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getRoleRedirect } from '../../utils/getRoleRedirect'

const RoleProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role !== allowedRole) return <Navigate to={getRoleRedirect(role)} replace />

  return children
}

export default RoleProtectedRoute
