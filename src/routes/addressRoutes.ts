import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "../middlewares/auth.middleware";
import { handleInputErrors } from "../middlewares/validation.middleware";
import { userExists, validateUserId } from "../middlewares/user.middleware";
import {
  addressBelongsToUser,
  addressExists,
  validateAddressId
} from "../middlewares/address.middleware";
import { AddressController } from "../controllers/address.controller";

const router = Router({ mergeParams: true });

router.use(authenticate);

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

router.get("/:userId/addresses", AddressController.getUserAddresses);

router.param("addressId", validateAddressId);
router.param("addressId", addressExists);
router.param("addressId", addressBelongsToUser);

router.get("/:userId/addresses/:addressId", AddressController.getAddressById);

router.put(
  "/:userId/addresses/:addressId",
  body("street").notEmpty().withMessage("La calle de la dirección es obligatoria"),
  body("city").notEmpty().withMessage("La ciudad de la dirección es obligatoria"),
  body("province")
    .notEmpty()
    .withMessage("La provincia o estado de la dirección es obligatoria"),
  body("country").notEmpty().withMessage("El país de la dirección es obligatorio"),
  handleInputErrors,
  AddressController.updateAddress
);

router.delete("/:userId/addresses/:addressId", AddressController.deleteAddress);

export default router;
