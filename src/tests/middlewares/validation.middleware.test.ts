import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { handleInputErrors } from "../../middlewares/validation.middleware";

jest.mock("express-validator", () => ({
  validationResult: jest.fn()
}));

describe("VALIDATION MIDDLEWARE", () => {
  let req: Request;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  it("should return a 400 response and array errors if input validation fails", () => {
    const mockErrors = [
      {
        type: "field",
        msg: "La provincia o estado de la dirección es obligatoria",
        path: "province",
        location: "body"
      },
      {
        type: "field",
        msg: "El país de la dirección es obligatorio",
        path: "country",
        location: "body"
      }
    ];

    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => mockErrors
    });

    handleInputErrors(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: mockErrors });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next if there are no input validation errors", () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });

    handleInputErrors(req, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
