import { Request, Response } from "express";
import Address from "../models/AddressModel";

export class AddressController {
  static createAddress = async (req: Request, res: Response) => {
    try {
      const address = new Address(req.body);
      address.user = req.user._id;
      req.user.addresses.push(address._id);
      await Promise.allSettled([address.save(), req.user.save()]);
      res.status(201).json({ message: "Dirección creada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al crear la dirección" });
    }
  };
}
