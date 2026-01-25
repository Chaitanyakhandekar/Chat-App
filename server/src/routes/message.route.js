import { Router } from "express";
import {userAuth} from "../middlewares/userAuth.middleware.js"
import { getConversation } from "../controllers/message.controller.js";

const router = Router();

// router.route("/send").post();
// router.route("/receive").get();
router.route("/convo/:id").get(userAuth,getConversation)
export default router;