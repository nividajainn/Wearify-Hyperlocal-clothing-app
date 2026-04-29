import api from './api'

export const getAssignedOrders = async () => {
  const { data } = await api.get('/delivery/orders/assigned')
  return data
}

export const markPickup = async (id) => {
  const { data } = await api.put(`/delivery/orders/${id}/pickup`)
  return data
}

export const markOutForDelivery = async (id) => {
  const { data } = await api.put(`/delivery/orders/${id}/out-for-delivery`)
  return data
}

export const markDelivered = async (id) => {
  const { data } = await api.put(`/delivery/orders/${id}/delivered`)
  return data
}
