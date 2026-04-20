import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { validateUserId, userExists } from "../../middlewares/user.middleware";
import User, { IUser } from "../../models/user.model";

jest.mock("../../models/user.model");

describe("USER MIDDLEWARE", () => {
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

  describe("validateUserId", () => {
    it("should call next if userId is valid", async () => {
      req.params = {
        userId: new Types.ObjectId().toString()
      };

      await validateUserId(req, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return a 400 response if userId is invalid", async () => {
      req.params = {
        userId: "123"
      };

      await validateUserId(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "ID de usuario no válido"
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return a 500 response if an error occurs", async () => {
      req.params = {
        userId: new Types.ObjectId().toString()
      };

      const spy = jest.spyOn(Types.ObjectId, "isValid").mockImplementation(() => {
        throw new Error("Test error");
      });

      await validateUserId(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al validar el ID del usuario"
      });

      spy.mockRestore();
    });
  });

  describe("userExists", () => {
    it("should assign req.user if user exists, then call next", async () => {
      const mockUser = {
        _id: new Types.ObjectId()
      };

      req.params = {
        userId: mockUser._id.toString()
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await userExists(req, res as Response, next);

      expect(User.findById).toHaveBeenCalledWith(mockUser._id.toString());
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it("should return a 404 response if user does not exist", async () => {
      req.params = {
        userId: new Types.ObjectId().toString()
      };

      (User.findById as jest.Mock).mockResolvedValue(null);

      await userExists(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuario no encontrado"
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return a 500 response if an error occurs", async () => {
      req.params = {
        userId: new Types.ObjectId().toString()
      };

      (User.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

      await userExists(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al buscar el usuario"
      });
    });
  });
});
