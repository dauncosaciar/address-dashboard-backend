import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectToDatabase } from "./config/db.config";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import userRoutes from "./routes/userRoutes";
import addressRoutes from "./routes/addressRoutes";
import studyRoutes from "./routes/studyRoutes";

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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", addressRoutes);
app.use("/api/v1/users", studyRoutes);

export default app;
