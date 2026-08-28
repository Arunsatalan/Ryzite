-- Migration: 001_initial_schema.sql
-- Description: Creates extensions, enums, triggers, and core tables

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'IN_DISCUSSION', 'PROPOSAL_SENT', 'WON', 'LOST');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE TABLE IF NOT EXISTS page_metadata (
    id VARCHAR(64) PRIMARY KEY,
    page_key VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    canonical_url TEXT,
    og_image TEXT,
    keywords TEXT[] DEFAULT '{}',
    organization_schema JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS site_analytics (
    id VARCHAR(64) PRIMARY KEY,
    event_name VARCHAR(128) NOT NULL,
    path VARCHAR(255) NOT NULL,
    referrer TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
