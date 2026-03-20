import { Router } from "express";
import {userAuth} from "../middlewares/userAuth.middleware.js"
import {
     getConversation,
     uploadImage,
     deleteMessage
     } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// router.route("/send").post();
// router.route("/receive").get();
router.route("/convo/:id").get(userAuth,getConversation)
router.route("/for-me/:id").delete(userAuth,deleteMessage)
router.route("/upload-images").post(userAuth, upload.array("images",5) , uploadImage)
export default router;