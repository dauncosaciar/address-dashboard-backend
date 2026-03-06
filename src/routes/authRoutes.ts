import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post(
  "/login",
  body("email").isEmail().withMessage("El email de acceso no tiene un formato válido"),
  body("password").notEmpty().withMessage("La contraseña de acceso es obligatoria"),
  handleInputErrors,
  AuthController.login
);

export default router;
