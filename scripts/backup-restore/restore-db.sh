#!/bin/bash

set -e

BACKUP_DIR="${BACKUP_DIR:-./backups}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-platform_db}"
DB_USER="${DB_USER:-postgres}"

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file>"
    echo ""
    echo "Available backups:"
    ls -lht "${BACKUP_DIR}"/backup_*.{sql.gz,dump} 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

echo "WARNING: This will restore the database from backup."
echo "Database: ${DB_NAME}"
echo "Host: ${DB_HOST}:${DB_PORT}"
echo "Backup file: ${BACKUP_FILE}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo "Starting database restore..."

if [[ "${BACKUP_FILE}" == *.gz ]]; then
    echo "Decompressing backup file..."
    gunzip -k "${BACKUP_FILE}"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

if [[ "${BACKUP_FILE}" == *.dump ]]; then
    echo "Restoring from custom format dump..."
    PGPASSWORD="${DB_PASSWORD}" pg_restore \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -v \
        --clean \
        --if-exists \
        "${BACKUP_FILE}"
elif [[ "${BACKUP_FILE}" == *.sql ]]; then
    echo "Restoring from SQL dump..."
    PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -f "${BACKUP_FILE}"
else
    echo "Error: Unsupported backup file format"
    exit 1
fi

echo "Database restore completed successfully at $(date)"
echo "Please verify the restored data."
