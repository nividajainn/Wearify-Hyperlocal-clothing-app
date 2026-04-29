export const getRoleRedirect = (role) => {
  switch (role) {
    case 'ADMIN':    return '/admin/dashboard'
    case 'USER':     return '/user/home'
    case 'SHOP':     return '/shop/dashboard'
    case 'DELIVERY': return '/delivery/dashboard'
    default:         return '/login'
  }
}
