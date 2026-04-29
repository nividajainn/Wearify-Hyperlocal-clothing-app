import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getRoleRedirect } from '../utils/getRoleRedirect'

// Guards
import ProtectedRoute from '../components/common/ProtectedRoute'
import RoleProtectedRoute from '../components/common/RoleProtectedRoute'

// Layouts
import AdminLayout from '../layouts/AdminLayout'
import UserLayout from '../layouts/UserLayout'
import ShopLayout from '../layouts/ShopLayout'
import DeliveryLayout from '../layouts/DeliveryLayout'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminShops from '../pages/admin/AdminShops'
import AdminDelivery from '../pages/admin/AdminDelivery'
import AdminOrders from '../pages/admin/AdminOrders'

// User Pages
import UserHome from '../pages/user/UserHome'
import UserProducts from '../pages/user/UserProducts'
import UserProductDetail from '../pages/user/UserProductDetail'
import UserCart from '../pages/user/UserCart'
import UserCheckout from '../pages/user/UserCheckout'
import UserOrders from '../pages/user/UserOrders'

// Shop Pages
import ShopDashboard from '../pages/shop/ShopDashboard'
import ShopProducts from '../pages/shop/ShopProducts'
import ShopAddProduct from '../pages/shop/ShopAddProduct'
import ShopOrders from '../pages/shop/ShopOrders'

// Delivery Pages
import DeliveryDashboard from '../pages/delivery/DeliveryDashboard'
import DeliveryAssigned from '../pages/delivery/DeliveryAssigned'
import DeliveryHistory from '../pages/delivery/DeliveryHistory'

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth()

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to={getRoleRedirect(role)} replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getRoleRedirect(role)} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to={getRoleRedirect(role)} replace /> : <RegisterPage />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="delivery" element={<AdminDelivery />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* User Routes */}
      <Route
        path="/user"
        element={
          <RoleProtectedRoute allowedRole="USER">
            <UserLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/user/home" replace />} />
        <Route path="home" element={<UserHome />} />
        <Route path="products" element={<UserProducts />} />
        <Route path="products/:id" element={<UserProductDetail />} />
        <Route path="cart" element={<UserCart />} />
        <Route path="checkout" element={<UserCheckout />} />
        <Route path="orders" element={<UserOrders />} />
      </Route>

      {/* Shop Routes */}
      <Route
        path="/shop"
        element={
          <RoleProtectedRoute allowedRole="SHOP">
            <ShopLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/shop/dashboard" replace />} />
        <Route path="dashboard" element={<ShopDashboard />} />
        <Route path="products" element={<ShopProducts />} />
        <Route path="add-product" element={<ShopAddProduct />} />
        <Route path="orders" element={<ShopOrders />} />
      </Route>

      {/* Delivery Routes */}
      <Route
        path="/delivery"
        element={
          <RoleProtectedRoute allowedRole="DELIVERY">
            <DeliveryLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/delivery/dashboard" replace />} />
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="assigned-orders" element={<DeliveryAssigned />} />
        <Route path="history" element={<DeliveryHistory />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
