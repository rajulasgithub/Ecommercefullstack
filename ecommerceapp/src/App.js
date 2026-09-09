import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Companysignup from './Components/Companysignup';
import Addproduct from './Components/Addproduct';
import Viewproduct from './Components/Viewproduct';
import Home from './Components/Home';
import Order from './Components/Order';
import Cart from './Components/Cart';
import OrderSummary from './Components/OrderSummary';
import Vieworders from './Components/Vieworders';
import Payment from './Components/Payment';
import ProtectedRoute from './Components/ProtectedRoute';
import ROLES from './utils/roles';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/companysignup' element={<Companysignup />} />
          <Route path='/viewproduct' element={<Viewproduct />} />

          {/* Customer (User) Protected Routes */}
          <Route
            path='/cart'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path='/order'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER]}>
                <Order />
              </ProtectedRoute>
            }
          />
          <Route
            path='/ordersummary'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER]}>
                <OrderSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path='/payment'
            element={
              <ProtectedRoute allowedRoles={[ROLES.USER]}>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* Vendor / Company Protected Routes */}
          <Route
            path='/addproduct'
            element={
              <ProtectedRoute allowedRoles={[ROLES.COMPANY, ROLES.ADMIN]}>
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
