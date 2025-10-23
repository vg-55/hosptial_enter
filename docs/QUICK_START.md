# Quick Start Guide

Get the platform up and running in 5 minutes.

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

## Installation

### 1. Clone and Install

```bash
git clone <repository-url>
cd platform-compliance-observability
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Generate encryption keys
echo "ENCRYPTION_MASTER_KEY=$(openssl rand -base64 32)" >> .env
echo "ENCRYPTION_SALT=$(openssl rand -base64 32)" >> .env
```

### 3. Start Services

#### Option A: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Check status
docker-compose ps
```

#### Option B: Local Development

```bash
# Start dependencies only
docker-compose up -d postgres redis jaeger

# Run application locally
npm run dev
```

## Verify Installation

### 1. Check Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "checks": {
    "memory": {
      "status": "healthy",
      "message": "Memory usage normal: 25.50%"
    }
  },
  "uptime": 10,
  "version": "1.0.0"
}
```

### 2. Check Metrics

```bash
curl http://localhost:3000/metrics
```

### 3. View Dashboards

- **Application**: http://localhost:3000
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)
- **Jaeger**: http://localhost:16686

## Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | API information |
| `GET /health` | Health check |
| `GET /health/liveness` | Liveness probe |
| `GET /health/readiness` | Readiness probe |
| `GET /metrics` | Prometheus metrics |
| `GET /audit/export` | Export audit logs |
| `GET /audit/retention` | Retention policy |
| `POST /audit/cleanup` | Cleanup old events |

## Common Commands

```bash
# Development
npm run dev              # Start in dev mode
npm run build            # Build for production
npm start                # Start production build

# Testing
npm test                 # Run tests
npm run lint             # Lint code
npm run typecheck        # Type check

# Backup/Restore
npm run backup:db        # Backup database
npm run restore:db       # Restore database

# Security
npm run security:audit   # Security audit
npm run security:scan    # Vulnerability scan
```

## Environment Variables

### Required

```bash
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=platform_db
DB_USER=postgres
DB_PASSWORD=postgres
ENCRYPTION_MASTER_KEY=<base64-key>
ENCRYPTION_SALT=<base64-salt>
```

### Optional

```bash
LOG_LEVEL=info
SERVICE_NAME=platform-service
REDIS_HOST=localhost
REDIS_PORT=6379
VAULT_ENABLED=false
OTEL_EXPORTER_TYPE=console
AUDIT_RETENTION_DAYS=90
```

## Next Steps

1. **Review Documentation**: See `docs/` folder
2. **Configure Monitoring**: Set up Grafana dashboards
3. **Set Up Alerts**: Configure Prometheus alerts
4. **Review Security**: Check `docs/secrets-management.md`
5. **Plan Deployment**: See `docs/operational-runbook.md`

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check database is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

## Getting Help

- **Documentation**: `docs/` folder
- **Issues**: GitHub Issues
- **Examples**: `src/__tests__/` folder
- **Architecture**: `docs/architecture.md`

## Production Deployment

See detailed guides:
- **Docker**: `docker-compose.yml`
- **Kubernetes**: `k8s/` folder
- **Deployment**: `docs/operational-runbook.md`
- **DR**: `docs/disaster-recovery-runbook.md`
