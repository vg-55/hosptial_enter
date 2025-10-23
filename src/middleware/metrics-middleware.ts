import { Request, Response, NextFunction } from 'express';
import { metricsService } from '../metrics/prometheus';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  metricsService.incrementActiveConnections();

  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    const route = req.route?.path || req.path || 'unknown';
    
    metricsService.recordHttpRequest(
      req.method,
      route,
      res.statusCode,
      duration
    );

    metricsService.decrementActiveConnections();
  });

  res.on('error', (error) => {
    const route = req.route?.path || req.path || 'unknown';
    metricsService.recordHttpError(
      req.method,
      route,
      error.name || 'UnknownError'
    );
  });

  next();
};
