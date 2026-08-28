/**
 * Database Connection & Configuration Helper
 * Used by backend services when direct PostgreSQL connection is active
 */

export interface DatabaseConfig {
  connectionString: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
  maxConnections?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

export function getDatabaseConfig(): DatabaseConfig {
  const connectionString = process.env.DATABASE_URL || 'postgresql://ryzite_admin:ryzite_secure_password_2026@localhost:5432/ryzite_db';
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    connectionString,
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'ryzite_admin',
    password: process.env.POSTGRES_PASSWORD || 'ryzite_secure_password_2026',
    database: process.env.POSTGRES_DB || 'ryzite_db',
    ssl: isProduction && !connectionString.includes('localhost') ? { rejectUnauthorized: false } : false,
    maxConnections: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}

/**
 * Validates connection URI format
 */
export function isValidPostgresUri(uri: string): boolean {
  return /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/.test(uri) ||
         /^postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/.test(uri);
}
