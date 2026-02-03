import axios from "axios";

class ChatApi{
   constructor(){
        this.baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/chats`
    }

    createSingleChat = async (otherUserId) =>{
        try {
            const response = await axios.post(`${this.baseUrl}/single/${otherUserId}`,
                {},
                {
                    withCredentials:true
                }
            );

            console.log("Create Single Chat Response :: ",response);

            return {
                success:true,
                message:response.data.message,
                data: response.data.data
            }
        } catch (error) {
            return {
                success:false,
                message:error.message,
                error: error
            }
        }
    }

    getUserChats = async () =>{
        try {
            const response = await axios.get(`${this.baseUrl}/`,{
                withCredentials:true
            });
            return {
                success:true,
                message:response.data.message,
                data: response.data.data
            }
        } catch (error) {
            return {
                success:false,
                message:error.message,
                error: error
            }
        }
    }


}

export const chatApi = new ChatApi()