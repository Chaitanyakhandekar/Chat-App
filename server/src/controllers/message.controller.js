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
import { Message } from "../models/message.model.js";


const getConversation = asyncHandler(async (req,res)=>{
    const id = req?.user?._id || null
    const otherUserId = req?.params?.id || null

    if(!otherUserId){
        throw new ApiError(400,"Other User Id is Required.")
    }

    const messages = await Message.find(
      {
          $or:[
            {
                sender:id,
                receiver:otherUserId
            },
            {
                sender:otherUserId,
                receiver:id
            }
        ]
      }
    )

    if(!messages?.length){
        return res
            .status(200)
            .json(
                new ApiResponse(200,[],"No Messages Found in this Conversation.")
            )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200,messages,"Messages Fetch Successfully.")
        )
    
})

export {
    getConversation
}