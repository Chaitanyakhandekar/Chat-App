import { useChatStore } from "../../store/useChatStore";
import { socketEvents } from "../../constants/socketEvents";

export const chatHandler = (socket)=>{

    socket.on(socketEvents.NEW_SINGLE_CHAT , (chat)=>{
        console.log("New Chat (Socket) :: ",chat)
    })

}