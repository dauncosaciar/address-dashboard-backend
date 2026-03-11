import { Request, Response } from "express";
import User from "../models/UserModel";
import { checkPassword, hashPassword } from "../utils/auth";

export class ProfileController {
  static updateProfile = async (req: Request, res: Response) => {
    try {
      const { name, lastName, email } = req.body;
      const userExists = await User.findOne({ email });

      if (
        userExists &&
        userExists._id.toString() !== req.authenticatedUser._id.toString()
      ) {
        const error = new Error("El email ingresado ya está en uso por otro Usuario");
        res.status(409).json({ error: error.message });
        return;
      }

      req.authenticatedUser.name = name;
      req.authenticatedUser.lastName = lastName;
      req.authenticatedUser.email = email;

      await req.authenticatedUser.save();
      res.status(200).json({ message: "Perfil actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el perfil" });
    }
  };

  static updateCurrentPassword = async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.authenticatedUser._id);
      const correctPassword = await checkPassword(currentPassword, user.password);

      if (!correctPassword) {
        const error = new Error("Tu contraseña actual no es correcta");
        res.status(401).json({ error: error.message });
        return;
      }

      user.password = await hashPassword(newPassword);
      await user.save();
      res.status(200).json({ message: "Contraseña modificada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la contraseña" });
    }
  };
}
