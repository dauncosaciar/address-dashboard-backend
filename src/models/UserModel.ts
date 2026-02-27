import mongoose, { Schema, Document, Types } from "mongoose";

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
    }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
