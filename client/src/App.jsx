import React,{useEffect} from 'react'
import {io} from "socket.io-client"
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

function App() {

  const context = useContext(authContext);
  const setUser = userAuthStore().setUser

  const authMe = async ()=>{
    const user = await userApi.authMe();
    if(user.success){
      context.setUser(user.data)
      // console.log("User Set in Context : ",user.data);
      setUser(user.data)
      
    }
    // context.setUser
  }

  useEffect(()=>{
    authMe();
  },[])

  return (
   <Routes>

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