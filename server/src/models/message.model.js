import mongoose from "mongoose";
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
dotenv.config({path:"./.env"})

const messageSchema = new mongoose.Schema({
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
    isRead:{
        type:Boolean,
        default:false
    },
    sentAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

export const Message = mongoose.model("Message",messageSchema);