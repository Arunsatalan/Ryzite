# 🐘 Ryzite PostgreSQL Database Architecture & Developer Setup Guide

This directory contains the database structure, schema DDL, seed data, Docker orchestration, migrations, and scripts to set up the Ryzite database on your own servers or cloud providers.

---

## 📁 Directory Structure

```text
database/
├── schema.sql              # Core PostgreSQL DDL (Tables, Types, Enums, Triggers, Indexes)
├── seeds.sql               # Production seed data (Services, Case Studies, Blogs, SEO)
├── docker-compose.yml      # Ready-to-run PostgreSQL 16 + pgAdmin 4 Docker container
├── setup.sh                # 1-Click automated database initialization shell script
├── backup-restore.sh       # Automated pg_dump backup & restore utility
├── connection.ts           # TypeScript database connection manager & pool configurations
├── README.md               # This setup guide
└── migrations/             # Incremental SQL migration scripts
    ├── 001_initial_schema.sql
    └── 002_create_indexes.sql
```

---

## 🚀 Quick Setup Options

### Option 1: Docker (Recommended for Local Dev & Containerized Production)

1. Navigate to the `database` folder:
   ```bash
   cd database
   ```

2. Start PostgreSQL 16 and pgAdmin 4:
   ```bash
   docker-compose up -d
   ```
   *PostgreSQL is automatically provisioned and populated with `schema.sql` and `seeds.sql` upon first launch.*

3. Access pgAdmin web interface:
   - URL: `http://localhost:5050`
   - Email: `admin@ryzite.com`
   - Password: `admin123`

---

### Option 2: Linux / VPS Server (Ubuntu 22.04 / 24.04 LTS / Debian)

1. **Install PostgreSQL 16:**
   ```bash
   sudo apt update
   sudo apt install -y postgresql postgresql-contrib
   ```

2. **Create Database & Dedicated User:**
   ```bash
   sudo -u postgres psql
   ```
   Run in SQL prompt:
   ```sql
   CREATE USER ryzite_admin WITH PASSWORD 'your_strong_password_here';
   CREATE DATABASE ryzite_db OWNER ryzite_admin;
   GRANT ALL PRIVILEGES ON DATABASE ryzite_db TO ryzite_admin;
   \q
   ```

3. **Run the Automated Setup Script:**
   ```bash
   chmod +x ./setup.sh
   POSTGRES_USER=ryzite_admin POSTGRES_PASSWORD='your_strong_password_here' POSTGRES_DB=ryzite_db ./setup.sh
   ```

---

### Option 3: Cloud Hosted (AWS RDS, Supabase, Neon, GCP Cloud SQL)

1. Create a PostgreSQL 15 or 16 instance on your provider.
2. Copy your connection URI string.
3. Import the schema and seed data directly:
   ```bash
   psql "postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require" -f ./schema.sql
   psql "postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require" -f ./seeds.sql
   ```

---

## 🔑 Environment Variables Configuration

Add the following to your root `.env` file:

```env
# Database Configuration
DATABASE_URL="postgresql://ryzite_admin:ryzite_secure_password_2026@localhost:5432/ryzite_db"
POSTGRES_HOST="localhost"
POSTGRES_PORT=5432
POSTGRES_USER="ryzite_admin"
POSTGRES_PASSWORD="ryzite_secure_password_2026"
POSTGRES_DB="ryzite_db"
DB_POOL_MAX=20
```

---

## 🗄️ Database Tables Overview

| Table | Purpose | Primary Key |
| :--- | :--- | :--- |
| `users` | Admin credentials, RBAC roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`) | `id` (UUID) |
| `services` | Agency offerings, features, pricing, deliverables | `id` (VARCHAR) |
| `projects` | Case studies, client outcomes, metrics, tech stack | `id` (VARCHAR) |
| `blog_posts` | Engineering articles, meta tags, AEO direct answers | `id` (VARCHAR) |
| `leads` | Inbound consultation requests, budgets, CRM status | `id` (VARCHAR) |
| `page_metadata` | Dynamic SEO title, description, schema JSON-LD | `id` (VARCHAR) |
| `site_analytics` | High-frequency telemetry events & conversion metrics | `id` (VARCHAR) |

---

## 🔄 Automated Backup & Disaster Recovery

- **Take a compressed backup:**
  ```bash
  ./backup-restore.sh backup
  ```
  *Backups are saved to `./backups/ryzite_backup_<TIMESTAMP>.sql.gz`.*

- **Restore from backup:**
  ```bash
  ./backup-restore.sh restore ./backups/ryzite_backup_20260101_120000.sql.gz
  ```
