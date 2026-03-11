import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "../middlewares/auth";
import { handleInputErrors } from "../middlewares/validation";
import { ProfileController } from "../controllers/ProfileController";

const router = Router();

router.use(authenticate);

router.put(
  "/",
  body("name").notEmpty().withMessage("El nombre del Usuario es obligatorio"),
  body("lastName").notEmpty().withMessage("El apellido del Usuario es obligatorio"),
  body("email").isEmail().withMessage("El email del Usuario no es válido"),
  handleInputErrors,
  ProfileController.updateProfile
);

router.put(
  "/password",
  body("currentPassword")
    .notEmpty()
    .withMessage("La contraseña actual no puede estar vacía"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("La nueva contraseña debe tener un mínimo de 8 caracteres"),
  body("newPasswordConfirmation").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  handleInputErrors,
  ProfileController.updateCurrentPassword
);

export default router;
