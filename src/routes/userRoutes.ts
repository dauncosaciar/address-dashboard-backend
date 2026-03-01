import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { UserController } from "../controllers/UserController";

const router = Router();

router.post(
  "/",
  body("name").notEmpty().withMessage("El nombre del Usuario es obligatorio"),
  body("lastName").notEmpty().withMessage("El apellido del Usuario es obligatorio"),
  body("role").notEmpty().withMessage("El rol del Usuario es obligatorio"),
  body("email").isEmail().withMessage("El email del Usuario no es válido"),
  body("password").notEmpty().withMessage("La contraseña del Usuario es obligatoria"),
  handleInputErrors,
  UserController.createUser
);

router.get("/", UserController.getAllUsers);

router.get(
  "/:userId",
  param("userId").isMongoId().withMessage("El ID del usuario no es válido"),
  handleInputErrors,
  UserController.getUserById
);

router.put(
  "/:userId",
  param("userId").isMongoId().withMessage("El ID del usuario no es válido"),
  body("name").notEmpty().withMessage("El nombre del Usuario es obligatorio"),
  body("lastName").notEmpty().withMessage("El apellido del Usuario es obligatorio"),
  body("role").notEmpty().withMessage("El rol del Usuario es obligatorio"),
  body("email").isEmail().withMessage("El email del Usuario no es válido"),
  body("password").notEmpty().withMessage("La contraseña del Usuario es obligatoria"),
  handleInputErrors,
  UserController.updateUser
);

router.delete(
  "/:userId",
  param("userId").isMongoId().withMessage("El ID del usuario no es válido"),
  handleInputErrors,
  UserController.deleteUser
);

export default router;
