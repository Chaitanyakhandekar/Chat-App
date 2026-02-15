import { Chat } from "../../models/chat.model.js"

export const getOtherChatUser = async (chatId,currentUserId) =>{      // This function returns User other that Currently LoggedIn user from Single Chat

    try {
        const chat = await Chat.findById(chatId)

        if(!chat){
            return null
        }

        user = chat.participants.filter(user=>user.toString() !== currentUserId.toString())

        console.log("Current User : ",currentUserId)
        console.log("Other User : ",user)
    } catch (error) {
        return null
    }

}