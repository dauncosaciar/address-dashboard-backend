import { Request, Response, NextFunction } from "express";
import { requireAdmin } from "../../middlewares/role.middleware";

describe("ROLE MIDDLEWARE", () => {
  let req: Request;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      authenticatedUser: {}
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("requireAdmin", () => {
    it("should call next if authenticated user role is 'admin'", () => {
      req.authenticatedUser.role = "admin";

      requireAdmin(req, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return a 403 response if authenticated user role is 'user'", () => {
      req.authenticatedUser.role = "user";

      requireAdmin(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Acceso restringido a administradores"
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
