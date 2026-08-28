#!/usr/bin/env bash

# ==============================================================================
# Ryzite PostgreSQL Automated Setup Script
# Usage: ./setup.sh
# ==============================================================================

set -e

# Default variables or load from .env
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_USER="${POSTGRES_USER:-ryzite_admin}"
DB_NAME="${POSTGRES_DB:-ryzite_db}"
DB_PASSWORD="${POSTGRES_PASSWORD:-ryzite_secure_password_2026}"

echo "================================================================"
echo "⚡ Ryzite PostgreSQL Database Automated Setup"
echo "================================================================"
echo "Host:     $DB_HOST:$DB_PORT"
echo "Database: $DB_NAME"
echo "User:     $DB_USER"
echo "================================================================"

export PGPASSWORD="$DB_PASSWORD"

# 1. Test PostgreSQL connection
echo "🔍 Checking PostgreSQL server connectivity..."
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; then
  echo "⚠️ Warning: Cannot connect directly with pg_isready."
  echo "If you are running in Docker, run: docker-compose up -d inside /database"
  echo "Continuing with psql execution..."
fi

# 2. Check if database exists, create if not
echo "📦 Ensuring database '$DB_NAME' exists..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"

# 3. Apply Schema
echo "🏗️ Applying schema.sql (tables, enums, triggers, indexes)..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f ./schema.sql

# 4. Apply Seed Data
echo "🌱 Populating initial seed data (services, projects, blogs, SEO)..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f ./seeds.sql

echo "================================================================"
echo "✅ PostgreSQL Database setup completed successfully!"
echo "Connection URL: postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo "================================================================"
