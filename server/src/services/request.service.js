import mongoose from "mongoose"
import { Message } from "../models/message.model.js"
import { User } from "../models/user.model.js"
import { isChatExists } from "../utils/document existance check/chat.js"
import { isMessageExists } from "../utils/document existance check/message.js"
import { isUserExists } from "../utils/document existance check/user.js"
import { summarizeChat } from "./ai.service.js"
import { getMessagesForSummary } from "./message.service.js"
import { ApiError } from "../utils/apiUtils.js"
import { Request } from "../models/request.model.js"

/**
 * @description Service For Creating New Friend Request
 * @param {ObjectId} friendId
 * @returns Request Object
 */
export const createFriendRequest = async (userId, friendId) => {

    const friend = await isUserExists(friendId)

    const payload = {
        type: "DIRECT_CHAT_REQUEST",
        sender: userId,
        receiver: friendId,
        message: "new friend request",
    }

    const newRequest = await Request.create(payload)

    if (!newRequest) {
        throw new ApiError(501, "Internal Server Error.")
    }

    return newRequest;

}

// export {
//     createFriendRequest
// }