import { socket } from "./socket";
import { useChatStore } from "../store/useChatStore";
import { socketEvents } from "../constants/socketEvents";

const {
   
    addMessage} = useChatStore.getState();

export const initializeSocketListeners = () =>{
    socket.on(socketEvents.CONNECT,()=>{
        console.log("Connected to socket server");
    });

    socket.on(socketEvents.DISCONNECT,()=>{
        console.log("Disconnected from socket server");
    });

    socket.on(socketEvents.NEW_MESSAGE,(data)=>{
        console.log("New Message Received from socket server:",data);
        addMessage(data?.chatId,data)
    })
}