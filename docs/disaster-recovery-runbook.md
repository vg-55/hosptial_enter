# Disaster Recovery Runbook

## Overview

This runbook provides step-by-step procedures for recovering the platform from various disaster scenarios.

## RTO/RPO Targets

- **RTO (Recovery Time Objective)**: 1 hour
- **RPO (Recovery Point Objective)**: 24 hours (daily backups)

## Scenarios

### 1. Complete Service Outage

#### Symptoms
- Service unreachable
- Health checks failing
- 5xx errors

#### Diagnosis Steps

```bash
# Check service status
kubectl get pods -l app=platform-service

# Check logs
kubectl logs -l app=platform-service --tail=100

# Check health endpoint
curl http://platform-service/health
```

#### Recovery Steps

1. **Identify Root Cause**
   ```bash
   # Check pod events
   kubectl describe pod <pod-name>
   
   # Check resource utilization
   kubectl top pods
   ```

2. **Restart Services**
   ```bash
   # Rolling restart
   kubectl rollout restart deployment/platform-service
   
   # Force recreate pods
   kubectl delete pods -l app=platform-service
   ```

3. **Scale Up if Needed**
   ```bash
   kubectl scale deployment platform-service --replicas=5
   ```

4. **Verify Recovery**
   ```bash
   # Check health
   curl http://platform-service/health
   
   # Check metrics
   curl http://platform-service/metrics | grep http_requests_total
   ```

### 2. Database Failure

#### Symptoms
- Database connection errors
- Health check showing database unhealthy
- Application errors related to database

#### Recovery Steps

1. **Check Database Status**
   ```bash
   # For Kubernetes
   kubectl get pods -l app=postgres
   kubectl logs -l app=postgres
   
   # For Docker
   docker-compose logs postgres
   ```

2. **Restore from Backup**
   ```bash
   # List available backups
   ls -lh backups/
   
   # Stop application
   kubectl scale deployment platform-service --replicas=0
   
   # Restore database
   export DB_PASSWORD=<password>
   ./scripts/backup-restore/restore-db.sh backups/backup_platform_db_YYYYMMDD_HHMMSS.sql.gz
   
   # Restart application
   kubectl scale deployment platform-service --replicas=3
   ```

3. **Verify Data Integrity**
   ```bash
   # Connect to database
   psql -h <db-host> -U postgres -d platform_db
   
   # Check table counts
   SELECT count(*) FROM <critical_table>;
   ```

### 3. Data Corruption

#### Symptoms
- Inconsistent data
- Application logic errors
- User reports of missing/incorrect data

#### Recovery Steps

1. **Isolate the Issue**
   - Identify affected tables/data
   - Determine corruption timeframe
   - Stop writes to affected data

2. **Point-in-Time Recovery**
   ```bash
   # Find backup closest to before corruption
   ls -lt backups/
   
   # Create snapshot of current state (for investigation)
   ./scripts/backup-restore/backup-db.sh
   mv backups/backup_platform_db_*.sql.gz backups/corrupted_state.sql.gz
   
   # Restore from clean backup
   ./scripts/backup-restore/restore-db.sh backups/backup_platform_db_YYYYMMDD_HHMMSS.sql.gz
   ```

3. **Verify and Reconcile**
   - Check audit logs for changes between backup and corruption
   - Export audit logs for reconciliation
   ```bash
   curl "http://platform-service/audit/export?startDate=YYYY-MM-DD&format=csv" > audit_reconciliation.csv
   ```

### 4. Security Breach

#### Immediate Actions

1. **Isolate Affected Systems**
   ```bash
   # Block external access
   kubectl apply -f k8s/emergency-network-policy.yaml
   
   # Scale down to minimal replicas
   kubectl scale deployment platform-service --replicas=1
   ```

2. **Preserve Evidence**
   ```bash
   # Export audit logs
   curl "http://platform-service/audit/export?format=json" > audit_breach_$(date +%Y%m%d).json
   
   # Capture pod logs
   kubectl logs -l app=platform-service --all-containers=true > pod_logs_$(date +%Y%m%d).log
   
   # Database snapshot
   ./scripts/backup-restore/backup-db.sh
   ```

3. **Rotate Credentials**
   ```bash
   # Update Kubernetes secrets
   kubectl delete secret platform-secrets
   kubectl create secret generic platform-secrets --from-env-file=.env.new
   
   # Restart pods to pick up new secrets
   kubectl rollout restart deployment/platform-service
   ```

4. **Investigate**
   - Review audit logs for unauthorized access
   - Check for data exfiltration
   - Identify attack vector

### 5. Regional Failure (Cloud Provider)

#### Recovery Steps

1. **Failover to Secondary Region**
   ```bash
   # Update DNS to point to secondary region
   # This depends on your DNS provider
   
   # Or update Kubernetes ingress
   kubectl apply -f k8s/ingress-secondary-region.yaml
   ```

2. **Restore Data in Secondary Region**
   ```bash
   # Copy latest backup to secondary region
   aws s3 cp s3://primary-backups/latest.sql.gz s3://secondary-backups/
   
   # Restore in secondary region
   ./scripts/backup-restore/restore-db.sh
   ```

3. **Verify Services**
   ```bash
   # Check all services are running
   kubectl get all -n platform
   
   # Run health checks
   curl https://secondary-region-endpoint/health
   ```

## Recovery Time Estimates

| Scenario | Estimated Recovery Time |
|----------|------------------------|
| Service Restart | 5-10 minutes |
| Database Restore | 15-30 minutes |
| Data Corruption Recovery | 30-60 minutes |
| Security Breach Response | 1-4 hours |
| Regional Failover | 30-60 minutes |

## Post-Recovery Actions

1. **Verify System Health**
   - All health checks passing
   - Metrics showing normal operation
   - No error spikes in logs

2. **Document Incident**
   - Create incident report
   - Document root cause
   - Update runbook with lessons learned

3. **Communicate with Stakeholders**
   - Notify affected users
   - Provide incident timeline
   - Share remediation steps

4. **Review and Improve**
   - Conduct post-mortem
   - Update monitoring/alerting
   - Improve automation

## Emergency Contacts

- **On-Call Engineer**: [phone/slack]
- **Platform Team Lead**: [phone/slack]
- **Security Team**: [phone/slack]
- **Infrastructure Team**: [phone/slack]

## Backup Verification

Regular backup verification schedule:
- Weekly: Restore backup to test environment
- Monthly: Full disaster recovery drill
- Quarterly: Cross-region failover test

## Automation Scripts

All DR scripts located in:
- `scripts/backup-restore/` - Backup/restore automation
- `scripts/disaster-recovery/` - Emergency response scripts
- `scripts/monitoring/` - Health check scripts
