import { socket } from "./socket";
import { useChatStore } from "../store/useChatStore";
import { socketEvents } from "../constants/socketEvents";
import { userAuthStore } from "../store/userStore";

export const initializeSocketListeners = () =>{


export const initializeSocketListeners = () =>{

    socket.on(socketEvents.CONNECT,()=>{
        console.log("Connected to socket server");
    });

    socket.on(socketEvents.DISCONNECT,()=>{
        console.log("Disconnected from socket server");
    });

    socket.on(socketEvents.NEW_MESSAGE,(data)=>{
        console.log("New Message Received from socket server:",data);

        const { addMessage } = useChatStore.getState();
        if (data.sender !== userAuthStore.getState().user._id) {
            addMessage(data?.chatId,data)
        }
    })

    socket.on(socketEvents.TYPING,(data)=>{
        console.log("Typing event received from socket server:",data);
        // const {chatUsersInfo,setTypingStatus} = useChatStore()
        // setTypingStatus(data.chatId,data.isTyping)
    })

    socket.on(socketEvents.USER_ONLINE,(data)=>{


    })

    socket.on(socketEvents.TYPING,(data)=>{
        console.log("Typing event received from socket server:",data);
        const { setTypingStatus } = useChatStore.getState();
        setTypingStatus(data.chatId,data.isTyping)
    })

    socket.on(socketEvents.USER_ONLINE,(data)=>{

    })
}