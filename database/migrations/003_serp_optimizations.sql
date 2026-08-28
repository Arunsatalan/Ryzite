-- ============================================================================
-- Migration 003: SERP & Google Search Results Optimizations
-- Adds SERP settings, SEO focus keywords table, and live audit logging
-- ============================================================================

-- 1. Extend Page Metadata Table
ALTER TABLE page_metadata 
ADD COLUMN IF NOT EXISTS site_name VARCHAR(255) DEFAULT 'Ryzite Software & AI Agency',
ADD COLUMN IF NOT EXISTS twitter_handle VARCHAR(128) DEFAULT '@ryzite_agency',
ADD COLUMN IF NOT EXISTS theme_color VARCHAR(32) DEFAULT '#0f172a',
ADD COLUMN IF NOT EXISTS serp_snippet JSONB,
ADD COLUMN IF NOT EXISTS focus_keywords JSONB;

-- 2. Create SEO Focus Keywords Table
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

-- 3. Create SEO Audit Logs Table
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

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_seo_keywords_keyword ON seo_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_seo_audit_logs_created_at ON seo_audit_logs(created_at DESC);
