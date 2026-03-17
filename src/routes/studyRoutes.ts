import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "../middlewares/auth.middleware";
import { handleInputErrors } from "../middlewares/validation";
import { userExists, validateUserId } from "../middlewares/user.middleware";
import {
  studyBelongsToUser,
  studyExists,
  validateStudyId
} from "../middlewares/study.middleware";
import { StudyController } from "../controllers/study.controller";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.param("userId", validateUserId);
router.param("userId", userExists);

router.post(
  "/:userId/studies",
  body("title").notEmpty().withMessage("El título del estudio es obligatorio"),
  body("institution").notEmpty().withMessage("La institución del estudio es obligatoria"),
  body("startDate")
    .isISO8601()
    .withMessage("La fecha de inicio no tiene un formato válido")
    .toDate(),
  body("endDate")
    .isISO8601()
    .withMessage("La fecha de fin no tiene un formato válido")
    .toDate()
    .custom((value, { req }) => {
      const startDate = req.body.startDate;
      if (startDate && value && value < startDate) {
        throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
      }
      return true;
    }),
  handleInputErrors,
  StudyController.createStudy
);

router.get("/:userId/studies", StudyController.getUserStudies);

router.param("studyId", validateStudyId);
router.param("studyId", studyExists);
router.param("studyId", studyBelongsToUser);

router.get("/:userId/studies/:studyId", StudyController.getStudyById);

router.put(
  "/:userId/studies/:studyId",
  body("title").notEmpty().withMessage("El título del estudio es obligatorio"),
  body("institution").notEmpty().withMessage("La institución del estudio es obligatoria"),
  body("startDate")
    .isISO8601()
    .withMessage("La fecha de inicio no tiene un formato válido")
    .toDate(),
  body("endDate")
    .isISO8601()
    .withMessage("La fecha de fin no tiene un formato válido")
    .toDate()
    .custom((value, { req }) => {
      const startDate = req.body.startDate;
      if (startDate && value && value < startDate) {
        throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
      }
      return true;
    }),
  handleInputErrors,
  StudyController.updateStudy
);

router.delete("/:userId/studies/:studyId", StudyController.deleteStudy);

export default router;
