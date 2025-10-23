import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

export class MetricsService {
  private registry: Registry;
  public httpRequestDuration: Histogram;
  public httpRequestTotal: Counter;
  public httpRequestErrors: Counter;
  public activeConnections: Gauge;
  public databaseConnectionPool: Gauge;
  public customMetrics: Map<string, Counter | Histogram | Gauge>;

  constructor() {
    this.registry = new Registry();
    this.customMetrics = new Map();

    collectDefaultMetrics({
      register: this.registry,
      prefix: 'platform_',
      gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 5],
      registers: [this.registry],
    });

    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.httpRequestErrors = new Counter({
      name: 'http_request_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'error_type'],
      registers: [this.registry],
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      registers: [this.registry],
    });

    this.databaseConnectionPool = new Gauge({
      name: 'database_connection_pool_size',
      help: 'Current database connection pool size',
      labelNames: ['state'],
      registers: [this.registry],
    });
  }

  recordHttpRequest(method: string, route: string, statusCode: number, durationSeconds: number) {
    this.httpRequestDuration.observe(
      { method, route, status_code: statusCode.toString() },
      durationSeconds
    );
    this.httpRequestTotal.inc({ method, route, status_code: statusCode.toString() });
  }

  recordHttpError(method: string, route: string, errorType: string) {
    this.httpRequestErrors.inc({ method, route, error_type: errorType });
  }

  incrementActiveConnections() {
    this.activeConnections.inc();
  }

  decrementActiveConnections() {
    this.activeConnections.dec();
  }

  setDatabasePoolMetrics(idle: number, active: number, waiting: number) {
    this.databaseConnectionPool.set({ state: 'idle' }, idle);
    this.databaseConnectionPool.set({ state: 'active' }, active);
    this.databaseConnectionPool.set({ state: 'waiting' }, waiting);
  }

  createCounter(name: string, help: string, labelNames: string[] = []): Counter {
    const counter = new Counter({
      name,
      help,
      labelNames,
      registers: [this.registry],
    });
    this.customMetrics.set(name, counter);
    return counter;
  }

  createHistogram(
    name: string,
    help: string,
    labelNames: string[] = [],
    buckets?: number[]
  ): Histogram {
    const histogram = new Histogram({
      name,
      help,
      labelNames,
      buckets,
      registers: [this.registry],
    });
    this.customMetrics.set(name, histogram);
    return histogram;
  }

  createGauge(name: string, help: string, labelNames: string[] = []): Gauge {
    const gauge = new Gauge({
      name,
      help,
      labelNames,
      registers: [this.registry],
    });
    this.customMetrics.set(name, gauge);
    return gauge;
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getRegistry(): Registry {
    return this.registry;
  }
}

export const metricsService = new MetricsService();
