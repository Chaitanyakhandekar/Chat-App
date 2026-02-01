import React from 'react'
import { userApi } from '../../api/user.api'
import { useContext } from 'react'
import {authContext} from '../../context/authContext.jsx'
import { useNavigate } from 'react-router-dom'
import { userAuthStore } from '../../store/userStore.js'

function Login() {

    const [user,setUser] = React.useState({
      
        email:"",
        password:""
    })
    const user1 = userAuthStore().user
    const setUser1 = userAuthStore().setUser
    const authData = useContext(authContext);
    const navigate = useNavigate()

    const handleUserChange = (e)=>{
        setUser((prev)=>(
           {
             ...prev,
            [e.target.name]:e.target.value
           }
        ))
    }

    const login = async (e)=>{
        e.preventDefault();
        console.log("Logging in user:",user);
        const response = await userApi.loginUser(user);
        if(response.success){
            authData.login(response.data);
            setUser1(response.data)
            // authData.setIsLoggedIn(true);
            // authData.setUser(response.data);
            console.log("User set in context:",response.data);
            navigate('/home')
        }
        console.log("Login response:",response);
    }

  return (
    <div className="border-2 w-full md:w-1/3 flex flex-col items-center md:mx-auto mt-20">
        <h1 className="text-2xl font-bold">Chat App</h1>

        <div className="w-full mt-4 flex flex-col gap-5 px-4 pb-4 ">
            <input className="border-2 pl-4 rounded-md py-2" type="email" placeholder="Enter your email" name="email" value={user.email} onChange={handleUserChange}/>
            <input className="border-2 pl-4 rounded-md py-2" type="password" placeholder="Enter your password" name="password" value={user.password} onChange={handleUserChange}/>
            <button className="bg-blue-500 text-white w-full py-2 mt-4 rounded-md" onClick={login}>Login</button>
        </div>
    </div>
  )
}

export default Login