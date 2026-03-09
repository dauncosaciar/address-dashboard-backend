import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/role";
import { handleInputErrors } from "../middlewares/validation";
import { userExists, validateUserId } from "../middlewares/user";
import { UserController } from "../controllers/UserController";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requireAdmin,
  body("name").notEmpty().withMessage("El nombre del Usuario es obligatorio"),
  body("lastName").notEmpty().withMessage("El apellido del Usuario es obligatorio"),
  body("role").notEmpty().withMessage("El rol del Usuario es obligatorio"),
  body("email").isEmail().withMessage("El email del Usuario no es válido"),
  body("password").notEmpty().withMessage("La contraseña del Usuario es obligatoria"),
  handleInputErrors,
  UserController.createUser
);

router.get("/", requireAdmin, UserController.getAllUsers);

router.param("userId", validateUserId);
router.param("userId", userExists);

router.get("/:userId", requireAdmin, UserController.getUserById);

router.put(
  "/:userId",
  requireAdmin,
  body("name").notEmpty().withMessage("El nombre del Usuario es obligatorio"),
  body("lastName").notEmpty().withMessage("El apellido del Usuario es obligatorio"),
  body("role").notEmpty().withMessage("El rol del Usuario es obligatorio"),
  body("email").isEmail().withMessage("El email del Usuario no es válido"),
  body("password").notEmpty().withMessage("La contraseña del Usuario es obligatoria"),
  handleInputErrors,
  UserController.updateUser
);

router.delete("/:userId", requireAdmin, UserController.deleteUser);

export default router;
