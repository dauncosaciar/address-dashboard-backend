import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

router.post("/", UserController.createUser);

router.get("/", UserController.getAllUsers);

router.get("/:userId", UserController.getUserById);

export default router;
