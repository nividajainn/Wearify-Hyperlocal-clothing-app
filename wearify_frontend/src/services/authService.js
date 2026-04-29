import api from './api'

// LOGIN
export const loginUser = async (credentials) => {
  // DEMO ADMIN BYPASS
  if (credentials.email === 'admin@wearify.com' && credentials.password === 'admin123') {
    return {
      token: 'demo-admin-token-12345',
      role: 'ADMIN',
      id: 999,
      name: 'System Admin',
      email: 'admin@wearify.com'
    }
  }

  const { data } = await api.post('/auth/login', credentials)
  // Backend returns { token: "...", user: { id, name, role, email... } }
  let frontendRole = data.user?.role || 'USER';
  if (frontendRole === 'CUSTOMER') frontendRole = 'USER'; // Map back to frontend expected role

  return {
    token: data.token,
    role: frontendRole,
    id: data.user?.id,
    name: data.user?.name,
    email: data.user?.email
  }
}

// REGISTER HELPER
const registerAccount = async (role, payload) => {
  const body = {
    name: payload.name || payload.ownerName,
    email: payload.email,
    password: payload.password,
    phone: payload.phone || '',
    address: payload.address || '',
    city: payload.city || '',
    pincode: payload.pincode || '',
    role: role,
  }

  const { data } = await api.post('/auth/register', body)
  return data
}

export const registerUser = (payload) => registerAccount('CUSTOMER', payload)
export const registerShop = (payload) => registerAccount('SHOP', payload)
export const registerDelivery = (payload) => registerAccount('DELIVERY', payload)