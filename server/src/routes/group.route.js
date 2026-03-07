import { Router } from "express";
import { userAuth } from "../middlewares/userAuth.middleware.js";
import { getGroupMembers } from "../controllers/group.controller.js";

const router = Router();

router.route("/members/:id").get(userAuth,getGroupMembers)

export default router;