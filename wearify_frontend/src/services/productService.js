import api from './api'

export const getAllProducts = async () => {
  const { data } = await api.get('/products')
  return data
}

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}
