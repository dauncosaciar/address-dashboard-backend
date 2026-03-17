import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectToDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.host}:${connection.port}`;
    console.log(colors.blue(`MongoDB connected on: ${url}`));
  } catch (error) {
    console.log(colors.red("Error connecting to MongoDB"));
    console.log(error);
    exit(1);
  }
};
