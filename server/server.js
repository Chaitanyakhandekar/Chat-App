import cookieParser from 'cookie-parser';
import express from 'express';
import {createServer} from "http"
import {Server} from "socket.io"
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config({path:"./.env"})


const app = express();  // Create an Express application

const httpServer = createServer(app)   // Create an HTTP server

// Initialize Socket.IO with the server


app.use(cors({
    origin:process.env.CLIENT_URL || "http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))
app.use(express.json({
    limit:"16kb"
}))
app.use(cookieParser())
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"))


import userRouter from "./src/routes/user.route.js"
import messageRouter from "./src/routes/message.route.js"

app.use("/api/users",userRouter)
app.use("/api/messages",messageRouter)

// const PORT = process.env.PORT || 3000;
// httpServer.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });

export  {httpServer};

