import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectToDatabase } from "./config/db";

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
// Include api routes here

export default app;
