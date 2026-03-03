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
}
