import { Logger, createLogger } from '../logging/logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = createLogger({ service: 'test-service' });
  });

  it('should create a logger with context', () => {
    const context = logger.getContext();
    expect(context.service).toBe('test-service');
    expect(context.correlationId).toBeDefined();
  });

  it('should create child logger with merged context', () => {
    const childLogger = logger.child({ userId: 'user-123' });
    const context = childLogger.getContext();
    expect(context.service).toBe('test-service');
    expect(context.userId).toBe('user-123');
  });

  it('should set correlation ID', () => {
    const testId = 'test-correlation-id';
    logger.setCorrelationId(testId);
    expect(logger.getContext().correlationId).toBe(testId);
  });

  it('should log info messages', () => {
    expect(() => {
      logger.info('Test info message', { data: 'test' });
    }).not.toThrow();
  });

  it('should log error messages', () => {
    const error = new Error('Test error');
    expect(() => {
      logger.error('Test error message', error);
    }).not.toThrow();
  });

  it('should log warn messages', () => {
    expect(() => {
      logger.warn('Test warning message');
    }).not.toThrow();
  });

  it('should log debug messages', () => {
    expect(() => {
      logger.debug('Test debug message');
    }).not.toThrow();
  });
});
