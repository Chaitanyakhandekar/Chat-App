import { createContext } from "react";
import { useState } from "react";

export const authContext = createContext(null);

export const AuthProvider = ({children}) => {

    const [user,setUser] = useState(null)
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    const [currentChatUser,setCurrentChatUser] = useState(null)

    const login = (data)=>{
        setUser(data)
        setIsLoggedIn(true)
    }

    return (
        <authContext.Provider value={{user,setUser ,isLoggedIn , setIsLoggedIn,login , currentChatUser,setCurrentChatUser}}>
            {children}
        </authContext.Provider>
    )
}

