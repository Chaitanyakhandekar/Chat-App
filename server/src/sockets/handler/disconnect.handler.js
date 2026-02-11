import { socketEvents } from "../../constants/socketEvents.js"
import { removeUserSocket } from "../soketsMap.js"

export const disconnectHandler = (socket) =>{
    socket.on(socketEvents.DISCONNECTION,()=>{
        removeUserSocket(socket.user._id.toString())
        console.log("User disconnected : ",socket.id)
    })
}