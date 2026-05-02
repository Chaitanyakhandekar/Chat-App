import { Router } from "express"
import { userAuth } from "../middlewares/userAuth.middleware.js";
import {
    getUserRequests,
    sendFriendReuest,
}
    from "../controllers/request.controller.js";

const router = Router()

router.route("/friend-request/:id").post(userAuth, sendFriendReuest)
router.route("/get/:id").get(userAuth, getUserRequests)

export default router;