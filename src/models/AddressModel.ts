import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAddress extends Document {
  street: string;
  city: string;
  province: string;
  country: string;
  user: Types.ObjectId;
}

const AddressSchema: Schema = new Schema(
  {
    street: {
      type: String,
      trim: true,
      required: true
    },
    city: {
      type: String,
      trim: true,
      required: true
    },
    province: {
      type: String,
      trim: true,
      required: true
    },
    country: {
      type: String,
      trim: true,
      required: true
    },
    user: {
      type: Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Address = mongoose.model<IAddress>("Address", AddressSchema);
export default Address;
