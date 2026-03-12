import { isValidObjectId } from "mongoose"
import { Chat } from "../../models/chat.model.js"

export const isChatExists = async (chatId)=>{
    
   if(!isValidObjectId(chatId)){
    return null;
   }

   return await Chat.findById(chatId)
}