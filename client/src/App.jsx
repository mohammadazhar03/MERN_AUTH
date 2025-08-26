import React from 'react'
import {Router, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import EmailVerify from './pages/EmailVerify.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import { ToastContainer} from 'react-toastify';
function App() {
  return (
    <div>
          <ToastContainer/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/verify-email' element={<EmailVerify/>}/>
          <Route path='/reset-password' element={<ResetPassword/>}/>
        </Routes>
    </div>
  )
}

export default App
