import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStudy extends Document {
  title: string;
  institution: string;
  startDate: Date;
  endDate: Date;
  user: Types.ObjectId;
}

const StudySchema: Schema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    },
    institution: {
      type: String,
      trim: true,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    user: {
      type: Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Study = mongoose.model<IStudy>("Study", StudySchema);
export default Study;
