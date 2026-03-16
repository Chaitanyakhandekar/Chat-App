import { socketEvents } from "../../constants/socketEvents"

export const groupHandler = (io,socket)=>{
    socket.on(socketEvents.ADD_MEMBER_IN_GROUP, (data)=>{})
}