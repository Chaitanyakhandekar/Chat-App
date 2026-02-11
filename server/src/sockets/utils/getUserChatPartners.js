import { Chat } from "../../models/chat.model.js"

export const getUserChatPartners = async(userId)=>{
    try {
        const chats = await Chat.find({
            participants: {
                $in:[userId]
            }
        })

        const participants = chats.map((partner)=>{
            return partner.participants.filter(user=>user.toString() !== userId.toString())
        })

        return participants

    } catch (error) {
        return null
    }
}