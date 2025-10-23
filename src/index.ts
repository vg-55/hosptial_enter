import express, { Request, Response } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import { tracingService } from './tracing/opentelemetry';
import { defaultLogger, createLogger } from './logging/logger';
import { httpLogger } from './logging/http-logger';
import { metricsService } from './metrics/prometheus';
import { healthCheckService, MemoryHealthChecker, HealthStatus } from './health/health-check';
import { auditLogger, AuditEventType, AuditSeverity } from './audit/audit-logger';
import { metricsMiddleware } from './middleware/metrics-middleware';
import { correlationIdMiddleware } from './middleware/correlation-id';

dotenv.config();

tracingService.initialize();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(correlationIdMiddleware);
app.use(httpLogger);
app.use(metricsMiddleware);

healthCheckService.registerChecker(new MemoryHealthChecker(0.9));

app.get('/health', async (req: Request, res: Response) => {
  try {
    const healthCheck = await healthCheckService.performHealthCheck();
    const statusCode = healthCheck.status === HealthStatus.HEALTHY ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    defaultLogger.error('Health check failed', error);
    res.status(503).json({
      status: HealthStatus.UNHEALTHY,
      error: 'Health check failed',
    });
  }
});

app.get('/health/liveness', async (req: Request, res: Response) => {
  try {
    const liveness = await healthCheckService.performLivenessCheck();
    res.status(200).json(liveness);
  } catch (error) {
    defaultLogger.error('Liveness check failed', error);
    res.status(503).json({
      status: HealthStatus.UNHEALTHY,
      error: 'Liveness check failed',
    });
  }
});

app.get('/health/readiness', async (req: Request, res: Response) => {
  try {
    const readiness = await healthCheckService.performReadinessCheck();
    const statusCode = readiness.status === HealthStatus.HEALTHY ? 200 : 503;
    res.status(statusCode).json(readiness);
  } catch (error) {
    defaultLogger.error('Readiness check failed', error);
    res.status(503).json({
      status: HealthStatus.UNHEALTHY,
      error: 'Readiness check failed',
    });
  }
});

app.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = await metricsService.getMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    defaultLogger.error('Failed to retrieve metrics', error);
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

app.get('/audit/export', async (req: Request, res: Response) => {
  try {
    const format = req.query.format as string || 'json';
    const eventType = req.query.eventType as string;
    const userId = req.query.userId as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const filter = {
      eventType: eventType as any,
      userId,
      startDate,
      endDate,
    };

    let exportData: string;
    let contentType: string;

    if (format === 'csv') {
      exportData = auditLogger.exportEventsCSV(filter);
      contentType = 'text/csv';
      res.setHeader('Content-Disposition', 'attachment; filename=audit-log.csv');
    } else {
      exportData = auditLogger.exportEvents(filter);
      contentType = 'application/json';
      res.setHeader('Content-Disposition', 'attachment; filename=audit-log.json');
    }

    auditLogger.logEvent({
      eventType: AuditEventType.DATA_EXPORTED,
      severity: AuditSeverity.INFO,
      actor: {
        userId: req.headers['x-user-id'] as string,
        ipAddress: req.ip,
      },
      resource: { type: 'audit-log' },
      action: 'export',
      result: 'success',
      metadata: { format, filter },
    });

    res.set('Content-Type', contentType);
    res.send(exportData);
  } catch (error) {
    defaultLogger.error('Failed to export audit log', error);
    res.status(500).json({ error: 'Failed to export audit log' });
  }
});

app.get('/audit/retention', (req: Request, res: Response) => {
  try {
    const policy = auditLogger.getRetentionPolicy();
    res.json(policy);
  } catch (error) {
    defaultLogger.error('Failed to retrieve retention policy', error);
    res.status(500).json({ error: 'Failed to retrieve retention policy' });
  }
});

app.post('/audit/cleanup', (req: Request, res: Response) => {
  try {
    const removedCount = auditLogger.cleanupOldEvents();
    
    auditLogger.logEvent({
      eventType: AuditEventType.SYSTEM_EVENT,
      severity: AuditSeverity.INFO,
      actor: {
        userId: req.headers['x-user-id'] as string,
        ipAddress: req.ip,
      },
      resource: { type: 'audit-log' },
      action: 'cleanup',
      result: 'success',
      metadata: { removedCount },
    });

    res.json({
      success: true,
      removedCount,
      message: `Cleaned up ${removedCount} old audit events`,
    });
  } catch (error) {
    defaultLogger.error('Failed to cleanup audit log', error);
    res.status(500).json({ error: 'Failed to cleanup audit log' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Platform Compliance & Observability Service',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'running',
    endpoints: {
      health: '/health',
      liveness: '/health/liveness',
      readiness: '/health/readiness',
      metrics: '/metrics',
      auditExport: '/audit/export',
      auditRetention: '/audit/retention',
    },
  });
});

app.use((err: Error, req: Request, res: Response, next: any) => {
  const logger = createLogger({
    correlationId: req.headers['x-correlation-id'] as string,
  });

  logger.error('Unhandled error', err, {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
  });

  auditLogger.logEvent({
    eventType: AuditEventType.SYSTEM_EVENT,
    severity: AuditSeverity.CRITICAL,
    actor: {
      userId: req.headers['x-user-id'] as string,
      ipAddress: req.ip,
    },
    resource: { type: 'system' },
    action: 'error',
    result: 'failure',
    metadata: {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
    },
  });

  res.status(500).json({
    error: 'Internal Server Error',
    correlationId: req.headers['x-correlation-id'],
  });
});

const server = app.listen(port, () => {
  defaultLogger.info(`Server started successfully`, {
    port,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
  });

  auditLogger.logEvent({
    eventType: AuditEventType.SYSTEM_EVENT,
    severity: AuditSeverity.INFO,
    actor: {},
    resource: { type: 'system' },
    action: 'startup',
    result: 'success',
    metadata: { port },
  });
});

process.on('SIGTERM', () => {
  defaultLogger.info('SIGTERM received, shutting down gracefully');
  
  server.close(() => {
    defaultLogger.info('Server closed');
    tracingService.shutdown().then(() => {
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  defaultLogger.info('SIGINT received, shutting down gracefully');
  
  server.close(() => {
    defaultLogger.info('Server closed');
    tracingService.shutdown().then(() => {
      process.exit(0);
    });
  });
});

export default app;
