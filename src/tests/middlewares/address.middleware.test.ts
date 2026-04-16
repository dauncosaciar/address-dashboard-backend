import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import {
  validateAddressId,
  addressExists,
  addressBelongsToUser
} from "../../middlewares/address.middleware";
import { IUser } from "../../models/user.model";
import Address, { IAddress } from "../../models/address.model";

jest.mock("../../models/address.model");

describe("ADDRESS MIDDLEWARE", () => {
  let req: Request;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {}
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("validateAddressId", () => {
    it("should call next if addressId is valid", async () => {
      req.params = {
        addressId: new Types.ObjectId().toString()
      };

      await validateAddressId(req, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return a 400 response if addressId is invalid", async () => {
      req.params = {
        addressId: "123"
      };

      await validateAddressId(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "ID de dirección no válido"
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return a 500 response if an error occurs", async () => {
      req.params = {
        addressId: new Types.ObjectId().toString()
      };

      const spy = jest.spyOn(Types.ObjectId, "isValid").mockImplementation(() => {
        throw new Error("Test error");
      });

      await validateAddressId(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al validar el ID de la dirección"
      });

      spy.mockRestore();
    });
  });

  describe("addressExists", () => {
    it("should assign req.address if address exists, then call next", async () => {
      const mockAddress = {
        _id: new Types.ObjectId()
      };

      req.params = {
        addressId: mockAddress._id.toString()
      };

      (Address.findById as jest.Mock).mockResolvedValue(mockAddress);

      await addressExists(req, res as Response, next);

      expect(Address.findById).toHaveBeenCalledWith(mockAddress._id.toString());
      expect(req.address).toEqual(mockAddress);
      expect(next).toHaveBeenCalled();
    });

    it("should return a 404 response if address does not exist", async () => {
      req.params = {
        addressId: new Types.ObjectId().toString()
      };

      (Address.findById as jest.Mock).mockResolvedValue(null);

      await addressExists(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Dirección no encontrada"
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return a 500 response if an error occurs", async () => {
      req.params = {
        addressId: new Types.ObjectId().toString()
      };

      (Address.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

      await addressExists(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al buscar la dirección"
      });
    });
  });

  describe("addressBelongsToUser", () => {
    it("should call next if address belongs to user", async () => {
      const userId = new Types.ObjectId();

      req.user = { _id: userId } as IUser;
      req.address = { user: userId } as IAddress;

      await addressBelongsToUser(req, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return 403 if address does not belong to user", async () => {
      req.user = { _id: new Types.ObjectId() } as IUser;
      req.address = { user: new Types.ObjectId() } as IAddress;

      await addressBelongsToUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "La dirección no pertenece al usuario"
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
