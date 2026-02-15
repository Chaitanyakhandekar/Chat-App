import { socket } from "./socket";
import { useChatStore } from "../store/useChatStore";
import { socketEvents } from "../constants/socketEvents";
import { userAuthStore } from "../store/userStore";
import { useAssetsStore } from "../store/useAssetsStore";
import { messageHandler } from "./handlers/message.handler";
import { onlineStatusHandler } from "./handlers/onlineStatus.handler";




export const initializeSocketListeners = () =>{

    socket.on(socketEvents.CONNECT,()=>{    // Listener for successful connection to the socket server
        console.log("Connected to socket server");
    });

    socket.on(socketEvents.DISCONNECT,()=>{     // Listener for disconnection from the socket server
        console.log("Disconnected from socket server");
    });


    messageHandler(socket)      //  Handler for Message Events
    
    onlineStatusHandler(socket)   // Handler for Online Status Events
    
}
