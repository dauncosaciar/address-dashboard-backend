import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import { userExists, validateUserId } from "../middlewares/user";
import { AddressController } from "../controllers/AddressController";

const router = Router({ mergeParams: true });

router.param("userId", validateUserId);
router.param("userId", userExists);

router.post(
  "/:userId/addresses",
  body("street").notEmpty().withMessage("La calle de la dirección es obligatoria"),
  body("city").notEmpty().withMessage("La ciudad de la dirección es obligatoria"),
  body("province")
    .notEmpty()
    .withMessage("La provincia o estado de la dirección es obligatoria"),
  body("country").notEmpty().withMessage("El país de la dirección es obligatorio"),
  handleInputErrors,
  AddressController.createAddress
);

export default router;
