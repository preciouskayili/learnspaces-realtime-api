// Import necessary modules
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { hocuspocusServer } from "./services/hocuspocus";
import router from "./routes";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import rateLimit from "express-rate-limit";
import compression from "compression";
import dotenv from "dotenv";

// Load environment variables from .env file (if applicable)
dotenv.config();

// Initialize Express app
const app = express();

// Security Headers
app.use(helmet());

// Request Logging
app.use(morgan("combined"));

// Enable Compression
app.use(compression());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN || "*"],
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 86400,
  })
);

// Middleware: Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum number of requests per IP within the window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Apply rate limiting to all API routes
app.use(`/${process.env.API_VERSION}/`, apiLimiter, router);

// 404 Handler
app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ message: "Endpoint Not Found" });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Define the port from environment variables or default to 3000
const APP_PORT = process.env.PORT || 3000;

console.log(`Server is running on port ${APP_PORT}`);

// Create an HTTP server
const server = createServer(app);

// Start the Express server
server.listen(APP_PORT, () => {
  console.log(`Express server listening on port ${APP_PORT}`);
});

// Initialize and start the Hocuspocus server
hocuspocusServer.listen();
