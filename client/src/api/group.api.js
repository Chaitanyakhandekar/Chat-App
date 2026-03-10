import axios from "axios";

class GroupApi {
   constructor(){
        this.baseUrl = `${import.meta.env.VITE_ENV === "production" ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL}/api/groups`
    }

    getGroupMembers = async (groupId) =>{
        try {
            console.log("GroupId in API :: ", groupId)
            const response = await axios.get(`${this.baseUrl}/members/${groupId}`,{
                withCredentials:true
            });
            console.log("Group Members Response :: ",response.data);
            return {
                success:true,
                message:response.data.message,
                data: response.data.data
            }
        } catch (error) {
            return {
                success:false,
                message:error.message,
            };
        }
    }
}

export const groupApi = new GroupApi();