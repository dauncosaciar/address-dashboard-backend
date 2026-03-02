import { Request, Response } from "express";

export class AddressController {
  static createAddress = async (req: Request, res: Response) => {
    try {
    } catch (error) {
      res.status(500).json({ error: "Error al crear la dirección" });
    }
  };
}
