import { socketEvents } from "../../constants/socketEvents.js"
import { Message } from "../../models/message.model.js"
import { getUserSocket, socketsMap } from "../soketsMap.js"
import { Chat } from "../../models/chat.model.js"

export const messageHandler = (io,socket)=>{
    socket.on(socketEvents.NEW_MESSAGE,async(data)=>{

        console.log("Message : ",data)
        console.log("Sockets Map : ",socketsMap)

        let newChat;

        if(!data.chatId){     // no chatId means this is new chat so create new chat in database
             newChat = await Chat.create({
                participants:[data?.sender,socket.user._id],
            })

            if(!newChat){  // error while creating new chat (emit error event)
                socket.emit(socketEvents.ERROR , {
                    type:"Message Sending Error",
                    message:"Error While Sending Message."
                })
            }
        }

        const newMessage = await Message.create({    // save message to database
            sender:socket.user._id,
            receiver:data.receiver,
            message:data.message,
            chatId: newChat?._id || data.chatId
        })

        if(!newMessage){   // error while saving message to database means message sending failure
             socket.emit(socketEvents.ERROR , {
                    type:"Message Sending Error",
                    message:"Error While Sending Message."
                })
        }
        else{
            socket.to(getUserSocket(data.receiver)).emit(socketEvents.NEW_MESSAGE , newMessage)
        }
    })
}

 