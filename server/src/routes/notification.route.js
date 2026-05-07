import { Router } from "express"
import { userAuth } from "../middlewares/userAuth.middleware.js";
import {
    getAllUserNotifications
}
    from "../controllers/notification.controller.js";

const router = Router()


router.route("/my").get(userAuth, getAllUserNotifications)

export default router;