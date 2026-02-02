import { messageHandler } from "./message.handler.js";
import { addUserSocket,removeUserSocket,getUserSocket } from "../soketsMap.js";
import { disconnectHandler } from "./disconnect.handler.js";

export const registerSocketHandlers = (io,socket)=>{
   addUserSocket(socket.user?._id.toString(),socket.id)

   messageHandler(io,socket)
   disconnectHandler(io,socket)
}