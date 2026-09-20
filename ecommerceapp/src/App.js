import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './Components/Signup';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import Companysignup from './Components/Companysignup';
import Addproduct from './Components/Addproduct';
import Viewproduct from './Components/Viewproduct';
import SingleProduct from './Components/SingleProduct';
import Home from './Components/Home';
import Order from './Components/Order';
import Cart from './Components/Cart';
import OrderSummary from './Components/OrderSummary';
import Vieworders from './Components/Vieworders';
import SellerDashboard from './Components/SellerDashboard';
import AdminDashboard from './Components/AdminDashboard';
import Wishlist from './Components/Wishlist';
import Payment from './Components/Payment';
import OrderSuccess from './Components/OrderSuccess';
import Profile from './Components/Profile';
import ProtectedRoute from './Components/ProtectedRoute';
import ROLES from './utils/roles';

function App() {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/companysignup' element={<Companysignup />} />
          <Route path='/viewproduct' element={<Viewproduct />} />
          <Route path='/product/:id' element={<SingleProduct />} />
          <Route path='/viewone/:id' element={<SingleProduct />} />

          {/* Shared Authenticated Profile Route */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.COMPANY, ROLES.ADMIN, 'seller', 'company']}>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* Shopping & Order Protected Routes (Accessible by both Users and Sellers) */}
          <Route
            path='/cart'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.COMPANY, ROLES.ADMIN, 'seller', 'company']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path='/order'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.COMPANY, ROLES.ADMIN, 'seller', 'company']}>
                <Order />
              </ProtectedRoute>
            }
          />
          <Route
            path='/ordersummary'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.COMPANY, ROLES.ADMIN, 'seller', 'company']}>
                <OrderSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path='/payment'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.COMPANY, ROLES.ADMIN, 'seller', 'company']}>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path='/ordersuccess'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.COMPANY, ROLES.ADMIN, 'seller', 'company']}>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path='/wishlist'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.COMPANY, ROLES.ADMIN, 'seller', 'company']}>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path='/admindashboard'
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Vendor / Company Protected Routes */}
          <Route
            path='/sellerdashboard'
            element={
              <ProtectedRoute allowedRoles={[ROLES.COMPANY, ROLES.ADMIN, 'seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/addproduct'
            element={
              <ProtectedRoute allowedRoles={[ROLES.COMPANY, ROLES.ADMIN, 'seller']}>
                <Addproduct />
              </ProtectedRoute>
            }
          />

          {/* Shared Authenticated Routes */}
          <Route
            path='/vieworders'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.COMPANY, ROLES.ADMIN]}>
                <Vieworders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
