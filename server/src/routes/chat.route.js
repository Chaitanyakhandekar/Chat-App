import { Router } from "express";
import { userAuth } from "../middlewares/userAuth.middleware.js"
import {
createSingleChat,
getUserChats,
createGroupChat,
isChatExists
} from "../controllers/chat.controller.js";

const router = Router();

// router.route("/send").post();
// router.route("/receive").get();
router.route("/single/:userId").post(userAuth, createSingleChat)
router.route("/group").post(userAuth, createGroupChat)
router.route("/").get(userAuth, getUserChats)
router.route("/exists/:chatId").get(userAuth, isChatExists)
export default router;  