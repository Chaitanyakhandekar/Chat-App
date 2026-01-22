import React from 'react'
import ChatCard from '../../components/user/ChatCard.jsx'
import { useEffect } from 'react'
import { userApi } from '../../api/user.api.js'
import { useContext } from 'react'
import { authContext } from '../../context/authContext.jsx'
import { io } from 'socket.io-client'
import {
    MessageCircle,
    Send

} from 'lucide-react'

function Home() {

    const [users,setUsers] = React.useState([])
    const context = useContext(authContext);
    const [message,setMessage] = React.useState("")
    const [messages,setMessages] = React.useState([])
    const socketRef = React.useRef(null);

    const getAllUsers = async ()=>{
        const response = await userApi.getAllUsers();
        if(response.success){
            setUsers(response.data);
            console.log("All users fetched:",response.data);
        }
    }

    
    const handleSend = ()=>{
        console.log("Send button clicked");
        if(message.trim()===""){
            return;
        }
        if(!socketRef.current)return
        socketRef.current.emit("message",{
            message:message,
            to:context.currentChatUser._id
        })
        setMessages((prevMessages)=>[...prevMessages,{
            from:context.user._id,  
            message:message
        }])
        setMessage("")
    }

    useEffect(()=>{
        
        getAllUsers();
        console.log("Current logged in user:",context.user);

      

    },[])

    useEffect(()=>{
        socketRef.current = io("http://localhost:3000",
            {
                withCredentials:true
            }
        ); // connect to socket server

        socketRef.current.on("connect",()=>{
            console.log("Connected to socket server with id:",socketRef.current.id);
        })

        socketRef.current.on("message",(data)=>{
            console.log("Message received from server:",data);
            setMessages((prevMessages)=>[...prevMessages,data]);
        });

        return ()=>{
            if(socketRef.current){
                socketRef.current.disconnect();
                socketRef.current.off("message")
                socketRef.current = null;
            }
        }
    },[])

    useEffect(()=>{
        console.log("Current logged in user:",context.currentChatUser);
    },[context.currentChatUser])

  return (
   <div className="w-screen border-1 min-h-screen h-screen flex">

    <div className="chat-users w-1/4 h-full border flex flex-col  items-center bg-gray-100">
        <input type="text" placeholder="Search users..." className='w-[90%] mt-3 p-3 border border-gray-300 rounded-md outline-none text-gray-500 font-semibold' />

        <div className="users w-full mt-4">
         {
            users?.map((user)=>(
                <ChatCard key={user._id} user={user} />
            ))
         }
           
        </div>
    </div>

    <div className="chat-window w-3/4 h-full border-1 border-blue-500 bg-white relative">
        {context.currentChatUser ? (
            <div className="w-full h-full flex flex-col items-center justify-center border-1" >
                <nav className="w-full h-16 border-b flex items-center justify-start px-4 absolute top-0 bg-white z-10 gap-10 ">
                    <div className="w-10 h-10 rounded-full ml-10">
                        <img src={context.currentChatUser.avtar} alt="" className='w-full h-full rounded-[50%]' />
                    </div>
                    <h2 className="font-bold text-xl ml-4">{context.currentChatUser.username}</h2>
                </nav>

                <div className="h-full border-1 border-blue-400 w-full relative ">

                   {messages.length && messages?.map((msg,index)=>{
                    return(
                         context.currentChatUser._id === msg.from || msg.from === context.user._id && (
                            <div key={index} className="ml-10 mt-10  max-w-[70%] h-auto  text-center mt-20 bg-green-400 text-black p-3 rounded-md">{msg.message}</div>
                         )
                            
                    )
                   })}

                </div>

                <footer className="w-full h-20 border-t absolute bottom-0 bg-white z-10 flex items-center">
                    <div className="w-5/6 h-20 border-t flex items-center px-4 absolute bottom-0 bg-white z-10">
                        <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Type a message..." className='w-full h-14 border border-gray-300 rounded-md pl-4 outline-none ' />
                    </div>
                    <div
                    onClick={handleSend}
                    className="absolute right-20 bg-blue-500 cursor-pointer flex items-center justify-center w-12 h-12 border-1 rounded-md">
                        <Send className='w-9 h-9 text-white' />
                    </div>

                </footer>
            </div>
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Select a user to start chatting</h1>
                <p className="text-gray-500 mt-2">Choose a user from the list on the left to begin messaging.</p>
            </div>
        )
        }
    </div>

   </div>
  )
}

export default Home