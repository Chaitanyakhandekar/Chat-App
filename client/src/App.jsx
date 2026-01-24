import React,{useEffect} from 'react'
import {io} from "socket.io-client"
import {Routes,Route} from "react-router-dom"
import Register from './pages/auth/Register.jsx'
import Login from './pages/auth/Login.jsx'
import Home from './pages/user/Home.jsx'
import { useContext } from 'react'
import { authContext } from './context/authContext.jsx'
import { userApi } from './api/user.api.js'

function App() {

  const context = useContext(authContext);

  const authMe = async ()=>{
    const user = await userApi.authMe();
    if(user.success){
      context.setUser(user.data)
    }
    // context.setUser
  }

  useEffect(()=>{
    authMe();
  },[])

  return (
   <Routes>

    <Route path='/' element={<h1>Hello World</h1>}/>
    <Route path='/register' element={<Register />}/>
    <Route path='/login' element={<Login />}/>
    <Route path='/home' element={<Home />}/>

   </Routes>
  )
}

export default App