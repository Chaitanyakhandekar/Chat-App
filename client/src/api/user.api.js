import axios from "axios";

class UserApi{
    constructor(){
        this.baseUrl = `${import.meta.env.VITE_ENV === "production" ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL}/api/users`
    }

    registerUser = async (userData) => {
        try {
            const response = await axios.post(`${this.baseUrl}/register`, userData);
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

    loginUser = async (credentials) => {
        try {
            const response = await axios.post(`${this.baseUrl}/login`,
                credentials,
                {
                    withCredentials:true
                }
            );
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

    getAllUsers = async () => {
        try {
            const response = await axios.get(`${this.baseUrl}/all`,{
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

    authMe = async () =>{
        try {
            const response = await axios.get(`${this.baseUrl}/auth-me`,{
                withCredentials:true
            })

            // console.log("Auth Me Response :",response);

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

    searchUsers = async (query) => {
        try {
            const response = await axios.get(`${this.baseUrl}/search/?query=${query}`,{
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

export const userApi = new UserApi();