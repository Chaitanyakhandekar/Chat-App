import { parseCookies } from "../utils/cookieParser.js";
import { ApiError } from "../../utils/apiUtils.js";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";

export const auth = async (socket,next)=>{
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
}
