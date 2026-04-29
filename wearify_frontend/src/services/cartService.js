import api from './api'

export const addToCart = async (payload) => {
  const { data } = await api.post('/cart/add', payload)
  return data
}

export const getMyCart = async () => {
  const { data } = await api.get('/cart/my')
  return data
}

export const updateCartItem = async (payload) => {
  const { data } = await api.put('/cart/update', payload)
  return data
}

export const removeCartItem = async (id) => {
  const { data } = await api.delete(`/cart/${id}`)
  return data
}
