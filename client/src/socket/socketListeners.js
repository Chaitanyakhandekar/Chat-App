import { socket } from "./socket";
import { useChatStore } from "../store/useChatStore";
import { socketEvents } from "../constants/socketEvents";
<<<<<<< HEAD
import { userAuthStore } from "../store/userStore";

export const initializeSocketListeners = () =>{

    

=======

const {
   
    addMessage} = useChatStore.getState();

export const initializeSocketListeners = () =>{
>>>>>>> 9a51b3a (1 participant is null at the time of chat creation and chat is creating every time)
    socket.on(socketEvents.CONNECT,()=>{
        console.log("Connected to socket server");
    });

    socket.on(socketEvents.DISCONNECT,()=>{
        console.log("Disconnected from socket server");
    });

    socket.on(socketEvents.NEW_MESSAGE,(data)=>{
        console.log("New Message Received from socket server:",data);
<<<<<<< HEAD
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

=======
        addMessage(data?.chatId,data)
>>>>>>> 9a51b3a (1 participant is null at the time of chat creation and chat is creating every time)
    })
}