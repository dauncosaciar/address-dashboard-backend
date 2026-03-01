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

  static getUserById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).select(
        "_id name lastName role email password addresses studies"
      );

      if (!user) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      user.name = req.body.name;
      user.lastName = req.body.lastName;
      user.role = req.body.role;
      user.email = req.body.email;
      user.password = req.body.password;

      await user.save();
      res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  };
}
