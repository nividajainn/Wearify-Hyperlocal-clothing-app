import axios from 'axios'

// Same-origin Netlify Function. The Identity session cookie (nf_jwt) is sent automatically.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 15000,
})

// Turn server errors into readable messages for the UI
export const errorMessage = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || err?.message || fallback

export default api
