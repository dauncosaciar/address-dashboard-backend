import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectToDatabase } from "./config/db";
import userRoutes from "./routes/userRoutes";

// Allow reading .env files
dotenv.config();

// Connect to database
connectToDatabase();

// Create express application
const app = express();

// Logging
app.use(morgan("dev"));

// Allow receiving JSON data in req.body
app.use(express.json());

// API routes
app.use("/api/v1/users", userRoutes);

export default app;
