import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

export interface LogContext {
  correlationId?: string;
  userId?: string;
  requestId?: string;
  service?: string;
  environment?: string;
  [key: string]: any;
}

const isProduction = process.env.NODE_ENV === 'production';

const loggerConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    bindings: (bindings) => {
      return {
        pid: bindings.pid,
        hostname: bindings.hostname,
        service: process.env.SERVICE_NAME || 'platform-service',
        environment: process.env.NODE_ENV || 'development',
      };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'token',
      'apiKey',
      'secret',
      'creditCard',
      'ssn',
      '*.password',
      '*.token',
      '*.apiKey',
      '*.secret',
    ],
    censor: '[REDACTED]',
  },
  ...(isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }),
};

const baseLogger = pino(loggerConfig);

export class Logger {
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = {
      correlationId: uuidv4(),
      ...context,
    };
  }

  private enrichLog(message: string, data?: any) {
    return {
      ...this.context,
      ...data,
      message,
    };
  }

  info(message: string, data?: any) {
    baseLogger.info(this.enrichLog(message, data));
  }

  error(message: string, error?: Error | any, data?: any) {
    baseLogger.error(
      this.enrichLog(message, {
        ...data,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : error,
      })
    );
  }

  warn(message: string, data?: any) {
    baseLogger.warn(this.enrichLog(message, data));
  }

  debug(message: string, data?: any) {
    baseLogger.debug(this.enrichLog(message, data));
  }

  trace(message: string, data?: any) {
    baseLogger.trace(this.enrichLog(message, data));
  }

  fatal(message: string, error?: Error | any, data?: any) {
    baseLogger.fatal(
      this.enrichLog(message, {
        ...data,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : error,
      })
    );
  }

  child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context });
  }

  getContext(): LogContext {
    return { ...this.context };
  }

  setCorrelationId(correlationId: string) {
    this.context.correlationId = correlationId;
  }
}

export const createLogger = (context?: LogContext): Logger => {
  return new Logger(context);
};

export const defaultLogger = createLogger({
  service: process.env.SERVICE_NAME || 'platform-service',
  environment: process.env.NODE_ENV || 'development',
});
