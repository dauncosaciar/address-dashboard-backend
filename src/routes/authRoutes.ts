import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "../middlewares/auth";
import { handleInputErrors } from "../middlewares/validation";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post(
  "/login",
  body("email").isEmail().withMessage("El email de acceso no tiene un formato válido"),
  body("password").notEmpty().withMessage("La contraseña de acceso es obligatoria"),
  handleInputErrors,
  AuthController.login
);

router.get("/user", authenticate, AuthController.getAuthenticatedUser);

export default router;
