import React from 'react'
import { userApi } from '../../api/user.api'

function Register() {

    const [user,setUser] = React.useState({
        name:"",
        username:"",
        email:"",
        password:""
    })

    const handleUserChange = (e)=>{
        setUser((prev)=>(
           {
             ...prev,
            [e.target.name]:e.target.value
           }
        ))
    }

    const register = async (e)=>{
        e.preventDefault();
        console.log("Registering user:",user);
        const response = await userApi.registerUser(user);
        console.log("Registration response:",response);
    }

  return (
    <div className="border-2 w-full md:w-1/3 flex flex-col items-center md:mx-auto mt-20">
        <h1 className="text-2xl font-bold">Chat App</h1>

        <div className="w-full mt-4 flex flex-col gap-5 px-4 pb-4 ">
            <input className="border-2 pl-4 rounded-md py-2" type="text" placeholder="Enter your name" name="name" value={user.name} onChange={handleUserChange}/>
            <input className="border-2 pl-4 rounded-md py-2" type="text" placeholder="Enter your username" name="username" value={user.username} onChange={handleUserChange}/>
            <input className="border-2 pl-4 rounded-md py-2" type="email" placeholder="Enter your email" name="email" value={user.email} onChange={handleUserChange}/>
            <input className="border-2 pl-4 rounded-md py-2" type="password" placeholder="Enter your password" name="password" value={user.password} onChange={handleUserChange}/>
            <button className="bg-blue-500 text-white w-full py-2 mt-4 rounded-md" onClick={register}>Register</button>
        </div>
    </div>
  )
}

export default Register