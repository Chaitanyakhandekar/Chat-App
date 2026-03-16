import { socketEvents } from "../../constants/socketEvents"
import { useGroupChatStore } from "../../store/useGroupChatStore";

export const groupHandler = (socket)=>{

    
    socket.on(socketEvents.ADD_MEMBER_IN_GROUP, (newMember)=>{
        const {addCurrentGroupParticipant} = useGroupChatStore.getState();
        console.log("Add member Event ::::: ",newMember)
        addCurrentGroupParticipant(newMember)

    })
}