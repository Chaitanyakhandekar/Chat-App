import { messageHandler } from "./message.handler.js";
import { addUserSocket,removeUserSocket,getUserSocket } from "../soketsMap.js";
import { disconnectHandler } from "./disconnect.handler.js";
import { onlineStatusHandler } from "./onlineStatus.handler.js";

export const registerSocketHandlers = (io,socket)=>{
   
   onlineStatusHandler(io,socket)
   messageHandler(io,socket)
   disconnectHandler(io,socket)
}