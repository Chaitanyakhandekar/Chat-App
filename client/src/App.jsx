import React from 'react'
import {io} from "socket.io-client"
import {Routes,Route} from "react-router-dom"
import Register from './pages/auth/Register.jsx'
import Login from './pages/auth/Login.jsx'
import Home from './pages/user/Home.jsx'

function App() {

  // const socket = io("http://localhost:3000")  // connect to socket server


  // socket.on("welcome",(msg)=>{
  //   document.querySelector("#box").innerHTML = msg
  // })

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