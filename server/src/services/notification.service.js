import { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/apiUtils.js"
import { isUserExists } from "../utils/document existance check/user.js"
import { Notification } from "../models/notification.model.js"
import { getGroupMembers } from "../sockets/utils/getGroupMembers"

/**
 * @description Service for Creating new notification
 * @access User
 * @param {ObjectId} senderId 
 * @param {Array} receivers 
 * @param {String} type 
 * @param {ObjectId} entityId 
 * @param {Boolean} isGroupNotification 
 * @param {String} content 
 * @param {String} renderUrl
 * @returns Notification Object
 */
const createNotificationService = async (senderId,currentUserId,receivers=[],type,entityId,isGroupNotification=false,content,renderUrl="")=>{

    const sender = await isUserExists(senderId)
    let groupMembers=[]

    if([type,content].some(field => !field || field && field.trim() === "")){
        throw new ApiError(400,"Type and Content are Required Fields.")
    }

    if(!isValidObjectId(entityId)){
        throw new ApiError(400,"Invalid Entity Id.")
    }

    if(isGroupNotification && !receivers.length){
        receivers = await getGroupMembers(entityId)     
    }

    if(!isGroupNotification && !receivers.length){
        receivers = [currentUserId]
    }
    
    if (!receivers.length) {
        throw new ApiError(400, "No receivers found")
    }

    receivers = receivers.filter(id => id.toString() !== sender_id.toString())

    const newNotification = await Notification.create({
        sender:sender._id,
        receivers:receivers,
        entity:entityId,
        type,
        isGroupNotification,
        content,
        renderUrl
    })

    if(!newNotification){
        throw new ApiError(404,"Error While Creating Notification.")
    }


    return {newNotification,groupMembers};
}

export {
    createNotificationService
}