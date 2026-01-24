import { Message } from "../../models/message.model.js"
import { getUserSocket, socketsMap } from "../soketsMap.js"

export const messageHandler = (io,socket)=>{
    socket.on("message",async(data)=>{

        console.log("Message : ",data)

        const savedDb = await Message.create({
            sender:socket.user._id,
            receiver:data.to,
            message:data.message
        })

        if(!savedDb){
            socket.to(data.to).emit("message_failed",{
                success:false,
                message:"Message Sending Failed",
                to:data.to
            })
        }

        socket.to(getUserSocket(data.to)).emit("message",{
            message:data.message,
            from:socket.user._id
        })
    })
}