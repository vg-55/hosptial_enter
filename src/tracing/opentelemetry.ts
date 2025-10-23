import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { defaultLogger } from '../logging/logger';

export class TracingService {
  private sdk: NodeSDK | null = null;

  initialize() {
    try {
      const serviceName = process.env.SERVICE_NAME || 'platform-service';
      const environment = process.env.NODE_ENV || 'development';
      const serviceVersion = process.env.APP_VERSION || '1.0.0';

      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
      });

      const traceExporter = this.getTraceExporter();
      const metricExporter = new PrometheusExporter({
        port: parseInt(process.env.PROMETHEUS_METRICS_PORT || '9464'),
      }, () => {
        defaultLogger.info('Prometheus metrics server started', {
          port: process.env.PROMETHEUS_METRICS_PORT || '9464',
        });
      });

      this.sdk = new NodeSDK({
        resource,
        traceExporter,
        metricReader: metricExporter,
        instrumentations: [
          getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-fs': {
              enabled: false,
            },
            '@opentelemetry/instrumentation-http': {
              ignoreIncomingPaths: ['/health', '/healthz', '/metrics'],
            },
          }),
        ],
      });

      this.sdk.start();
      defaultLogger.info('OpenTelemetry initialized successfully', {
        serviceName,
        environment,
        version: serviceVersion,
      });

      process.on('SIGTERM', () => {
        this.shutdown();
      });
    } catch (error) {
      defaultLogger.error('Failed to initialize OpenTelemetry', error);
      throw error;
    }
  }

  private getTraceExporter() {
    const exporterType = process.env.OTEL_EXPORTER_TYPE || 'console';

    switch (exporterType) {
      case 'jaeger':
        defaultLogger.info('Using Jaeger exporter', {
          endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
        });
        return new JaegerExporter({
          endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
        });

      case 'otlp':
        defaultLogger.info('Using OTLP HTTP exporter', {
          endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
        });
        return new OTLPTraceExporter({
          url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
        });

      case 'console':
      default:
        defaultLogger.info('Using console exporter for traces');
        return new ConsoleSpanExporter();
    }
  }

  async shutdown() {
    if (this.sdk) {
      try {
        await this.sdk.shutdown();
        defaultLogger.info('OpenTelemetry shut down successfully');
      } catch (error) {
        defaultLogger.error('Error shutting down OpenTelemetry', error);
      }
    }
  }
}

export const tracingService = new TracingService();
