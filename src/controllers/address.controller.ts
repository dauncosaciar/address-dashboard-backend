import { Request, Response } from "express";
import Address from "../models/address.model";

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

  static getUserAddresses = async (req: Request, res: Response) => {
    try {
      const addresses = await Address.find({ user: req.user._id }).select(
        "_id street city province country user"
      );
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las direcciones" });
    }
  };

  static getAddressById = async (req: Request, res: Response) => {
    try {
      const { addressId } = req.params;
      const address = await Address.findById(addressId).select(
        "_id street city province country user"
      );

      if (!address) {
        const error = new Error("Dirección no encontrada");
        res.status(404).json({ error: error.message });
        return;
      }

      res.json(address);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la dirección" });
    }
  };

  static updateAddress = async (req: Request, res: Response) => {
    try {
      req.address.street = req.body.street;
      req.address.city = req.body.city;
      req.address.province = req.body.province;
      req.address.country = req.body.country;
      await req.address.save();
      res.status(200).json({ message: "Dirección actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la dirección" });
    }
  };

  static deleteAddress = async (req: Request, res: Response) => {
    try {
      req.user.addresses = req.user.addresses.filter(
        address => address.toString() !== req.address._id.toString()
      );

      await Promise.allSettled([req.address.deleteOne(), req.user.save()]);
      res.status(200).json({ message: "Dirección eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la dirección" });
    }
  };
}
