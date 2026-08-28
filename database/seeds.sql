-- ============================================================================
-- RYZITE POSTGRESQL SEED SCRIPT
-- Populates initial high-quality services, case studies, blogs, leads & SEO
-- ============================================================================

-- 1. Create Default Super Admin (password: ryzite_secure_admin)
INSERT INTO users (id, email, name, password_hash, role, avatar)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin@ryzite.com',
    'Ryzite System Admin',
    '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1p3pE2uWzH5yFjT8aLzZ0oO8eFjY.G', -- bcrypt hash
    'SUPER_ADMIN',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
) ON CONFLICT (email) DO NOTHING;

-- 2. Seed Services
INSERT INTO services (id, slug, title, category, short_description, full_description, icon_name, features, deliverables, tech_stack, timeline, starting_price, sort_order, featured, active)
VALUES 
(
    'srv-1',
    'custom-software-engineering',
    'Custom Software & Web Platforms',
    'web',
    'Enterprise-grade full-stack applications with high concurrency, micro-architectures, and real-time data streaming.',
    'We engineer mission-critical web applications, enterprise ERP/CRM dashboards, and high-throughput SaaS platforms designed to scale seamlessly across millions of active requests.',
    'Code',
    ARRAY['Event-driven microservices architecture', 'Sub-100ms API response latency', 'Real-time WebSocket data synchronization', 'Multi-tenant database segregation', 'PCI-DSS & SOC2 compliance preparation'],
    ARRAY['Full TypeScript source code repository', 'Automated CI/CD deployment pipelines', 'Comprehensive Swagger/OpenAPI documentation', 'Infrastructure-as-Code Terraform modules', '60-day hypercare technical support'],
    ARRAY['React 19', 'Next.js 15', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    '6 - 12 Weeks',
    '$15,000',
    1,
    true,
    true
),
(
    'srv-2',
    'ai-automation-agents',
    'AI Solutions & Autonomous Agents',
    'ai',
    'Domain-specific LLM workflows, autonomous task agents, RAG knowledge retrieval, and predictive analytics pipelines.',
    'Harness the cutting edge of artificial intelligence. We build custom Gemini and Claude-powered agentic systems that automate complex corporate workflows, synthesize unstructured data, and generate proactive business intelligence.',
    'Sparkles',
    ARRAY['Retrieval-Augmented Generation (RAG) on proprietary docs', 'Autonomous multi-step task execution agents', 'Real-time speech & multimodal vision pipelines', 'Fine-tuned domain model deployment', 'Zero-data-retention security boundaries'],
    ARRAY['Private Vector Database & Embedding pipeline', 'Fine-tuned LLM inference service', 'Interactive conversational dashboard', 'Evaluation test suite & prompt regression metrics', 'Monitoring & cost-optimization telemetry'],
    ARRAY['Gemini 2.5', 'Python', 'FastAPI', 'LangChain', 'pgvector', 'Pinecone', 'PyTorch'],
    '4 - 8 Weeks',
    '$12,500',
    2,
    true,
    true
),
(
    'srv-3',
    'mobile-app-development',
    'Native & Cross-Platform Mobile Apps',
    'mobile',
    'Fluid, 60fps iOS and Android applications built for engaging customer experiences and offline-first reliability.',
    'Native and high-performance cross-platform mobile apps for consumer fintech, on-demand logistics, and connected IoT ecosystems with biometric security.',
    'Smartphone',
    ARRAY['Biometric auth (FaceID & Fingerprint)', 'Offline-first SQLite / WatermelonDB sync', 'Push notifications & rich in-app messaging', 'App Store & Google Play submission guarantee', 'Real-time GPS tracking & mapping layers'],
    ARRAY['iOS TestFlight and Android APK builds', 'Production App Store distribution approval', 'Figma design system and UI motion assets', 'Crashlytics and performance telemetry dashboard', 'Annual OS upgrade compatibility roadmap'],
    ARRAY['React Native', 'Swift', 'Kotlin', 'Expo EAS', 'GraphQL', 'Firebase'],
    '8 - 14 Weeks',
    '$18,000',
    3,
    true,
    true
),
(
    'srv-4',
    'cloud-devops-infrastructure',
    'Cloud Architecture & DevOps',
    'cloud',
    'Resilient Kubernetes clusters, zero-downtime CI/CD automation, and multi-region cloud security hardening.',
    'Eliminate infrastructure bottlenecks. We architect elastic cloud infrastructures on GCP, AWS, and Azure that self-heal, auto-scale during traffic spikes, and slash monthly hosting overhead.',
    'Cloud',
    ARRAY['Zero-downtime blue/green deployment orchestration', 'Infrastructure-as-Code with Terraform & Pulumi', 'Multi-cloud disaster recovery & replication', 'Automated security posture & secrets management', '24/7 synthetic monitoring & alerting setup'],
    ARRAY['Containerized Docker & Kubernetes specs', 'Multi-stage GitHub Actions / GitLab pipelines', 'Cost-optimization report with guaranteed savings', 'SOC2 Compliance security audit report', 'Emergency rollback runbooks and SLA guide'],
    ARRAY['Google Cloud Run', 'AWS ECS/EKS', 'Terraform', 'Kubernetes', 'Prometheus', 'Datadog'],
    '3 - 6 Weeks',
    '$8,500',
    4,
    true,
    true
),
(
    'srv-5',
    'seo-aeo-digital-marketing',
    'Technical SEO & AEO Dominance',
    'marketing',
    'Algorithmic search optimization, AI direct-answer indexing (GEO), and programmatic conversion funnels.',
    'Dominate both classic search engines and next-gen AI search engines (ChatGPT Search, Perplexity, Google AI Overviews). We re-engineer web speed, implement rich JSON-LD knowledge graphs, and build authority.',
    'TrendingUp',
    ARRAY['Core Web Vitals sub-1.0s LCP optimization', 'Answer Engine Optimization (AEO) entity graphs', 'Automated programmatic SEO landing pages', 'Schema.org multi-type rich snippet injection', 'Competitor keyword gap analysis & backlink pipeline'],
    ARRAY['Full Core Web Vitals 99+ Speed Certification', 'Schema JSON-LD Knowledge Graph architecture', 'Custom high-intent content strategy (20+ articles)', 'AEO AI Overviews positioning audit', 'Monthly rank & conversion telemetry reports'],
    ARRAY['Google Search Console', 'Ahrefs', 'Schema.org', 'Lighthouse', 'Vercel Edge', 'Cloudflare Workers'],
    'Continuous / 3+ Mo',
    '$6,000 / mo',
    5,
    true,
    true
),
(
    'srv-6',
    'ui-ux-design-systems',
    'Product Design & UI/UX Systems',
    'web',
    'Human-centered design systems, high-fidelity micro-interactions, and conversion-focused wireframing.',
    'We transform complex software concepts into sleek, intuitive interfaces that delight users and drive conversions with mathematical typographic rhythm and frictionless UX flows.',
    'Layers',
    ARRAY['Atomic Figma component design libraries', 'Interactive clickable prototype simulations', 'Usability testing & heatmap user studies', 'Accessibility WCAG AAA contrast audits', 'Design token export for React & Tailwind'],
    ARRAY['Complete Figma master design system', 'Interactive high-fidelity prototype links', 'Design token repository (JSON & Tailwind)', 'Iconography & custom 3D asset package', 'Design-to-code developer handoff specs'],
    ARRAY['Figma', 'Storybook', 'Tailwind CSS', 'Framer Motion', 'Lottie'],
    '4 - 6 Weeks',
    '$9,000',
    6,
    true,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Projects
INSERT INTO projects (id, slug, title, client, category, description, long_description, hero_image, mockup_type, metrics, tech_stack, challenges, solutions, testimonial, live_url, sort_order, featured)
VALUES
(
    'proj-1',
    'novasphere-enterprise-ai',
    'NovaSphere Enterprise AI Analytics Suite',
    'NovaSphere Global Inc.',
    'AI & Enterprise Platform',
    'High-throughput predictive intelligence dashboard processing over 12M daily customer telemetry events.',
    'NovaSphere needed an enterprise-grade AI analytics suite capable of synthesizing fragmented customer touchpoints across 40 countries in real-time. Ryzite architected a microservices data pipeline powered by Gemini LLM agents and distributed PostgreSQL with TimescaleDB.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    'DARK_DASHBOARD',
    '[{"label": "Query Latency", "value": "18ms", "trend": "-84%"}, {"label": "Daily Events", "value": "14.2M", "trend": "+320%"}, {"label": "Data Accuracy", "value": "99.98%", "trend": "+12%"}]'::jsonb,
    ARRAY['React 19', 'Next.js', 'PostgreSQL', 'Redis', 'Python', 'Docker', 'Google Cloud'],
    ARRAY['Legacy relational database bottlenecking at 50,000 concurrent queries', 'Unstructured customer logs taking up to 48 hours to parse', 'Complex cross-region data residency compliance constraints'],
    ARRAY['Re-architected to an event-driven Kafka and PostgreSQL pipeline with sub-20ms latency', 'Deployed custom RAG agent synthesizing multi-lingual logs in under 2 seconds', 'Enforced automated tenant isolation with row-level encryption'],
    '{"quote": "Ryzite delivered what two global consulting firms said was impossible in 6 months. Our queries went from 12 seconds to 18 milliseconds.", "author": "Marcus Vance", "role": "VP of Engineering, NovaSphere", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}'::jsonb,
    'https://novasphere.example.com',
    1,
    true
),
(
    'proj-2',
    'pulseflow-fintech-mobile',
    'PulseFlow Cross-Border Neo-Banking App',
    'PulseFlow Technologies',
    'Fintech Mobile App',
    'Sub-second cross-currency remittance platform with biometric multi-factor authentication.',
    'PulseFlow is a modern fintech app enabling instant remittances between North America and Southeast Asia. Ryzite built the mobile client with offline-first synchronization, biometric hardware keys, and 60fps gesture animations.',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    'MOBILE_CARDS',
    '[{"label": "App Store Rating", "value": "4.9 / 5.0", "trend": "Top 10"}, {"label": "Monthly Volume", "value": "$42M+", "trend": "+180%"}, {"label": "Crash-Free Rate", "value": "99.99%", "trend": "Perfect"}]'::jsonb,
    ARRAY['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe API', 'Firebase'],
    ARRAY['Strict PCI-DSS compliance and financial audit requirements', 'Unreliable mobile connectivity in remote recipient territories', 'High volatility currency exchange conversions requiring real-time rate locking'],
    ARRAY['Zero-storage client architecture with end-to-end tokenized vaulting', 'Offline SQLite journal queuing that syncs seamlessly upon network reconnection', 'WebSockets server push updating currency tickers every 250ms with 15-second rate freezes'],
    '{"quote": "The UX is unmatched. Our customer retention jumped 42% after the Ryzite-built v2.0 launch.", "author": "Elena Rostova", "role": "Chief Product Officer, PulseFlow", "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"}'::jsonb,
    'https://pulseflow.example.com',
    2,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Blog Posts
INSERT INTO blog_posts (id, slug, title, excerpt, content, category, tags, cover_image, meta_title, meta_description, aeo_direct_answer, read_time, published)
VALUES
(
    'blog-1',
    'how-to-architect-nextjs-postgresql-microservices-2026',
    'Architecting Next.js 15 & PostgreSQL Microservices for 10M+ Requests',
    'A comprehensive blueprint for zero-downtime, sub-100ms enterprise full-stack systems using connection pooling and caching.',
    'Building modern software applications in 2026 demands decoupling your user-facing interfaces from high-throughput backend services. In this guide, the Ryzite engineering team breaks down how we structure multi-tenant PostgreSQL databases with PgBouncer connection pooling, Redis streaming layers, and Next.js edge runtime renderers to achieve sustained sub-100ms response times.',
    'Architecture',
    ARRAY['Next.js', 'PostgreSQL', 'Microservices', 'DevOps'],
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    'Next.js 15 & PostgreSQL Microservices Architecture Blueprint | Ryzite',
    'Learn how to architect high-concurrency software with Next.js 15, PostgreSQL connection pools, and event-driven microservices.',
    'To scale Next.js with PostgreSQL to 10M+ requests, deploy a stateless Next.js edge frontend coupled with a dedicated PgBouncer connection pooler, Redis for sub-5ms caching, and read-replicas for data queries.',
    '7 min read',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Page Metadata & SERP Config
INSERT INTO page_metadata (id, page_key, title, description, canonical_url, og_image, site_name, twitter_handle, theme_color, keywords, serp_snippet, focus_keywords, organization_schema)
VALUES
(
    'meta-home',
    'home',
    'Ryzite | Elite Software Development, AI Solutions & Digital Marketing Agency',
    'Scale your business with high-performance custom web applications, AI automation agents, mobile apps, and technical SEO engineered by Ryzite.',
    'https://ryzite.com',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    'Ryzite Software & AI Agency',
    '@ryzite_agency',
    '#0f172a',
    ARRAY['Software Development Agency', 'Custom Web Applications', 'AI Solutions', 'PostgreSQL Development', 'Next.js Agency', 'Technical SEO', 'Mobile App Development'],
    '{
      "pageTitle": "Ryzite | Elite Software Development & Digital Marketing Agency",
      "metaDescription": "Scale your business with high-performance custom web applications, AI automation agents, mobile apps, and technical SEO engineered by Ryzite.",
      "slug": "",
      "breadcrumb": "Home",
      "displayUrl": "https://ryzite.com",
      "enableRichSnippets": true,
      "starRating": 4.9,
      "reviewCount": 142,
      "priceRange": "$$$$",
      "sitelinks": [
        {"label": "Web Development", "url": "#services", "description": "Enterprise React & Next.js high-concurrency platforms."},
        {"label": "AI & Automation", "url": "#services", "description": "Custom LLMs, autonomous agents & RAG workflows."},
        {"label": "Case Studies", "url": "#portfolio", "description": "Real-world client outcomes & performance metrics."},
        {"label": "Get an AI Scope Estimate", "url": "#contact", "description": "Instant project architecture & timeline estimator."}
      ],
      "aiOverviewAnswer": "Ryzite is a premier software development and digital marketing agency specializing in custom full-stack web applications, AI automation agents (Gemini & OpenAI), native mobile apps, and technical SEO/AEO strategies with guaranteed 95+ Core Web Vitals performance.",
      "aiKeyTakeaways": [
        "Sub-100ms API response latency with decoupled microservices",
        "Custom RAG knowledge pipelines and autonomous agents",
        "Full-cycle delivery: Design, development, CI/CD and 24/7 SLA maintenance"
      ]
    }'::jsonb,
    '[
      {"id": "kw-1", "keyword": "Custom Software Development Agency", "searchVolume": "18,500/mo", "difficulty": "Medium", "targetPage": "/", "targetPosition": "#3 on Google SERP", "currentDensity": 2.8, "status": "OPTIMIZED"},
      {"id": "kw-2", "keyword": "Enterprise AI Agent Development", "searchVolume": "12,200/mo", "difficulty": "Low", "targetPage": "/services/ai-automation-solutions", "targetPosition": "#1 in AI Overviews", "currentDensity": 3.4, "status": "OPTIMIZED"},
      {"id": "kw-3", "keyword": "Next.js Full Stack Development Company", "searchVolume": "9,800/mo", "difficulty": "Medium", "targetPage": "/services/web-application-development", "targetPosition": "#4 on Google SERP", "currentDensity": 2.1, "status": "OPTIMIZED"},
      {"id": "kw-4", "keyword": "Answer Engine Optimization Agency", "searchVolume": "6,400/mo", "difficulty": "Low", "targetPage": "/#aeo", "targetPosition": "#2 in Perplexity & GEO", "currentDensity": 2.5, "status": "OPTIMIZED"}
    ]'::jsonb,
    '{
      "name": "Ryzite",
      "url": "https://ryzite.com",
      "logo": "https://ryzite.com/assets/logo.png",
      "telephone": "+1-800-555-0199",
      "email": "contact@ryzite.com",
      "address": "100 Innovation Way, Suite 400, San Francisco, CA 94105",
      "sameAs": ["https://twitter.com/ryzite_agency", "https://linkedin.com/company/ryzite", "https://github.com/ryzite"]
    }'::jsonb
)
ON CONFLICT (page_key) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  serp_snippet = EXCLUDED.serp_snippet,
  focus_keywords = EXCLUDED.focus_keywords;

-- 6. Seed SEO Focus Keywords
INSERT INTO seo_keywords (id, keyword, search_volume, difficulty, target_page, target_position, current_density, status)
VALUES
('kw-1', 'Custom Software Development Agency', '18,500/mo', 'Medium', '/', '#3 on Google SERP', 2.80, 'OPTIMIZED'),
('kw-2', 'Enterprise AI Agent Development', '12,200/mo', 'Low', '/services/ai-automation-solutions', '#1 in AI Overviews', 3.40, 'OPTIMIZED'),
('kw-3', 'Next.js Full Stack Development Company', '9,800/mo', 'Medium', '/services/web-application-development', '#4 on Google SERP', 2.10, 'OPTIMIZED'),
('kw-4', 'Answer Engine Optimization Agency', '6,400/mo', 'Low', '/#aeo', '#2 in Perplexity & GEO', 2.50, 'OPTIMIZED'),
('kw-5', 'PostgreSQL Database Architecture Consulting', '5,100/mo', 'High', '/blog', '#6 on Google SERP', 1.40, 'NEEDS_ATTENTION')
ON CONFLICT (id) DO NOTHING;

-- 7. Seed SEO Audit Log
INSERT INTO seo_audit_logs (score, grade, passed_checks, total_checks, checks, title_pixel_width, desc_pixel_width)
VALUES (
    98,
    'A+',
    6,
    6,
    '[
      {"id": "chk-1", "category": "TITLE", "title": "Google SERP Title Length (Pixel & Character Fit)", "status": "PASS", "impact": "HIGH"},
      {"id": "chk-2", "category": "DESCRIPTION", "title": "Meta Description Optimal Length & CTR Hooks", "status": "PASS", "impact": "HIGH"},
      {"id": "chk-3", "category": "SCHEMA", "title": "Schema.org JSON-LD Rich Snippet Verification", "status": "PASS", "impact": "HIGH"},
      {"id": "chk-4", "category": "SPEED", "title": "Core Web Vitals Search Ranking Signals", "status": "PASS", "impact": "HIGH"},
      {"id": "chk-5", "category": "AEO", "title": "Generative AI Overview (GEO/AEO) Entity Extraction", "status": "PASS", "impact": "MEDIUM"},
      {"id": "chk-6", "category": "SOCIAL", "title": "Open Graph (OG) & Twitter Card Meta Tags", "status": "PASS", "impact": "MEDIUM"}
    ]'::jsonb,
    510,
    880
);
