import { io } from "../../server.js";
import { parseCookies } from "./utils/cookieParser.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiUtils.js";
import dotenv from "dotenv";
import { socketsMap } from "./soketsMap.js";
dotenv.config({path:"./.env"})

io.use(async(socket,next)=>{
    const token = parseCookies(socket.handshake.headers);

    let decodedToken;

    try {
         decodedToken = jwt.verify(
            token.accessToken,
            process.env.JWT_ACCESS_SECRET,
        )
    } catch (error) {
        return next(new ApiError(500,"Error While Decoding AccessToken"))
    }

    // console.log("Decoded Token in Socket Middleware : ",decodedToken);

    if(!decodedToken){
        return next(new ApiError(500,"No Decoded Token Found"))
    }



   const user = await User.findById(decodedToken._id).select("-password")

//    console.log("Authenticated User in Socket Middleware : ",user);

    socket.user = user;
    next();
})




io.on("connection",(socket)=>{    // Listen for client connections

    socketsMap.set(socket.user?._id.toString(),socket.id)
    console.log("Current Sockets Map :",socketsMap);

    socket.on("message",(data,cb)=>{
        console.log("Message received from client:",data);
        console.log("Message data socket id to:",socketsMap.get(data.to));

        const to = socketsMap.get(data.to);

        if(!to){
            console.log("Recipient user is not connected to socket.");
        }

        console.log("Emitting message to socket id:",to);

        socket.to(to).emit("message",{
            from:socket.user._id || "Unknown",
            message:data.message || "No message content"
        })

         cb({
        success: true,
        message: "Message delivered to server"
    });
    })




    socket.on("disconnect",()=>{
        socketsMap.delete(socket.user?._id.toString())
    })

    socket.emit("welcome","Welcome to the WebSocket server!");
    

})




export {io};