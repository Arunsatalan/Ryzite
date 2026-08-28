-- ============================================================================
-- RYZITE POSTGRESQL DATABASE SCHEMA
-- Version: 1.0.0
-- Compatible with: PostgreSQL 14, 15, 16+
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'IN_DISCUSSION', 'PROPOSAL_SENT', 'WON', 'LOST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_category AS ENUM ('WEB_DEV', 'MOBILE_DEV', 'AI_AUTOMATION', 'CLOUD_DEVOPS', 'CONSULTING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_mockup_type AS ENUM ('DARK_DASHBOARD', 'MOBILE_CARDS', 'BOT_INTERFACE', 'ANALYTICS_SUITE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Automatic updated_at Trigger Function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4. Users Table (Admin & Team Members)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'ADMIN' NOT NULL,
    avatar TEXT,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- ----------------------------------------------------------------------------
-- 5. Services Table (Offerings, Pricing, Deliverables)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) DEFAULT 'web' NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    icon_name VARCHAR(64) NOT NULL,
    features TEXT[] DEFAULT '{}' NOT NULL,
    deliverables TEXT[] DEFAULT '{}' NOT NULL,
    tech_stack TEXT[] DEFAULT '{}' NOT NULL,
    timeline VARCHAR(128) NOT NULL,
    starting_price VARCHAR(64) NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    featured BOOLEAN DEFAULT true NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_timestamp_services
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- ----------------------------------------------------------------------------
-- 6. Projects Table (Case Studies, Client Work, Metrics)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    mockup_type VARCHAR(64) DEFAULT 'DARK_DASHBOARD' NOT NULL,
    metrics JSONB DEFAULT '[]'::jsonb NOT NULL,
    tech_stack TEXT[] DEFAULT '{}' NOT NULL,
    challenges TEXT[] DEFAULT '{}' NOT NULL,
    solutions TEXT[] DEFAULT '{}' NOT NULL,
    testimonial JSONB,
    live_url TEXT,
    sort_order INT DEFAULT 0 NOT NULL,
    featured BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_timestamp_projects
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- ----------------------------------------------------------------------------
-- 7. Blog Posts Table (Engineering Articles, AEO Direct Answers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(128) NOT NULL,
    tags TEXT[] DEFAULT '{}' NOT NULL,
    cover_image TEXT NOT NULL,
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    aeo_direct_answer TEXT NOT NULL,
    schema_data JSONB,
    read_time VARCHAR(64) DEFAULT '5 min read' NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE TRIGGER set_timestamp_blog_posts
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- ----------------------------------------------------------------------------
-- 8. Leads & CRM Table (Consultation Requests & Proposals)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    service_selected VARCHAR(255) NOT NULL,
    budget VARCHAR(128) NOT NULL,
    timeline VARCHAR(128) NOT NULL,
    message TEXT NOT NULL,
    status lead_status DEFAULT 'NEW' NOT NULL,
    notes TEXT,
    source VARCHAR(255) DEFAULT 'Website Consultation Form',
    ip_address VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_timestamp_leads
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- ----------------------------------------------------------------------------
-- 9. Page Metadata & SEO / SERP Config Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS page_metadata (
    id VARCHAR(64) PRIMARY KEY,
    page_key VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    canonical_url TEXT,
    og_image TEXT,
    site_name VARCHAR(255) DEFAULT 'Ryzite Software & AI Agency',
    twitter_handle VARCHAR(128) DEFAULT '@ryzite_agency',
    theme_color VARCHAR(32) DEFAULT '#0f172a',
    keywords TEXT[] DEFAULT '{}',
    serp_snippet JSONB,
    focus_keywords JSONB,
    organization_schema JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 10. SEO Focus Keywords & SERP Ranking Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_keywords (
    id VARCHAR(64) PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    search_volume VARCHAR(64) NOT NULL,
    difficulty VARCHAR(32) DEFAULT 'Medium' NOT NULL,
    target_page VARCHAR(255) DEFAULT '/' NOT NULL,
    target_position VARCHAR(128) NOT NULL,
    current_density NUMERIC(4,2) DEFAULT 0.00 NOT NULL,
    status VARCHAR(64) DEFAULT 'OPTIMIZED' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER set_timestamp_seo_keywords
BEFORE UPDATE ON seo_keywords
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- ----------------------------------------------------------------------------
-- 11. SEO & SERP Audit Logs Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    score INT NOT NULL,
    grade VARCHAR(16) NOT NULL,
    passed_checks INT NOT NULL,
    total_checks INT NOT NULL,
    checks JSONB NOT NULL,
    title_pixel_width INT NOT NULL,
    desc_pixel_width INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 12. Site Analytics & Event Log Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_analytics (
    id VARCHAR(64) PRIMARY KEY,
    event_name VARCHAR(128) NOT NULL,
    path VARCHAR(255) NOT NULL,
    referrer TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 13. Performance Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_keyword ON seo_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_seo_audit_logs_created_at ON seo_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON site_analytics(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON site_analytics(created_at DESC);
