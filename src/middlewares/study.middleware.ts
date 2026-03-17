import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Study, { IStudy } from "../models/study.model";

declare global {
  namespace Express {
    interface Request {
      study: IStudy;
    }
  }
}

export const validateStudyId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studyId } = req.params;

    if (!Types.ObjectId.isValid(studyId.toString())) {
      const error = new Error("ID de estudio no válido");
      res.status(400).json({ error: error.message });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error al validar el ID del estudio" });
  }
};

export const studyExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studyId } = req.params;
    const study = await Study.findById(studyId);

    if (!study) {
      const error = new Error("Estudio no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }

    req.study = study;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el estudio" });
  }
};

export const studyBelongsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.study.user.toString() !== req.user._id.toString()) {
    const error = new Error("El estudio no pertenece al usuario");
    res.status(403).json({ error: error.message });
    return;
  }

  next();
};
