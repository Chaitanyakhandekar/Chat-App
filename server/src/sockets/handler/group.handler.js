import { socketEvents } from "../../constants/socketEvents.js"
import { Message } from "../../models/message.model.js"
import { getUserSocket, socketsMap } from "../soketsMap.js"
import { Chat } from "../../models/chat.model.js"
// import { get } from "http"
import { getOtherChatUser } from "../utils/getOtherChatUser.js"
import mongoose, { isValidObjectId } from "mongoose"
import { isChatExists } from "../../utils/document existance check/chat.js"


export const groupHandler =  (io,socket) =>{

    socket.on(socketEvents.ADD_MEMBER_IN_GROUP, async ({groupId,userId})=>{

        const groupChat = await isChatExists(groupId)

        if(!groupChat || !isValidObjectId(userId)){
            socket.to(socket.user._id).emit(socketEvents.ERROR, {
                  type: "Adding Member Error",
                  message: "Error While Adding Member In Group."
            })
            return
        }

        // const participants = groupChat.participants

        const isAlreadyInGroup = groupChat.participants.some(p => p.toString() === userId.toString())

        if(isAlreadyInGroup){
            socket.to(socket.user._id).emit(socketEvents.ERROR, {
                 type: "Adding Member Error",
                 message: "Member Already In Group."
            })
            return
        }

        groupChat.participants.push(new mongoose.Types.ObjectId(userId))

        await groupChat.save()

        


        

    })

}