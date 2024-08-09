import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { UserController } from "../controllers/user";

const router = new Hono();

router.use("*", authMiddleware);

router.get("/", UserController.authorize);

export default router;
