import { Hono } from "hono";
import collaborationRoutes from "./collaboration";

const router = new Hono();

router.route("/collaboration", collaborationRoutes);

export default router;
