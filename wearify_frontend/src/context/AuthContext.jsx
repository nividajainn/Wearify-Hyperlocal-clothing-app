import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('wearify_token'))
  const [role, setRole] = useState(() => localStorage.getItem('wearify_role'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('wearify_user')
    try { return stored ? JSON.parse(stored) : null } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback((data) => {
    const { token: t, role: r, id, name } = data
    const userObj = { id, name }

    localStorage.setItem('wearify_token', t)
    localStorage.setItem('wearify_role', r)
    localStorage.setItem('wearify_user', JSON.stringify(userObj))

    setToken(t)
    setRole(r)
    setUser(userObj)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('wearify_token')
    localStorage.removeItem('wearify_role')
    localStorage.removeItem('wearify_user')
    setToken(null)
    setRole(null)
    setUser(null)
  }, [])

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
