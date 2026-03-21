import { Request, Response } from "express";
import User from "../models/user.model";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJwt } from "../utils/jwt";

export class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
      const { name, lastName, email, password } = req.body;
      const userExists = await User.findOne({ email });

      if (userExists) {
        const error = new Error("El email ingresado ya está en uso por otro Usuario");
        res.status(409).json({ error: error.message });
        return;
      }

      const user = new User({ name, lastName, email, password });
      user.password = await hashPassword(password);
      await user.save();

      res
        .status(201)
        .json({ message: "Cuenta creada correctamente, ya puedes iniciar sesión" });
    } catch (error) {
      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      // Check if user exists
      if (!user) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // Check user password
      const correctPassword = await checkPassword(password, user.password);

      if (!correctPassword) {
        const error = new Error("Contraseña incorrecta");
        res.status(401).json({ error: error.message });
        return;
      }

      // Generate JWT and send it to client
      const authToken = generateJwt({ _id: user._id });
      res.send({ token: authToken });
    } catch (error) {
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  };

  static getAuthenticatedUser = async (req: Request, res: Response) => {
    res.json({ data: req.authenticatedUser });
    return;
  };
}
