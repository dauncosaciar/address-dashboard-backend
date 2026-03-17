import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Address, { IAddress } from "../models/address.model";

declare global {
  namespace Express {
    interface Request {
      address: IAddress;
    }
  }
}

export const validateAddressId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { addressId } = req.params;

    if (!Types.ObjectId.isValid(addressId.toString())) {
      const error = new Error("ID de dirección no válido");
      res.status(400).json({ error: error.message });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error al validar el ID de la dirección" });
  }
};

export const addressExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findById(addressId);

    if (!address) {
      const error = new Error("Dirección no encontrada");
      res.status(404).json({ error: error.message });
      return;
    }

    req.address = address;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error al buscar la dirección" });
  }
};

export const addressBelongsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.address.user.toString() !== req.user._id.toString()) {
    const error = new Error("La dirección no pertenece al usuario");
    res.status(403).json({ error: error.message });
    return;
  }

  next();
};
