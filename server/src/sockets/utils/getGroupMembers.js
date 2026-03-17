import { Chat } from "../../models/chat.model.js"
import { redis } from "../../redis/config.js"

export const getGroupMembers = async (groupId) =>{
    if(!groupId)return []

    let groupMembers=null

    try {
        groupMembers = await redis.get(`group-members-${groupId}`)
        console.log("Group Members  :::::::::: ",groupMembers )
    } catch (error) {
        console.log(error)
    }
    
    if(groupMembers){
        return groupMembers 
    }
    
    const group = await Chat.findById(groupId)
    
    groupMembers = group.participants

    console.log("Group Members  :::::::::: ",groupMembers )
    
    // await redis.set(`group-members-${groupId}`, groupMembers)

    return groupMembers
}