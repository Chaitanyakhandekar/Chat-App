import { removeUserSocket } from "../soketsMap.js"

export const disconnectHandler = (socket) =>{
    socket.on("disconnect",()=>{
        removeUserSocket(socket.user._id.toString())
        console.log("User disconnected : ",socket.id)
    })
}