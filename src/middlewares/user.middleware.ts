import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import User, { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const validateUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId.toString())) {
      const error = new Error("ID de usuario no válido");
      res.status(400).json({ error: error.message });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error al validar el ID del usuario" });
  }
};

export const userExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el usuario" });
  }
};
