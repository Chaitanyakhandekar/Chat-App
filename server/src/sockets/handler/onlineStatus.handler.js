import { socketEvents } from "../../constants/socketEvents.js";
import { addUserSocket,removeUserSocket,getUserSocket } from "../soketsMap.js";
import { getUserChatPartners } from "../utils/getUserChatPartners.js";

export const onlineStatusHandler = async(io,socket)=>{

    socket.join(socket.user?._id.toString())     // joining socket/user to its personal room

    addUserSocket(socket.user?._id.toString(),socket.id)  // maping socket.id with user id in memory

    const userChatPartners = await getUserChatPartners(socket.user._id)   // getting all chat partners of user to notify them about online status

    if(userChatPartners){
        for (let partner of userChatPartners){
            if(getUserSocket(partner.toString())){
                io.to(partner.toString()).emit(socketEvents.USER_ONLINE,socket.user?._id)
                console.log("Emitted Online Status to : ",partner.toString())
            }
        }
    }
}