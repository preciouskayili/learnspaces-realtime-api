import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { AudioCallController } from "../controllers/audio-call";

const router = new Hono();

router.use("*", authMiddleware);

router.post("/join", AudioCallController.joinCall);
router.delete("/leave", AudioCallController.leaveCall);

export default router;
