import axios from "axios";

class ChatApi{
   constructor(){
        this.baseUrl = `${import.meta.env.VITE_ENV === "production" ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL}/api/chats`
    }

    isChatExists = async (otherUserId) =>{
        try {
            const response = await axios.get(`${this.baseUrl}/exists/${otherUserId}`,{
                withCredentials:true
            });

            console.log("Is Chat Exists Response :: ",response.data);

            return {
                success:response.data.success,
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

    createSingleChat = async (otherUserId) =>{
        try {
            const response = await axios.post(`${this.baseUrl}/single/${otherUserId}`,
                {},
                {
                    withCredentials:true
                }
            );

            console.log("Create Single Chat Response :: ",response.data);

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

    createGroupChat = async(groupName,participants) =>{
        try {
            const response = await axios.post(`${this.baseUrl}/group`,{
                groupName,
                participants
            },{
                withCredentials:true
            });
        
            console.log("Create Group Chat Response :: ",response.data.data);

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

            // console.log("Get User Chats Response :: ",response);
            return {
                success:true,
                message:response.data.message,
                data: response.data.data,
                unreadMessagesCount:response.data.data.unreadMessagesCount || 0
            }
        } catch (error) {
            return {
                success:false,
                message:error.message,
                error: error
            }
        }
    }

    getChatById = async (chatId) =>{
        try {
            const response = await axios.get(`${this.baseUrl}/${chatId}`,{
                withCredentials:true
            });

            console.log("Get Chat By Id Response :: ",response.data.data);

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


    getUserChatUsers = async ()=>{
        try {
            const response = await axios.get(`${this.baseUrl}/user`,{
                withCredentials:true
            })

            console.log("Chat Users :: ",response.data)

            return {
                success:true,
                data:response.data.data,
                message:"User Chat Users Fetched Successfully."
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

export const chatApi = new ChatApi()