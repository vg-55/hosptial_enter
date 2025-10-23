import { defaultLogger } from '../logging/logger';

export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
}

export interface HealthCheckResult {
  status: HealthStatus;
  checks: {
    [key: string]: {
      status: HealthStatus;
      message?: string;
      latency?: number;
      timestamp: string;
    };
  };
  uptime: number;
  timestamp: string;
  version: string;
}

export interface HealthChecker {
  name: string;
  check(): Promise<{ status: HealthStatus; message?: string; latency?: number }>;
}

export class HealthCheckService {
  private checkers: HealthChecker[] = [];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  registerChecker(checker: HealthChecker) {
    this.checkers.push(checker);
    defaultLogger.info(`Health checker registered: ${checker.name}`);
  }

  async performHealthCheck(): Promise<HealthCheckResult> {
    const checks: HealthCheckResult['checks'] = {};
    let overallStatus = HealthStatus.HEALTHY;

    for (const checker of this.checkers) {
      try {
        const startTime = Date.now();
        const result = await checker.check();
        const latency = Date.now() - startTime;

        checks[checker.name] = {
          status: result.status,
          message: result.message,
          latency: result.latency || latency,
          timestamp: new Date().toISOString(),
        };

        if (result.status === HealthStatus.UNHEALTHY) {
          overallStatus = HealthStatus.UNHEALTHY;
        } else if (result.status === HealthStatus.DEGRADED && overallStatus === HealthStatus.HEALTHY) {
          overallStatus = HealthStatus.DEGRADED;
        }
      } catch (error) {
        checks[checker.name] = {
          status: HealthStatus.UNHEALTHY,
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        };
        overallStatus = HealthStatus.UNHEALTHY;
        defaultLogger.error(`Health check failed for ${checker.name}`, error);
      }
    }

    return {
      status: overallStatus,
      checks,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
    };
  }

  async performReadinessCheck(): Promise<HealthCheckResult> {
    return this.performHealthCheck();
  }

  async performLivenessCheck(): Promise<{ status: HealthStatus; timestamp: string }> {
    return {
      status: HealthStatus.HEALTHY,
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthCheckService = new HealthCheckService();

export class DatabaseHealthChecker implements HealthChecker {
  name = 'database';
  private checkConnection: () => Promise<boolean>;

  constructor(checkConnection: () => Promise<boolean>) {
    this.checkConnection = checkConnection;
  }

  async check(): Promise<{ status: HealthStatus; message?: string }> {
    try {
      const isConnected = await this.checkConnection();
      return {
        status: isConnected ? HealthStatus.HEALTHY : HealthStatus.UNHEALTHY,
        message: isConnected ? 'Database connected' : 'Database connection failed',
      };
    } catch (error) {
      return {
        status: HealthStatus.UNHEALTHY,
        message: error instanceof Error ? error.message : 'Database check failed',
      };
    }
  }
}

export class RedisHealthChecker implements HealthChecker {
  name = 'redis';
  private checkConnection: () => Promise<boolean>;

  constructor(checkConnection: () => Promise<boolean>) {
    this.checkConnection = checkConnection;
  }

  async check(): Promise<{ status: HealthStatus; message?: string }> {
    try {
      const isConnected = await this.checkConnection();
      return {
        status: isConnected ? HealthStatus.HEALTHY : HealthStatus.UNHEALTHY,
        message: isConnected ? 'Redis connected' : 'Redis connection failed',
      };
    } catch (error) {
      return {
        status: HealthStatus.UNHEALTHY,
        message: error instanceof Error ? error.message : 'Redis check failed',
      };
    }
  }
}

export class MemoryHealthChecker implements HealthChecker {
  name = 'memory';
  private threshold: number;

  constructor(threshold: number = 0.9) {
    this.threshold = threshold;
  }

  async check(): Promise<{ status: HealthStatus; message?: string }> {
    const memUsage = process.memoryUsage();
    const heapUsedPercentage = memUsage.heapUsed / memUsage.heapTotal;

    if (heapUsedPercentage >= this.threshold) {
      return {
        status: HealthStatus.UNHEALTHY,
        message: `Memory usage critical: ${(heapUsedPercentage * 100).toFixed(2)}%`,
      };
    } else if (heapUsedPercentage >= this.threshold * 0.8) {
      return {
        status: HealthStatus.DEGRADED,
        message: `Memory usage high: ${(heapUsedPercentage * 100).toFixed(2)}%`,
      };
    }

    return {
      status: HealthStatus.HEALTHY,
      message: `Memory usage normal: ${(heapUsedPercentage * 100).toFixed(2)}%`,
    };
  }
}
