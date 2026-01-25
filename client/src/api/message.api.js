import axios from "axios";

class MessageApi{
    constructor(){
        this.baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/messages`
    }

    getConversation = async (otherUserId) =>{
        try {
            const response = await axios.get(`${this.baseUrl}/convo/${otherUserId}`,
                {
                    withCredentials:true
                }
            )

            console.log("Messages in Conversation :: ",response.data)

            return {
                success:true,
                message:"",
                data:response.data
            }
        } catch (error) {
            return {
                success:false,
                message:error.message,
                error:error
            }
        }
    }

}

export const messageApi = new MessageApi()