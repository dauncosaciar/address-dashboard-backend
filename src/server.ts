import express from "express";
import dotenv from "dotenv";

// Allow reading .env files
dotenv.config();

// Create express application
const app = express();

// Allow receiving JSON data in req.body
app.use(express.json());

// API routes
// Include api routes here

export default app;
