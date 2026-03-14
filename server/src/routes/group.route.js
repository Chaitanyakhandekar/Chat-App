import { Router } from "express";
import { userAuth } from "../middlewares/userAuth.middleware.js";
import {
     getGroupMembers,
     updateGroupChat,
     uploadGroupPicture,
    getNonGroupMembers

 } from "../controllers/group.controller.js";
 import {getGroupConversation} from "../controllers/message.controller.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/convo/:id").get(userAuth,getGroupConversation)
router.route("/non-group-members/:id").get(userAuth,getNonGroupMembers)
router.route("/upload-picture/:id").post(userAuth, upload.single("groupPicture"), uploadGroupPicture)
router.route("/members/:id").get(userAuth,getGroupMembers)
router.route("/update/:id").put(userAuth,updateGroupChat)

export default router;