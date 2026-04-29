import api from './api'

export const getAdminDashboard = async () => {
  const { data } = await api.get('/admin/dashboard')
  return data
}

export const getAllUsers = async () => {
  const { data } = await api.get('/admin/users')
  return data
}

export const getAllShops = async () => {
  const { data } = await api.get('/admin/shops')
  return data
}

export const getPendingShops = async () => {
  const { data } = await api.get('/admin/shops/pending')
  return data
}

export const approveShop = async (id) => {
  const { data } = await api.put(`/admin/shops/${id}/approve`)
  return data
}

export const rejectShop = async (id) => {
  const { data } = await api.put(`/admin/shops/${id}/reject`)
  return data
}

export const getAllDeliveryAgents = async () => {
  const { data } = await api.get('/admin/delivery')
  return data
}

export const getAllOrders = async () => {
  const { data } = await api.get('/admin/orders')
  return data
}
