import { useState } from 'react'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import { useSelector } from "react-redux";
import ProfilePage from './pages/Profile'
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function Logout(){
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>
}


function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
  <BrowserRouter>
  <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>
      }/>
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage/>
        </ProtectedRoute>
      }/>
  <Route path='/login' element={isAuthenticated ? <Navigate to="/" /> : <Login />}/>
  <Route path='/logout' element={<Logout/>}/>

  <Route path='/register' element={<RegisterAndLogout/>}/>
  <Route path='*' element={<NotFound/>}/>
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />


  </Routes>
  </BrowserRouter>
  )
}

export default App
