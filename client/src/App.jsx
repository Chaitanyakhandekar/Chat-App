import React,{useEffect, useState} from 'react'
import {Routes,Route} from "react-router-dom"
import Register from './pages/auth/Register.jsx'
import Login from './pages/auth/Login.jsx'
import Home from './pages/user/Home.jsx'
import { useContext } from 'react'
import { authContext } from './context/AuthProvider.jsx'
import { userApi } from './api/user.api.js'
import { userAuthStore } from './store/userStore.js'
import ProtectedRoute from './components/guards/ProtectedRoute.jsx'
import ProtectedRouteAuth from './components/guards/ProtectedRouteAuth.jsx'
import Chat from "./pages/user/Chat.jsx"
import GroupInfo from './components/user/GroupInfo.jsx'
import GroupInfoMain from './pages/user/GroupInfoMain.jsx'
import { socket } from './socket/socket.js'

function App() {

  const context = useContext(authContext);
  const { setUser, logout } = userAuthStore()
  const [authLoading, setAuthLoading] = useState(true)

  const authMe = async ()=>{
    try {
      const response = await userApi.authMe();
      if(response.success){
        context.setUser(response.data)
        setUser(response.data)
      } else {
        logout()
        context.setUser(null)
      }
    } catch (error) {
      logout()
      context.setUser(null)
    } finally {
      setAuthLoading(false)
    }
  }
  const beep = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 200);
};


  useEffect(()=>{
    authMe();
  },[])

  useEffect(()=>{
    if(!authLoading && userAuthStore.getState().user){
      if (!socket.connected) {
        socket.connect();
      }
    }
  },[authLoading])

  if (authLoading) return null

  return (
    <Routes>
    
    <Route path='/beep' element={ <button onClick={beep}>Beep</button>}/>
    <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>}/>
    <Route path='/register' element={<ProtectedRouteAuth><Register /></ProtectedRouteAuth>}/>
    <Route path='/login' element={<ProtectedRouteAuth><Login /></ProtectedRouteAuth>}/>
    <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>}/>
    <Route path='/chat/:id' element={<ProtectedRoute><Chat /></ProtectedRoute>}/>
    <Route path='/chat/group-info/:id' element={<ProtectedRoute><GroupInfoMain /></ProtectedRoute>}/>

   </Routes>
  )
}

export default App