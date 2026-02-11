import { socketEvents } from "../../constants/socketEvents.js";
import { addUserSocket,removeUserSocket,getUserSocket } from "../soketsMap.js";
import { getUserChatPartners } from "../utils/getUserChatPartners.js";
import { redis } from "../../redis/config.js";

export const onlineStatusHandler = async(io,socket)=>{

    socket.join(socket.user?._id.toString())     // joining socket/user to its personal room

    addUserSocket(socket.user?._id.toString(),socket.id)  // maping socket.id with user id in memory

    let userChatPartners = JSON.parse(await redis.get(`chat-participants-${socket.user._id}`))      // Checking In Redis cache if chat partners of user are already cached

    if(!userChatPartners){      // if not cached then get from database and cache it
        userChatPartners = await getUserChatPartners(socket.user._id)   // getting all chat partners of user to notify them about online status
        await redis.set(`chat-participants-${socket.user._id}`,JSON.stringify(userChatPartners),{
            EX:300    // cache will expire in 5 minutes
        })
    }
        console.log("User Chat Partners : ",userChatPartners)
    if(userChatPartners){
        for (let partner of userChatPartners){
            if(getUserSocket(partner.toString())){
                io.to(partner.toString()).emit(socketEvents.USER_ONLINE,socket.user?._id)
                console.log("Emitted Online Status to : ",partner.toString())
            }
        }
    }
}