import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Navbar from './Components/Navbar'
import SettingsPage from './Pages/SettingPage'
import ProfilePage from './Pages/ProfilePage'
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import UpdatePassword from './Pages/UpdatePassword'
import { useAuthStore } from './Store/useAuthStore'
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  if (isCheckingAuth && !authUser)
    return (<div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>)
  return (
    <div style={{ background: "url('/background-image.jfif')" }} className='min-h-screen '>

      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />}></Route>
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to='/' />}></Route>
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />}></Route>
        <Route path='/settings' element={<SettingsPage />}></Route>
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />}></Route>
        <Route path='/update-password' element={authUser ? <UpdatePassword /> : <Navigate to='/login' />}></Route>

      </Routes>
      <Toaster />

    </div >
  )
}

export default App