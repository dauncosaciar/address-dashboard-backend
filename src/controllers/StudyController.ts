import { Request, Response } from "express";
import Study from "../models/StudyModel";

export class StudyController {
  static createStudy = async (req: Request, res: Response) => {
    try {
      const study = new Study(req.body);
      study.user = req.user._id;
      req.user.studies.push(study._id);
      await Promise.allSettled([study.save(), req.user.save()]);
      res.status(201).json({ message: "Estudio creado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al crear el estudio" });
    }
  };

  static getUserStudies = async (req: Request, res: Response) => {
    try {
      const studies = await Study.find({ user: req.user._id }).select(
        "_id title institution startDate endDate user"
      );
      res.json(studies);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los estudios" });
    }
  };

  static getStudyById = async (req: Request, res: Response) => {
    try {
      const { studyId } = req.params;
      const study = await Study.findById(studyId).select(
        "_id title institution startDate endDate user"
      );

      if (!study) {
        const error = new Error("Estudio no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      res.json(study);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el estudio" });
    }
  };
}
