import mongoose from "mongoose";
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
dotenv.config({path:"./.env"})

const messageSchema = new mongoose.Schema({

    chatId:{
        type:mongoose.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    sender:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true,
        trim:true,
    },
    attachments:[
        {
          url:{
            type:String,
            required:true
          },
          filename:{
            type:String,
          }  
        }
    ],
    seen:{
        type:Boolean,
        default:false
    },
    seenAt:{
        type:Date,
    },
    sentAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

export const Message = mongoose.model("Message",messageSchema);