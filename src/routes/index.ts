import { Router } from "express";
import { UserController } from "../controllers/user";

const router = Router();

router.get("/authorize", UserController.authorize);

export default router;
