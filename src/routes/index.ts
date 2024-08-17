import { Hono } from "hono";
import authorizationRoutes from "./authorize";
import callRoutes from "./call";

const router = new Hono();

router.route("/authorize", authorizationRoutes);
router.route("/call", callRoutes);

export default router;
