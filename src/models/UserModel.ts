import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IAddress } from "./AddressModel";
import { IStudy } from "./StudyModel";

const userRoles = {
  ADMIN: "admin",
  USER: "user"
} as const;

export type UserRoles = (typeof userRoles)[keyof typeof userRoles];

export interface IUser extends Document {
  name: string;
  lastName: string;
  role: UserRoles;
  email: string;
  password: string;
  addresses: PopulatedDoc<IAddress & Document>[];
  studies: PopulatedDoc<IStudy & Document>[];
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.USER
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    addresses: [
      {
        type: Types.ObjectId,
        ref: "Address"
      }
    ],
    studies: [
      {
        type: Types.ObjectId,
        ref: "Study"
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
