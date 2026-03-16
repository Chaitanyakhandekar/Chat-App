import mongoose from "mongoose"
import { getGroupMembers } from "../sockets/utils/getGroupMembers.js"
import { ApiError } from "../utils/apiUtils.js"
import { isChatExists } from "../utils/document existance check/chat.js"
import { isUserExists } from "../utils/document existance check/user.js"
import { Message } from "../models/message.model.js"


export const addMembertoGroupService = async (groupId,user,memberId)=>{   // Admin Protected 

    const groupChat = await isChatExists(groupId)
    const newMember = await isUserExists(memberId)
    
    
    
    if(!groupChat || !newMember){
        throw new ApiError(400,"Invalid GroupId or MemberId.")
    }
    
    
    const isAlreadyInGroup = groupChat.participants.some(p => p.toString() === memberId.toString())
    
    if(isAlreadyInGroup){
        throw new ApiError(400,"Member Already In Group.")
    }
    
    const newIndicator = await Message.create({
        chatId:groupId,
        sender:user._id,
        message:`${user.username} added ${newMember.username}`,
        isIndicator:true
    })

    console.log("Executed::::::::::::::::::::::::::: ",newIndicator)

        groupChat.participants.push(new mongoose.Types.ObjectId(memberId))

        await groupChat.save()

        const groupMenbers = await getGroupMembers(groupId)


        if(!groupMenbers || !groupMenbers.length){
           throw new ApiError(500,"Error While Adding Member In Group.")
        }

        return {
            newIndicator, 
            groupMenbers,
            newMember
        }

       

    }