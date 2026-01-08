import { io } from "../../../server.js";
import { socketsMap } from "../soketsMap.js";

io.on("connection",(socket)=>{
    console.log("New client connected:",socket.id);

    socketsMap.set()
})