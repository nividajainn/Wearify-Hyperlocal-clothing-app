import api from './api'

export const getShopProducts = async () => {
  const { data } = await api.get('/shop/products')
  return data
}

export const addShopProduct = async (payload) => {
  const { data } = await api.post('/shop/products', payload)
  return data
}

export const updateShopProduct = async (id, payload) => {
  const { data } = await api.put(`/shop/products/${id}`, payload)
  return data
}

export const deleteShopProduct = async (id) => {
  const { data } = await api.delete(`/shop/products/${id}`)
  return data
}

export const getShopOrders = async () => {
  const { data } = await api.get('/shop/orders')
  return data
}

export const getMyShop = async () => {
  const { data } = await api.get('/shop/me')
  return data
}

// action: accept | dispatch | cancel
export const updateShopOrder = async (id, action) => {
  const { data } = await api.put(`/shop/orders/${id}/${action}`)
  return data
}
