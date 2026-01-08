import { Router } from "express";

const router = Router();

router.route("/send").post();
router.route("/receive").get();

export default router;