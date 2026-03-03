import { Request, Response } from "express";
import Study from "../models/StudyModel";

export class StudyController {
  static createStudy = async (req: Request, res: Response) => {
    try {
      res.json({ message: "Desde createStudy()" });
    } catch (error) {
      res.status(500).json({ error: "Error al crear el estudio" });
    }
  };
}
