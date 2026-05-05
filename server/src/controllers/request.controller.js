import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError, ApiResponse } from "../utils/apiUtils.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendVerificationToken } from "../services/sendVerificationToken.js";
import { generateTokens } from "../services/generateTokens.js";
import { deleteFileFromCloudinary, uploadFileOnCloudinary } from "../services/cloudinary.service.js";
import { generateOTP } from "../services/generateOTP.js";
import { sendEmail } from "../services/brevoMail.service.js";
import { getUserChatPartners } from "../sockets/utils/getUserChatPartners.js";
import { getIO } from "../sockets/socketInstance.js";
import { socketEvents } from "../constants/socketEvents.js";
import { getUserSocket } from "../sockets/soketsMap.js";
import { createFriendRequest, getUserRequestsService } from "../services/request.service.js";
import { createNotificationService } from "../services/notification.service.js";


/**
 * @description Controller to send new friend Request
 * @method POST
 * @access User
 * @param Id
 */
export const sendFriendReuest = asyncHandler(async (req, res) => {

    const friendId = req.params.id;

    const newRequest = await createFriendRequest(req.user._id, friendId)

    const io = getIO()


    io.to(friendId.toString()).emit(socketEvents.NEW_REQUEST, newRequest)

})

/**
 * @description Controller to Fetch all Pending user requests
 * @method GET
 * @access User
 * @param Id
 */
export const getUserRequests = asyncHandler(async (req, res) => {

    const requests = await getUserRequestsService(req.user._id)

    return res
        .status(200)
        .json(
            new ApiResponse(200, requests, "All Requests Fetched Successfully.")
        )

})

// export {
//     sendFriendReuest,
//     getUserRequests
// }