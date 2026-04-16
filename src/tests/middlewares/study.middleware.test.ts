import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import {
  validateStudyId,
  studyExists,
  studyBelongsToUser
} from "../../middlewares/study.middleware";
import { IUser } from "../../models/user.model";
import Study, { IStudy } from "../../models/study.model";

jest.mock("../../models/study.model.ts");

describe("STUDY MIDDLEWARE", () => {
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

  describe("validateStudyId", () => {
    it("should call next if studyId is valid", async () => {
      req.params = {
        studyId: new Types.ObjectId().toString()
      };

      await validateStudyId(req, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return a 400 response if studyId is invalid", async () => {
      req.params = {
        studyId: "123"
      };

      await validateStudyId(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "ID de estudio no válido"
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return a 500 response if an error occurs", async () => {
      req.params = {
        studyId: new Types.ObjectId().toString()
      };

      const spy = jest.spyOn(Types.ObjectId, "isValid").mockImplementation(() => {
        throw new Error("Test error");
      });

      await validateStudyId(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al validar el ID del estudio"
      });

      spy.mockRestore();
    });
  });

  describe("studyExists", () => {
    it("should assign req.study if study exists, then call next", async () => {
      const mockStudy = {
        _id: new Types.ObjectId()
      };

      req.params = {
        studyId: mockStudy._id.toString()
      };

      (Study.findById as jest.Mock).mockResolvedValue(mockStudy);

      await studyExists(req, res as Response, next);

      expect(Study.findById).toHaveBeenCalledWith(mockStudy._id.toString());
      expect(req.study).toEqual(mockStudy);
      expect(next).toHaveBeenCalled();
    });

    it("should return a 404 response if study does not exist", async () => {
      req.params = {
        studyId: new Types.ObjectId().toString()
      };

      (Study.findById as jest.Mock).mockResolvedValue(null);

      await studyExists(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Estudio no encontrado"
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return a 500 response if an error occurs", async () => {
      req.params = {
        studyId: new Types.ObjectId().toString()
      };

      (Study.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

      await studyExists(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error al buscar el estudio"
      });
    });
  });

  describe("studyBelongsToUser", () => {
    it("should call next if study belongs to user", async () => {
      const userId = new Types.ObjectId();

      req.user = { _id: userId } as IUser;
      req.study = { user: userId } as IStudy;

      await studyBelongsToUser(req, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return 403 if study does not belong to user", async () => {
      req.user = { _id: new Types.ObjectId() } as IUser;
      req.study = { user: new Types.ObjectId() } as IStudy;

      await studyBelongsToUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "El estudio no pertenece al usuario"
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
