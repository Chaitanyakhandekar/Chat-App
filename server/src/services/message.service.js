import { isMessageExists } from "../utils/document existance check/message.js"
import { isUserExists } from "../utils/document existance check/user.js"

/**
 * @description Service for delete message for me
 * @param {ObjectId} messageId 
 * @param {ObjectId} userId 
 * @returns  message object
 */
const deleteForMeService = async(messageId,userId)=>{

    const message = await isMessageExists(messageId)
    const user = await isUserExists(userId)

    message.deletedFor.push(user._id)

    await message.save()

    return message
}

export {
    deleteForMeService
}