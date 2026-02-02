import { Router } from "express";
import {userAuth} from "../middlewares/userAuth.middleware.js"
import
 {
     createSingleChat,
     getUserChats
     } from "../controllers/chat.controller.js";

const router = Router();

// router.route("/send").post();
// router.route("/receive").get();
router.route("/:userId").post(userAuth,createSingleChat)
router.route("/").get(userAuth,getUserChats)
export default router;