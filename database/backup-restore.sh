#!/usr/bin/env bash

# ==============================================================================
# Ryzite PostgreSQL Backup & Restore Utility
# Usage:
#   Backup:  ./backup-restore.sh backup
#   Restore: ./backup-restore.sh restore <backup_file.sql.gz>
# ==============================================================================

set -e

DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_USER="${POSTGRES_USER:-ryzite_admin}"
DB_NAME="${POSTGRES_DB:-ryzite_db}"
DB_PASSWORD="${POSTGRES_PASSWORD:-ryzite_secure_password_2026}"
BACKUP_DIR="./backups"

export PGPASSWORD="$DB_PASSWORD"
mkdir -p "$BACKUP_DIR"

ACTION="$1"

if [ "$ACTION" = "backup" ]; then
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
  FILE="$BACKUP_DIR/ryzite_backup_${TIMESTAMP}.sql.gz"
  echo "📦 Creating compressed backup of '$DB_NAME' to $FILE..."
  pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" | gzip > "$FILE"
  echo "✅ Backup successfully saved to: $FILE"

elif [ "$ACTION" = "restore" ]; then
  RESTORE_FILE="$2"
  if [ -z "$RESTORE_FILE" ]; then
    echo "❌ Error: Please specify a backup file to restore."
    echo "Example: ./backup-restore.sh restore ./backups/ryzite_backup_20260101_120000.sql.gz"
    exit 1
  fi

  echo "⚠️ Warning: This will restore database '$DB_NAME' from $RESTORE_FILE."
  read -p "Are you sure you want to proceed? (y/N): " CONFIRM
  if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "🔄 Restoring database..."
    gunzip -c "$RESTORE_FILE" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"
    echo "✅ Database restore completed successfully!"
  else
    echo "Restoration cancelled."
  fi

else
  echo "Usage:"
  echo "  ./backup-restore.sh backup"
  echo "  ./backup-restore.sh restore <path_to_backup_file.sql.gz>"
fi
