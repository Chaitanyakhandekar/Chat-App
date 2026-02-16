import { useChatStore } from "../../store/useChatStore";
import { socketEvents } from "../../constants/socketEvents";

export const messageHandler = (socket) =>{
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

        socket.on(socketEvents.MESSAGE_SEEN_SINGLE_CHAT,(payload)=>{
            console.log("message seen status : ",payload.status)
        })
    
}