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

    socket.on("message",(data)=>{
        console.log("Message received from client:",data);

        socket.to(socketsMap.get(data.to)).emit("message",{
            from:socket.user._id,
            message:data.message
        })
    })

    socket.emit("welcome","Welcome to the WebSocket server!");
})

export {io};