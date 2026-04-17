import { Request, Response, NextFunction } from "express";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.authenticatedUser.role !== "admin") {
    const error = new Error("Acceso restringido a administradores");
    res.status(403).json({ error: error.message });
    return;
  }

  next();
};
