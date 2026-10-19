import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import { HTTP_STATUS } from "./constants/httpConstants";

const app: Express = express();

// Middleware
app.use(morgan("combined"));
app.use(express.json());

// Health check endpoint
app.get("/api/v1/health", (_req: Request, res: Response): void => {
    res.status(HTTP_STATUS.OK).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

export default app;