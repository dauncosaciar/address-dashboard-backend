import { Request, Response } from "express";
import Study from "../models/study.model";

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

  static updateStudy = async (req: Request, res: Response) => {
    try {
      req.study.title = req.body.title;
      req.study.institution = req.body.institution;
      req.study.startDate = req.body.startDate;
      req.study.endDate = req.body.endDate;
      await req.study.save();
      res.status(200).json({ message: "Estudio actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el estudio" });
    }
  };

  static deleteStudy = async (req: Request, res: Response) => {
    try {
      req.user.studies = req.user.studies.filter(
        study => study.toString() !== req.study._id.toString()
      );

      await Promise.allSettled([req.study.deleteOne(), req.user.save()]);
      res.status(200).json({ message: "Estudio eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el estudio" });
    }
  };
}
