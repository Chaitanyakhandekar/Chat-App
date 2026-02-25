import { messageHandler } from "./message.handler.js";
import { addUserSocket,removeUserSocket,getUserSocket } from "../soketsMap.js";
import { disconnectHandler } from "./disconnect.handler.js";
import { onlineStatusHandler } from "./onlineStatus.handler.js";
import { onlineStatusAfterLogin } from "./onlineStatusAfterLogin.js";
import { chatHandler } from "./chat.handler.js";

export const registerSocketHandlers = (io,socket)=>{
   
   onlineStatusAfterLogin(io,socket)
   onlineStatusHandler(io,socket)
   messageHandler(io,socket)
   chatHandler(io,socket)
   disconnectHandler(io,socket)

   
}