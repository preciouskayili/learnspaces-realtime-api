import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import expressWebsockets from "express-ws";
import { hocuspocusServer } from "./services/hocuspocus";
import router from "./routes";
import helmet from "helmet";
import morgan from "morgan";
import websocketService from "./services/websocketService"; // Import WebSocket service
import rateLimit from "express-rate-limit";
import compression from "compression";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express app with WebSocket support
const apiVersion = process.env.API_VERSION || "v1";
const { app } = expressWebsockets(express());

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
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
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});
``;

// WebSocket Route for Collaboration
app.ws(`/${apiVersion}/collaboration`, (websocket, request) => {
  hocuspocusServer.handleConnection(websocket, request);
});

// Apply rate limiting and API routes
// app.use(`/${apiVersion}/websocket`, websocketService);
websocketService();
app.use(`/${apiVersion}/`, apiLimiter, router);

// 404 Handler
app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ message: "Endpoint Not Found" });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  if (!res.headersSent) {
    // Prevent sending headers if already sent
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the Express server
const APP_PORT = process.env.PORT || 3000;
app.listen(APP_PORT, () => {
  console.log(`Express server listening on port ${APP_PORT}`);
});
