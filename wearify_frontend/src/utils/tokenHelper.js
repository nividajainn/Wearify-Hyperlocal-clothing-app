export const getToken = () => localStorage.getItem('wearify_token')
export const getRole = () => localStorage.getItem('wearify_role')
export const getUser = () => {
  try {
    const u = localStorage.getItem('wearify_user')
    return u ? JSON.parse(u) : null
  } catch {
    return null
  }
}
export const clearAuth = () => {
  localStorage.removeItem('wearify_token')
  localStorage.removeItem('wearify_role')
  localStorage.removeItem('wearify_user')
}
