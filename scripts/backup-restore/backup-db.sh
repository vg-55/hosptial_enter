#!/bin/bash

set -e

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-platform_db}"
DB_USER="${DB_USER:-postgres}"
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${TIMESTAMP}.sql"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

mkdir -p "${BACKUP_DIR}"

echo "Starting database backup..."
echo "Database: ${DB_NAME}"
echo "Host: ${DB_HOST}:${DB_PORT}"
echo "Backup file: ${BACKUP_FILE}"

if command -v pg_dump &> /dev/null; then
    PGPASSWORD="${DB_PASSWORD}" pg_dump \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -F c \
        -b \
        -v \
        -f "${BACKUP_FILE}.dump"
    
    PGPASSWORD="${DB_PASSWORD}" pg_dump \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        --no-owner \
        --no-acl \
        > "${BACKUP_FILE}"
    
    echo "Database backup completed successfully"
    echo "Backup files created:"
    echo "  - ${BACKUP_FILE} (SQL format)"
    echo "  - ${BACKUP_FILE}.dump (Custom format)"
else
    echo "Error: pg_dump not found. Please install PostgreSQL client tools."
    exit 1
fi

gzip "${BACKUP_FILE}"
echo "Backup compressed: ${BACKUP_FILE}.gz"

echo "Cleaning up old backups (older than ${RETENTION_DAYS} days)..."
find "${BACKUP_DIR}" -name "backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}" -name "backup_*.dump" -type f -mtime +${RETENTION_DAYS} -delete

echo "Backup metadata:"
ls -lh "${BACKUP_FILE}.gz" "${BACKUP_FILE}.dump"

echo "Backup process completed successfully at $(date)"
