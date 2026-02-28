import { Request, Response } from "express";
import User from "../models/UserModel";

export class UserController {
  static createUser = async (req: Request, res: Response) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  };

  static getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find({}).select("_id name lastName role email");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  };
}
