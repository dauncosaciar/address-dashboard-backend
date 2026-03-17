import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers.authorization;

    if (!bearer) {
      const error = new Error("No autorizado");
      res.status(401).json({ error: error.message });
      return;
    }

    const [, token] = bearer.split(" ");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded === "object" && decoded._id) {
      const user = await User.findById(decoded._id).select(
        "_id name lastName role email"
      );

      if (user) {
        req.authenticatedUser = user;
        next();
      } else {
        res.status(401).json({ error: "Token no válido" });
        return;
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Token no válido" });
  }
};
