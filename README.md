# Platform Compliance & Observability Service

A production-ready platform with comprehensive compliance, observability, and security features.

## Features

### 🔍 Observability
- **Centralized Logging**: Structured logging with Pino, correlation IDs, and automatic redaction
- **Metrics**: Prometheus-compatible metrics with custom metric support
- **Distributed Tracing**: OpenTelemetry integration with Jaeger/OTLP exporters
- **Health Checks**: Liveness, readiness, and custom health checks

### 🔐 Security & Compliance
- **Field-level Encryption**: AES-256-GCM encryption for sensitive data
- **Data Masking**: Built-in masking for PII (emails, SSN, credit cards)
- **Secrets Management**: HashiCorp Vault integration
- **Audit Trail**: Comprehensive audit logging with export capabilities
- **Security Scanning**: ESLint security plugin, Snyk integration

### 🚀 Production Ready
- **Docker Support**: Multi-stage builds with security best practices
- **Kubernetes Manifests**: Complete K8s deployment with HPA, network policies
- **Backup/Restore**: Automated database backup scripts
- **Monitoring**: Prometheus, Grafana integration
- **High Availability**: Auto-scaling, health checks, graceful shutdown

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 15
- Redis >= 7
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd platform-compliance-observability

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate encryption keys
echo "ENCRYPTION_MASTER_KEY=$(openssl rand -base64 32)" >> .env
echo "ENCRYPTION_SALT=$(openssl rand -base64 32)" >> .env

# Build the project
npm run build

# Start the service
npm start
```

### Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Kubernetes Deployment

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -l app=platform-service

# View logs
kubectl logs -f -l app=platform-service

# Port forward for local access
kubectl port-forward svc/platform-service 3000:80
```

## API Endpoints

### Health & Monitoring
- `GET /health` - Overall health check
- `GET /health/liveness` - Kubernetes liveness probe
- `GET /health/readiness` - Kubernetes readiness probe
- `GET /metrics` - Prometheus metrics

### Audit
- `GET /audit/export` - Export audit logs (JSON/CSV)
  - Query params: `format`, `eventType`, `userId`, `startDate`, `endDate`
- `GET /audit/retention` - Get retention policy
- `POST /audit/cleanup` - Cleanup old audit events

## Configuration

### Environment Variables

See `.env.example` for all available configuration options.

### Logging

Logs are structured JSON with automatic correlation IDs:

```typescript
import { createLogger } from './logging/logger';

const logger = createLogger({ userId: '123' });
logger.info('User action', { action: 'login' });
```

### Metrics

Custom metrics can be created:

```typescript
import { metricsService } from './metrics/prometheus';

const counter = metricsService.createCounter(
  'custom_events_total',
  'Total custom events'
);
counter.inc();
```

### Audit Logging

```typescript
import { auditLogger, AuditEventType } from './audit/audit-logger';

auditLogger.logUserAction(
  'user-123',
  'data-access',
  'customer',
  'cust-456'
);
```

### Encryption

```typescript
import { fieldEncryption } from './security/encryption';

const encrypted = fieldEncryption.encryptField('sensitive-data', 'context');
const decrypted = fieldEncryption.decryptField(encrypted, 'context');
```

## Security

### Best Practices Implemented

1. **Secrets Management**: All secrets via environment variables or Vault
2. **Encryption**: AES-256-GCM for field-level encryption
3. **Data Masking**: Automatic PII redaction in logs
4. **Audit Trail**: Complete audit logging with retention
5. **Dependency Scanning**: Snyk integration for vulnerability detection
6. **Static Analysis**: ESLint with security plugin
7. **Container Security**: Non-root user, read-only filesystem
8. **Network Policies**: Kubernetes network isolation

### Security Scanning

```bash
# Run security audit
npm run security:audit

# Run Snyk scan (requires Snyk CLI)
npm run security:scan

# Run static analysis
npm run security:sast
```

## Backup & Restore

### Database Backup

```bash
# Manual backup
npm run backup:db

# Automated backup (configure in crontab)
0 2 * * * /path/to/project/scripts/backup-restore/backup-db.sh
```

### Database Restore

```bash
# List available backups
ls -lh backups/

# Restore from backup
npm run restore:db backups/backup_platform_db_20231225_020000.sql.gz
```

## Monitoring

### Prometheus Metrics

The service exposes metrics at `/metrics`:
- HTTP request duration and count
- Error rates
- Active connections
- Memory and CPU usage
- Custom business metrics

### Grafana Dashboards

Pre-configured dashboards available in `monitoring/grafana/dashboards/`.

### Alerts

Prometheus alerts configured in `monitoring/alerts.yml`:
- High error rate
- High latency
- Service down
- Resource exhaustion

## Compliance

### Data Retention

- Audit logs: 90 days (configurable via `AUDIT_RETENTION_DAYS`)
- Database backups: 30 days (configurable via `BACKUP_RETENTION_DAYS`)

### GDPR Compliance

- Right to access: Audit export API
- Right to erasure: Documented procedures
- Data encryption: Field-level encryption
- Audit trail: Complete activity logging

## Disaster Recovery

See `docs/disaster-recovery-runbook.md` for complete procedures.

### RTO/RPO Targets

- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 24 hours (daily backups)

## Troubleshooting

### Common Issues

1. **Service won't start**
   - Check environment variables
   - Verify database connectivity
   - Check logs: `docker-compose logs app`

2. **High memory usage**
   - Check `/metrics` for memory stats
   - Review audit log retention
   - Scale horizontally

3. **Health checks failing**
   - Check `/health` for detailed status
   - Verify dependencies (DB, Redis)

## Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Run linting and type checks

## License

MIT
