import { socketEvents } from "../../constants/socketEvents"
import { Chat } from "../../models/chat.model"

export const adminPermission = async(socket,next)=>{
   const groupId = socket?.groupId

   if(!groupId){
    socket.to(socket.user._id).emit(socketEvents.ERROR, {
        type:"Permission",
        message:"User Not Authorize for This Action"
    })
   }else{

    const group = await Chat.findById(groupId)

    if(group?.isGroupChat)
        if(group.admins.some(a => a.toString() === socket.user._id.toString())){
            socket.group = group
            next()
        }
    }
}