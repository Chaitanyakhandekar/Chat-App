import { socket } from "./socket";
import { useChatStore } from "../store/useChatStore";
import { socketEvents } from "../constants/socketEvents";
import { userAuthStore } from "../store/userStore";
import { useAssetsStore } from "../store/useAssetsStore";




export const initializeSocketListeners = () =>{

    socket.on(socketEvents.CONNECT,()=>{    // Listener for successful connection to the socket server
        console.log("Connected to socket server");
    });

    socket.on(socketEvents.DISCONNECT,()=>{     // Listener for disconnection from the socket server
        console.log("Disconnected from socket server");
    });

    socket.on(socketEvents.NEW_MESSAGE,(data)=>{       // Listener for receiving a new message from the socket server
        // console.log("New Message Received from socket server:",data);

        const { addMessage,incrementNewMessagesCount } = useChatStore.getState();
        const { setScrollToBottomInChat, scrollToBottomInChat } = useAssetsStore().getState();

        if (data.sender !== userAuthStore.getState().user._id) {
            addMessage(data?.chatId,data)

            console.log("Scroll to bottom in chat :: ", scrollToBottomInChat);

           if(!scrollToBottomInChat){
            incrementNewMessagesCount(data?.chatId)
           }
           else{
            setScrollToBottomInChat(true)
           }
        }
    })

    socket.on(socketEvents.TYPING,(data)=>{     // Listener for receiving typing status updates from the socket server
        // console.log("Typing event received from socket server:",data);
        const { setTypingStatus } = useChatStore.getState();
        setTypingStatus(data.chatId,data.isTyping)
    })

    socket.on(socketEvents.USER_ONLINE,(userId)=>{       // Listener for receiving online status updates of users from the socket server
        // console.log("User Online Event Received from socket server:",userId);
        const { setOnlineStatus } = useChatStore.getState();
        setOnlineStatus(userId,true)
    })
    
    socket.on(socketEvents.USER_OFFLINE, (userId)=>{    // Listener for receiving offline status updates of users from the socket server 
        // console.log("User Offline Event Received from socket server:",userId);
         const { setOnlineStatus } = useChatStore.getState();
        setOnlineStatus(userId,false)
    })

    socket.on(socketEvents.ONLINE_USERS,(onlineUsers)=>{       
        // Listener for receiving the list of online users from the socket server when a user comes online
        const { setOnlineStatus } = useChatStore.getState();
        for (let user of onlineUsers){
            setOnlineStatus(user,true)
        }
    })
}
