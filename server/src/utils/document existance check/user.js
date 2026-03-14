import { isValidObjectId } from "mongoose"
import { User } from "../../models/user.model.js"

export const isUserExists = async (chatId)=>{
    
   if(!isValidObjectId(chatId)){
    return null;
   }

   return await User.findById(chatId)
}