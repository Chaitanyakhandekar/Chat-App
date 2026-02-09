import { socket } from "./socket";
import { useChatStore } from "../store/useChatStore";
import { socketEvents } from "../constants/socketEvents";
<<<<<<< HEAD
<<<<<<< HEAD
import { userAuthStore } from "../store/userStore";

export const initializeSocketListeners = () =>{

    

<<<<<<< HEAD
=======

const {
   
    addMessage} = useChatStore.getState();
=======
import { userAuthStore } from "../store/userStore";
>>>>>>> 4e93c6e (just fixed the shittiest bug i faced yet... cant even call that a bug.)

export const initializeSocketListeners = () =>{
>>>>>>> 9a51b3a (1 participant is null at the time of chat creation and chat is creating every time)
=======
>>>>>>> f59a17a (typing event started)
    socket.on(socketEvents.CONNECT,()=>{
        console.log("Connected to socket server");
    });

    socket.on(socketEvents.DISCONNECT,()=>{
        console.log("Disconnected from socket server");
    });

    socket.on(socketEvents.NEW_MESSAGE,(data)=>{
        console.log("New Message Received from socket server:",data);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4e93c6e (just fixed the shittiest bug i faced yet... cant even call that a bug.)
        const { addMessage } = useChatStore.getState();
        if (data.sender !== userAuthStore.getState().user._id) {
            addMessage(data?.chatId,data)
        }
<<<<<<< HEAD
    })

    socket.on(socketEvents.TYPING,(data)=>{
        console.log("Typing event received from socket server:",data);
        // const {chatUsersInfo,setTypingStatus} = useChatStore()
        // setTypingStatus(data.chatId,data.isTyping)
    })

    socket.on(socketEvents.USER_ONLINE,(data)=>{

=======
        addMessage(data?.chatId,data)
>>>>>>> 9a51b3a (1 participant is null at the time of chat creation and chat is creating every time)
=======
>>>>>>> 4e93c6e (just fixed the shittiest bug i faced yet... cant even call that a bug.)
    })

    socket.on(socketEvents.TYPING,(data)=>{
        console.log("Typing event received from socket server:",data);
        // const {chatUsersInfo,setTypingStatus} = useChatStore()
        // setTypingStatus(data.chatId,data.isTyping)
    })

    socket.on(socketEvents.USER_ONLINE,(data)=>{

    })
}