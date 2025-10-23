# Operational Runbook

## Overview

This runbook provides step-by-step procedures for common operational tasks and troubleshooting scenarios.

## Daily Operations

### Morning Health Check

```bash
# 1. Check service status
kubectl get pods -l app=platform-service
# Expected: All pods Running

# 2. Check health endpoint
curl https://platform-service/health
# Expected: status: "healthy"

# 3. Check metrics
curl https://platform-service/metrics | grep http_requests_total
# Expected: Increasing counter

# 4. Check recent errors
kubectl logs -l app=platform-service --since=1h | grep ERROR | wc -l
# Expected: < 10

# 5. Check database connectivity
kubectl exec -it <pod-name> -- node -e "require('pg').Client.connect()"
# Expected: Connection successful
```

### Log Review

```bash
# View recent logs
kubectl logs -l app=platform-service --tail=100

# Search for errors
kubectl logs -l app=platform-service --since=24h | grep -i error

# Check for specific correlation ID
kubectl logs -l app=platform-service | grep "correlation-id-here"

# Export logs for analysis
kubectl logs -l app=platform-service --since=24h > logs-$(date +%Y%m%d).log
```

### Metrics Review

```bash
# Check error rate
curl -s http://prometheus:9090/api/v1/query \
  --data-urlencode 'query=rate(http_request_errors_total[5m])'

# Check average latency
curl -s http://prometheus:9090/api/v1/query \
  --data-urlencode 'query=rate(http_request_duration_seconds_sum[5m])/rate(http_request_duration_seconds_count[5m])'

# Check active connections
curl -s http://prometheus:9090/api/v1/query \
  --data-urlencode 'query=active_connections'
```

## Common Tasks

### Scaling Services

```bash
# Manual scaling
kubectl scale deployment platform-service --replicas=5

# Check current replicas
kubectl get deployment platform-service

# Verify HPA status
kubectl get hpa platform-service

# Disable HPA temporarily
kubectl delete hpa platform-service

# Re-enable HPA
kubectl apply -f k8s/hpa.yaml
```

### Updating Configuration

```bash
# Update ConfigMap
kubectl edit configmap platform-config

# Update Secrets
kubectl create secret generic platform-secrets-new \
  --from-env-file=.env.production

# Rolling restart to pick up changes
kubectl rollout restart deployment/platform-service

# Verify rollout
kubectl rollout status deployment/platform-service
```

### Database Maintenance

```bash
# Backup database
npm run backup:db

# Verify backup
ls -lh backups/
gunzip -t backups/latest.sql.gz

# Analyze database
kubectl exec -it postgres-pod -- psql -U postgres -d platform_db -c "ANALYZE;"

# Check table sizes
kubectl exec -it postgres-pod -- psql -U postgres -d platform_db -c "
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC 
LIMIT 10;"

# Vacuum database
kubectl exec -it postgres-pod -- psql -U postgres -d platform_db -c "VACUUM ANALYZE;"
```

### Audit Log Management

```bash
# Export audit logs
curl "https://platform-service/audit/export?format=csv&startDate=2024-01-01" \
  -o audit-$(date +%Y%m%d).csv

# Check retention policy
curl https://platform-service/audit/retention

# Cleanup old events
curl -X POST https://platform-service/audit/cleanup

# Check audit log count
curl https://platform-service/audit/stats
```

## Troubleshooting

### High Error Rate

**Symptoms:**
- Increased 5xx responses
- Alert: HighErrorRate

**Diagnosis:**
```bash
# 1. Check error distribution
kubectl logs -l app=platform-service --since=5m | grep ERROR | \
  awk '{print $NF}' | sort | uniq -c | sort -rn

# 2. Check recent deployments
kubectl rollout history deployment/platform-service

# 3. Check resource usage
kubectl top pods -l app=platform-service

# 4. Check external dependencies
kubectl exec -it <pod-name> -- curl http://database:5432
kubectl exec -it <pod-name> -- curl http://redis:6379
```

**Resolution:**
```bash
# If recent deployment caused it
kubectl rollout undo deployment/platform-service

# If resource constrained
kubectl scale deployment platform-service --replicas=5

# If dependency issue
# Fix the dependency, then restart
kubectl rollout restart deployment/platform-service
```

### High Latency

**Symptoms:**
- Slow response times
- Alert: HighLatency

**Diagnosis:**
```bash
# 1. Check current latency
curl -s http://prometheus:9090/api/v1/query \
  --data-urlencode 'query=histogram_quantile(0.95, http_request_duration_seconds_bucket)'

# 2. Identify slow endpoints
kubectl logs -l app=platform-service | grep "responseTimeMs" | \
  awk '{print $(NF-1), $NF}' | sort -k2 -rn | head -20

# 3. Check database performance
kubectl exec -it postgres-pod -- psql -U postgres -d platform_db -c "
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;"

# 4. Check cache hit rate
redis-cli info stats | grep hit_rate
```

**Resolution:**
```bash
# Scale up
kubectl scale deployment platform-service --replicas=8

# Restart to clear any memory leaks
kubectl rollout restart deployment/platform-service

# Add database indexes (if needed)
# Review slow queries and add appropriate indexes

# Increase cache TTL (if appropriate)
kubectl edit configmap platform-config
```

### Memory Issues

**Symptoms:**
- OOMKilled pods
- Alert: HighMemoryUsage

**Diagnosis:**
```bash
# 1. Check memory usage
kubectl top pods -l app=platform-service

# 2. Check memory limits
kubectl describe pod <pod-name> | grep -A 5 "Limits:"

# 3. Check for memory leaks
# Look at memory trend over time in Grafana

# 4. Get heap dump (if needed)
kubectl exec -it <pod-name> -- node --expose-gc --heap-prof dist/index.js
```

**Resolution:**
```bash
# Immediate: Restart affected pods
kubectl delete pod <oom-killed-pod>

# Short-term: Increase memory limits
kubectl patch deployment platform-service -p \
  '{"spec":{"template":{"spec":{"containers":[{"name":"platform-service","resources":{"limits":{"memory":"1Gi"}}}]}}}}'

# Long-term: Investigate and fix memory leaks
# Review code for memory leaks
# Update dependencies
# Optimize memory usage
```

### Database Connection Issues

**Symptoms:**
- Database connection errors
- Health check failing

**Diagnosis:**
```bash
# 1. Check database pod
kubectl get pods -l app=postgres

# 2. Check database logs
kubectl logs -l app=postgres --tail=100

# 3. Test connection from app pod
kubectl exec -it <pod-name> -- psql -h postgres -U postgres -d platform_db

# 4. Check connection pool
kubectl logs -l app=platform-service | grep "connection pool"
```

**Resolution:**
```bash
# If database is down
kubectl delete pod postgres-pod
kubectl get pods -w  # Wait for restart

# If connection pool exhausted
# Increase pool size in configuration
kubectl edit configmap platform-config

# Restart application
kubectl rollout restart deployment/platform-service

# If credentials issue
# Verify secrets
kubectl get secret platform-secrets -o yaml
# Update if needed
kubectl apply -f k8s/secrets.yaml
```

### Disk Space Issues

**Symptoms:**
- Logs indicate disk full
- Write failures

**Diagnosis:**
```bash
# 1. Check disk usage
kubectl exec -it <pod-name> -- df -h

# 2. Find large files
kubectl exec -it <pod-name> -- du -sh /* | sort -h

# 3. Check log sizes
kubectl exec -it <pod-name> -- du -sh /app/logs/*
```

**Resolution:**
```bash
# Immediate: Clean up logs
kubectl exec -it <pod-name> -- find /app/logs -type f -mtime +7 -delete

# Clean up old audit logs
curl -X POST https://platform-service/audit/cleanup

# Long-term: Configure log rotation
# Update logging configuration
# Ensure log shipping is working
```

### Certificate Expiration

**Symptoms:**
- TLS/SSL errors
- Certificate warnings

**Diagnosis:**
```bash
# Check certificate expiration
echo | openssl s_client -servername platform-service -connect platform-service:443 2>/dev/null | \
  openssl x509 -noout -dates

# Check Kubernetes secrets
kubectl get secret tls-cert -o jsonpath='{.data.tls\.crt}' | \
  base64 -d | openssl x509 -noout -dates
```

**Resolution:**
```bash
# Renew certificate (cert-manager)
kubectl delete certificaterequest <request-name>

# Or manually update
kubectl create secret tls tls-cert-new \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key

kubectl patch ingress platform-ingress -p \
  '{"spec":{"tls":[{"secretName":"tls-cert-new"}]}}'
```

## Maintenance Windows

### Planned Maintenance Procedure

```bash
# 1. Notify stakeholders (24h advance)
# 2. Set up maintenance page

# 3. Scale down to maintenance mode
kubectl scale deployment platform-service --replicas=1

# 4. Perform maintenance
# - Database updates
# - Configuration changes
# - Infrastructure updates

# 5. Test thoroughly
curl https://platform-service/health

# 6. Scale back up
kubectl scale deployment platform-service --replicas=3

# 7. Monitor for issues
watch kubectl get pods -l app=platform-service

# 8. Notify stakeholders of completion
```

### Rolling Updates

```bash
# 1. Build and tag new image
docker build -t platform-service:v1.1.0 .

# 2. Push to registry
docker push platform-service:v1.1.0

# 3. Update deployment
kubectl set image deployment/platform-service \
  platform-service=platform-service:v1.1.0

# 4. Monitor rollout
kubectl rollout status deployment/platform-service

# 5. Verify new version
kubectl get pods -l app=platform-service -o jsonpath='{.items[0].spec.containers[0].image}'

# 6. Run smoke tests
./scripts/smoke-tests.sh

# 7. Rollback if issues
kubectl rollout undo deployment/platform-service
```

## Monitoring and Alerting

### Alert Response

When an alert fires:

1. **Acknowledge** the alert
2. **Assess** the severity and impact
3. **Investigate** using this runbook
4. **Remediate** the issue
5. **Document** actions taken
6. **Communicate** status to stakeholders
7. **Follow up** with post-mortem if needed

### Escalation

- **P0 (Critical)**: Immediate response, escalate to on-call lead
- **P1 (High)**: Response within 30 minutes
- **P2 (Medium)**: Response within 2 hours
- **P3 (Low)**: Response within 24 hours

## Contacts

- **On-Call Engineer**: [Slack channel / Phone]
- **Platform Team**: [Slack channel]
- **Database Team**: [Slack channel]
- **Security Team**: [Slack channel]

## Additional Resources

- Metrics Dashboard: https://grafana/d/platform
- Logs Dashboard: https://kibana/platform
- Tracing: https://jaeger/platform
- Wiki: https://wiki/platform
