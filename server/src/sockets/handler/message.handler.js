import { socketEvents } from "../../constants/socketEvents.js"
import { Message } from "../../models/message.model.js"
import { getUserSocket, socketsMap } from "../soketsMap.js"
import { Chat } from "../../models/chat.model.js"
import { get } from "http"

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


    socket.on(socketEvents.TYPING, async(data)=>{   // handling typing event
        console.log("Typing Data : ",data)
          console.log("Sockets Map : ",socketsMap)

        const chat = await Chat.findById(data.chatId)   // chacking if chat exists
        const otherUser = chat.participants.filter(user=>socket.user._id.toString() !== user.toString())    // get user to whome event is going to emit


        const payload = {       // creating payload for emitting to other user
            chatId:data.chatId,
            isTyping:data.isTyping,
            sender:socket.user._id
        }

        console.log("Emitting Typing Event to User : ",getUserSocket(otherUser.toString()))

        socket.to(getUserSocket(otherUser.toString())).emit(socketEvents.TYPING, payload)
    })
}

 