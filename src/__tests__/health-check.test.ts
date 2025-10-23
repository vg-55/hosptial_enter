import { HealthCheckService, HealthStatus, HealthChecker } from '../health/health-check';

class MockHealthChecker implements HealthChecker {
  name = 'mock-checker';
  private shouldPass: boolean;

  constructor(shouldPass: boolean = true) {
    this.shouldPass = shouldPass;
  }

  async check() {
    return {
      status: this.shouldPass ? HealthStatus.HEALTHY : HealthStatus.UNHEALTHY,
      message: this.shouldPass ? 'Mock check passed' : 'Mock check failed',
    };
  }
}

describe('HealthCheckService', () => {
  let healthCheckService: HealthCheckService;

  beforeEach(() => {
    healthCheckService = new HealthCheckService();
  });

  it('should register health checker', () => {
    const checker = new MockHealthChecker();
    expect(() => {
      healthCheckService.registerChecker(checker);
    }).not.toThrow();
  });

  it('should return healthy status when all checks pass', async () => {
    const checker = new MockHealthChecker(true);
    healthCheckService.registerChecker(checker);

    const result = await healthCheckService.performHealthCheck();
    expect(result.status).toBe(HealthStatus.HEALTHY);
    expect(result.checks['mock-checker'].status).toBe(HealthStatus.HEALTHY);
  });

  it('should return unhealthy status when a check fails', async () => {
    const checker = new MockHealthChecker(false);
    healthCheckService.registerChecker(checker);

    const result = await healthCheckService.performHealthCheck();
    expect(result.status).toBe(HealthStatus.UNHEALTHY);
    expect(result.checks['mock-checker'].status).toBe(HealthStatus.UNHEALTHY);
  });

  it('should return liveness check', async () => {
    const result = await healthCheckService.performLivenessCheck();
    expect(result.status).toBe(HealthStatus.HEALTHY);
    expect(result.timestamp).toBeDefined();
  });

  it('should include uptime in health check', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const result = await healthCheckService.performHealthCheck();
    expect(result.uptime).toBeGreaterThan(0);
  });
});
