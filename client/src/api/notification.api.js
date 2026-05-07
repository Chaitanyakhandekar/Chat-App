
import axios from "axios";

class NotificationApi {
    constructor() {
        this.baseUrl = `${import.meta.env.VITE_ENV === "production" ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL}/api/notifications`
    }



    getMyNotifications = async () => {
        try {
            const response = await axios.get(`${this.baseUrl}/my`, { withCredentials: true })

            console.log("My Notifications ::: ", response.data.data)

            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message,
                error: error
            }
        }
    }
}

export const notificationApi = new NotificationApi();