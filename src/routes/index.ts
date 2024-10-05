import { Hono } from "hono";
import authorizationRoutes from "./authorize";

const router = new Hono();

router.route("/authorize", authorizationRoutes);

export default router;
