import { NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { Logger } from "./logger";


function tracingMiddleware(req: Request, res: Response, next: NextFunction): void {
    const tracingId = req.headers['X-Tracing-ID'] as string || uuidv4();
    Logger.setTracingId(tracingId, () => {
      next();
    });
  }

export { tracingMiddleware };
