import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { handleAuthCallback, onAuthChange, AUTH_EVENTS } from '@netlify/identity'
import { fetchProfile, logoutUser, currentIdentityUser } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const loadProfile = useCallback(async () => {
    try {
      const identityUser = await currentIdentityUser()
      if (!identityUser) { setProfile(null); return null }
      const p = await fetchProfile()
      setProfile(p)
      return p
    } catch {
      setProfile(null)
      return null
    }
  }, [])

  useEffect(() => {
    let active = true
    const init = async () => {
      try {
        const result = await handleAuthCallback()
        if (result?.type === 'confirmation') setNotice('Email confirmed. Welcome to Wearify!')
      } catch { /* no callback or invalid token */ }
      await loadProfile()
      if (active) setLoading(false)
    }
    init()
    const unsubscribe = onAuthChange((event) => {
      if (event === AUTH_EVENTS.LOGOUT) setProfile(null)
    })
    return () => { active = false; unsubscribe() }
  }, [loadProfile])

  const login = useCallback((p) => setProfile(p), [])

  const logout = useCallback(async () => {
    await logoutUser()
    setProfile(null)
  }, [])

  const value = {
    user: profile,
    role: profile?.role ?? null,
    isAuthenticated: Boolean(profile),
    loading,
    notice,
    clearNotice: () => setNotice(''),
    login,
    logout,
    refresh: loadProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
