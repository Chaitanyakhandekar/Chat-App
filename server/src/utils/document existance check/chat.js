import { isValidObjectId } from "mongoose"
import { Chat } from "../../models/chat.model.js"

export const isChatExists = async (chatId)=>{
    
   if(!isValidObjectId(chatId)){
    return null;
   }

   const a = await Chat.findById(chatId)
   console.log("Chat : ",a)
   return a
}