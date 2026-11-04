import api from './api'

export const checkoutOrder = async (payload) => {
  const { data } = await api.post('/orders/checkout', payload)
  return data
}

export const getMyOrders = async () => {
  const { data } = await api.get('/orders/my')
  return data
}

export const cancelMyOrder = async (id) => {
  const { data } = await api.put(`/orders/${id}/cancel`)
  return data
}
