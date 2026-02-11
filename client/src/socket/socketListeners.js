import { socket } from "./socket";
import { useChatStore } from "../store/useChatStore";
import { socketEvents } from "../constants/socketEvents";
import { userAuthStore } from "../store/userStore";

export const initializeSocketListeners = () =>{

    

    socket.on(socketEvents.CONNECT,()=>{    // Listener for successful connection to the socket server
        console.log("Connected to socket server");
    });

    socket.on(socketEvents.DISCONNECT,()=>{     // Listener for disconnection from the socket server
        console.log("Disconnected from socket server");
    });

    socket.on(socketEvents.NEW_MESSAGE,(data)=>{       // Listener for receiving a new message from the socket server
        console.log("New Message Received from socket server:",data);
        const { addMessage } = useChatStore.getState();
        if (data.sender !== userAuthStore.getState().user._id) {
            addMessage(data?.chatId,data)
        }
    })

    socket.on(socketEvents.TYPING,(data)=>{       // Listener for receiving typing status updates from the socket server
        console.log("Typing event received from socket server:",data);
        const { setTypingStatus } = useChatStore.getState();
        setTypingStatus(data.chatId,data.isTyping)
    })

    socket.on(socketEvents.USER_ONLINE,(data)=>{       // Listener for receiving online status updates of users from the socket server
        
    })
}