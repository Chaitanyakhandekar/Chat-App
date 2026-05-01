import { Router } from "express"
import { userAuth } from "../middlewares/userAuth.middleware.js";
import { sendFriendReuest } from "../controllers/request.controller.js";

const router = Router()

router.route("/friend-request/:id").post(userAuth, sendFriendReuest)

export default router;