import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { CollaborationController } from "../controllers/collaboration";

const router = new Hono();

router.use("*", authMiddleware);

router.get("/:documentId", CollaborationController.getCollaborationUrl);

export default router;
