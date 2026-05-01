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
import { createFriendRequest } from "../services/request.service.js";

const io = getIO()

/**
 * @description Controller to send new friend Request
 * @method POST
 * @access User
 * @param Id
 */
const sendFriendReuest = asyncHandler(async (req, res) => {

    const friendId = req.params.id;

    const newRequest = await createFriendRequest(req.user._id, friendId)

    io.to(friendId.toString()).emit(socketEvents.NEW_REQUEST, newRequest)

})

export {
    sendFriendReuest
}