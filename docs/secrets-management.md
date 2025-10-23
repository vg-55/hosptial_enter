# Secrets Management Documentation

## Overview

This platform supports multiple secrets management approaches for different deployment scenarios.

## Secrets Storage Options

### 1. Environment Variables (Development)

For local development, use environment variables:

```bash
# Copy example file
cp .env.example .env

# Generate encryption keys
echo "ENCRYPTION_MASTER_KEY=$(openssl rand -base64 32)" >> .env
echo "ENCRYPTION_SALT=$(openssl rand -base64 32)" >> .env

# Edit .env with your values
vi .env
```

**Security Notes:**
- Never commit `.env` files to version control
- Use `.env.example` for documentation only
- Rotate keys regularly (quarterly minimum)

### 2. Kubernetes Secrets (Production)

For Kubernetes deployments:

```bash
# Create secrets from file
kubectl create secret generic platform-secrets \
  --from-literal=db-password=<password> \
  --from-literal=encryption-master-key=<key> \
  --from-literal=encryption-salt=<salt>

# Or from file
kubectl create secret generic platform-secrets \
  --from-env-file=.env.production

# View secrets (base64 encoded)
kubectl get secret platform-secrets -o yaml

# Decode a secret
kubectl get secret platform-secrets -o jsonpath='{.data.db-password}' | base64 -d
```

**Security Notes:**
- Enable Kubernetes secrets encryption at rest
- Use RBAC to restrict secret access
- Enable audit logging for secret access
- Consider using sealed-secrets or external secrets operator

### 3. HashiCorp Vault (Recommended for Production)

#### Setup

```bash
# Enable Vault
export VAULT_ENABLED=true
export VAULT_ADDR=https://vault.example.com
export VAULT_TOKEN=<your-token>

# Or for development Vault server
docker run --cap-add=IPC_LOCK -d --name=vault -p 8200:8200 vault
export VAULT_ADDR=http://localhost:8200
export VAULT_TOKEN=root
```

#### Store Secrets

```bash
# Using Vault CLI
vault kv put secret/platform/db \
  host=localhost \
  port=5432 \
  name=platform_db \
  user=postgres \
  password=<password>

vault kv put secret/platform/encryption \
  master-key=<base64-key> \
  salt=<base64-salt>

# Using the platform API
# The SecretsManager will automatically use Vault when enabled
```

#### Retrieve Secrets

```typescript
import { secretsManager } from './security/secrets-manager';

// Get database credentials
const dbSecrets = await secretsManager.getSecret('secret/platform/db');
console.log(dbSecrets.host, dbSecrets.port);

// Get encryption keys
const encSecrets = await secretsManager.getSecret('secret/platform/encryption');
```

#### Vault Access Policies

```hcl
# Create policy for platform service
path "secret/data/platform/*" {
  capabilities = ["read"]
}

path "secret/metadata/platform/*" {
  capabilities = ["list"]
}
```

Apply policy:
```bash
vault policy write platform-service policy.hcl
vault token create -policy=platform-service
```

## Secret Types and Requirements

### Database Credentials

```yaml
# Required fields
DB_HOST: hostname or IP
DB_PORT: port number (default: 5432)
DB_NAME: database name
DB_USER: database username
DB_PASSWORD: strong password (min 16 chars)
```

**Password Requirements:**
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- No common words or patterns
- Rotate every 90 days

### Encryption Keys

```yaml
# Required fields
ENCRYPTION_MASTER_KEY: base64-encoded 32-byte key
ENCRYPTION_SALT: base64-encoded 16-byte salt
```

**Generation:**
```bash
# Master key (256-bit)
openssl rand -base64 32

# Salt (128-bit)
openssl rand -base64 16
```

**Key Rotation:**
1. Generate new keys
2. Update secrets in Vault/K8s
3. Restart services with new keys
4. Re-encrypt existing data (see migration script)
5. Archive old keys securely for 1 year

### API Keys and Tokens

```yaml
# External service credentials
THIRD_PARTY_API_KEY: service API key
OAUTH_CLIENT_ID: OAuth client ID
OAUTH_CLIENT_SECRET: OAuth client secret
```

## Secret Rotation

### Automated Rotation (Recommended)

Use Vault's dynamic secrets:

```bash
# Enable database secrets engine
vault secrets enable database

# Configure PostgreSQL
vault write database/config/platform \
  plugin_name=postgresql-database-plugin \
  allowed_roles="platform-role" \
  connection_url="postgresql://{{username}}:{{password}}@postgres:5432/platform_db" \
  username="vault" \
  password="vault-password"

# Create role with auto-rotation
vault write database/roles/platform-role \
  db_name=platform \
  creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}';" \
  default_ttl="1h" \
  max_ttl="24h"
```

### Manual Rotation

1. Generate new credentials
2. Update in secrets store
3. Test with canary deployment
4. Roll out to all pods
5. Verify no errors
6. Deactivate old credentials

```bash
# Kubernetes secret rotation
kubectl create secret generic platform-secrets-new \
  --from-env-file=.env.new

# Update deployment
kubectl set env deployment/platform-service \
  --from=secret/platform-secrets-new

# Verify
kubectl rollout status deployment/platform-service

# Clean up old secret
kubectl delete secret platform-secrets
kubectl rename secret platform-secrets-new platform-secrets
```

## Access Control

### Development
- Secrets stored in local `.env` file
- File permissions: 600 (owner read/write only)
- Never share secrets via chat/email

### Staging/Production
- Use Vault or Kubernetes secrets
- Implement least-privilege access
- Enable audit logging
- Regular access reviews

### RBAC Recommendations

```yaml
# Kubernetes RBAC for secrets
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  resourceNames: ["platform-secrets"]
  verbs: ["get"]
```

## Compliance Requirements

### PCI-DSS
- Encrypt all credentials in transit and at rest
- Rotate keys quarterly
- Limit access to authorized personnel
- Audit all access

### GDPR
- Document data encryption methods
- Maintain encryption key lifecycle
- Provide ability to delete data (right to erasure)

### SOC 2
- Implement secrets rotation
- Enable audit logging
- Regular access reviews
- Incident response procedures

## Troubleshooting

### Application Can't Read Secrets

```bash
# Check secret exists
kubectl get secret platform-secrets

# Check pod has access
kubectl auth can-i get secrets --as=system:serviceaccount:default:platform-service

# Check secret mounted correctly
kubectl exec -it <pod-name> -- env | grep DB_
```

### Vault Connection Issues

```bash
# Test Vault connectivity
curl $VAULT_ADDR/v1/sys/health

# Check token validity
vault token lookup

# Test secret read
vault kv get secret/platform/db
```

### Encryption Failures

```bash
# Verify encryption keys are set
echo $ENCRYPTION_MASTER_KEY | base64 -d | wc -c  # Should be 32
echo $ENCRYPTION_SALT | base64 -d | wc -c       # Should be 16

# Check logs for encryption errors
kubectl logs -l app=platform-service | grep -i encryption
```

## Security Best Practices

1. **Never log secrets** - Ensure logging redacts sensitive data
2. **Use separate secrets per environment** - Dev/staging/prod isolation
3. **Implement secret scanning** - Use tools like git-secrets, truffleHog
4. **Regular audits** - Review who has access to secrets
5. **Encryption at rest** - Enable for Kubernetes secrets and Vault
6. **Network security** - Use TLS for all secret transmissions
7. **Backup encryption keys** - Store securely offline
8. **Document recovery procedures** - Key recovery runbook

## Secret Scanning in CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/security.yml
- name: Secret Scanning
  run: |
    # Install truffleHog
    pip install truffleHog
    
    # Scan for secrets
    trufflehog --regex --entropy=True .
    
    # Fail on detection
    if [ $? -ne 0 ]; then
      echo "Secrets detected in code!"
      exit 1
    fi
```

## Emergency Procedures

### Secret Compromise

1. **Immediate Actions**
   - Rotate compromised secret immediately
   - Check audit logs for unauthorized access
   - Notify security team

2. **Investigation**
   - Review access logs
   - Identify scope of compromise
   - Determine attack vector

3. **Remediation**
   - Update all affected secrets
   - Review and update access controls
   - Document incident for compliance

### Key Recovery

Encryption keys should be backed up securely:
- Store offline in secure location
- Use key splitting (Shamir's Secret Sharing)
- Document recovery procedures
- Test recovery process quarterly
