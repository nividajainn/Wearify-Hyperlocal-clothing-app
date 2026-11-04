import { login, signup, logout, getUser, AuthError, MissingIdentityError } from '@netlify/identity'
import api from './api'

export const fetchProfile = async () => {
  const { data } = await api.get('/me')
  return data
}

const authMessage = (err) => {
  if (err instanceof MissingIdentityError) return 'Sign-in is not enabled on this site yet.'
  if (err instanceof AuthError) {
    const msg = (err.message || '').toLowerCase()
    if (msg.includes('not confirmed')) return 'Please confirm your email first. Check your inbox for the link.'
    if (err.status === 401 || err.status === 400) return 'Invalid email or password.'
    if (err.status === 403) return 'Sign-ups are currently closed.'
    if (err.status === 422) return err.message || 'Please check your details.'
    return err.message
  }
  return err?.response?.data?.message || 'Something went wrong. Please try again.'
}

export const loginUser = async ({ email, password }) => {
  try {
    await login(email, password)
    return await fetchProfile()
  } catch (err) {
    throw new Error(authMessage(err))
  }
}

// role: USER | SHOP | DELIVERY
export const registerAccount = async (role, { name, email, password, phone, shopName }) => {
  try {
    const user = await signup(email, password, {
      full_name: name,
      phone: phone || '',
      signup_role: role,
      shop_name: shopName || '',
    })
    if (user.emailVerified || user.confirmedAt) {
      const profile = await fetchProfile()
      return { confirmed: true, profile }
    }
    return { confirmed: false }
  } catch (err) {
    throw new Error(authMessage(err))
  }
}

export const logoutUser = async () => {
  try { await logout() } catch { /* session already gone */ }
}

export const currentIdentityUser = () => getUser()
