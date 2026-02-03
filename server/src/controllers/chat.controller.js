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
import { Chat } from "../models/chat.model.js";


const createSingleChat = asyncHandler(async (req,res)=>{
    const {userId} = req.params


    if(!userId || userId && userId.trim() === "" || !mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(400,"Invalid UserId for New Chat.")
    }

    const isChatAlreadyExists = await Chat.findOne({
        participants:{ $all: [userId, req.user._id] }
    })

    if(isChatAlreadyExists){
        throw new ApiError(400,"Chat Between These Users Already Exists.")
    }

    const newSingleChat = await Chat.create({
        participants:[
            userId,
            req.user._id
        ]
    })

    if(!newSingleChat){
        throw new ApiError(500,"Server Error While Creating New Single Chat.")
    }

    let newChat = await newSingleChat.populate("participants","-password")

    console.log("New Single Chat Created : ",newChat);

    return res.status(201).json(
        new ApiResponse(201,newChat,"New Single Chat Created Successfully.")
    )

})

const createGroupChat = asyncHandler(async (req,res)=>{
   
})

const getUserChats = asyncHandler(async (req,res)=>{
    const userChats = await Chat.aggregate([
        {
            $match:{
                participants: { $in: [req.user._id] }
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"participants",
                foreignField:"_id",
                as:"participants",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            name:1,
                            avtar:1
                        }
                    }
                ]
            }
        }
    ])

    // console.log("User Chats : ",userChats);

    if(!userChats.length){
        throw new ApiError(500,"Server Error While Fetching User Chats.")
    }

    return res.status(200).json(
        new ApiResponse(200,userChats,"User Chats Fetched Successfully.")
    )
})



export {
    createGroupChat,
    createSingleChat,
    getUserChats
}