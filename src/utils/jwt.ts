import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type UserPayload = {
  _id: Types.ObjectId;
};

export const generateJwt = (payload: UserPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  return token;
};
