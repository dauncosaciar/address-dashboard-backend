import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "../middlewares/auth.middleware";
import { handleInputErrors } from "../middlewares/validation.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  body("name").notEmpty().withMessage("El nombre del Usuario es obligatorio"),
  body("lastName").notEmpty().withMessage("El apellido del Usuario es obligatorio"),
  body("email").isEmail().withMessage("El email del Usuario no es válido"),
  body("password")
    .isLength({ min: 9 })
    .withMessage("La contraseña del Usuario debe tener por lo menos 9 caracteres"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no son iguales");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.register
);

router.post(
  "/login",
  body("email").isEmail().withMessage("El email de acceso no tiene un formato válido"),
  body("password").notEmpty().withMessage("La contraseña de acceso es obligatoria"),
  handleInputErrors,
  AuthController.login
);

router.get("/user", authenticate, AuthController.getAuthenticatedUser);

export default router;
